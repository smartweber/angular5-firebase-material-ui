import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';

import { PurehttpService } from '../../services/purehttp.service';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';

@Component({
  selector: 'app-sensor-map',
  templateUrl: './sensor-map.component.html',
  styleUrls: ['./sensor-map.component.scss']
})
export class SensorMapComponent implements OnInit, OnDestroy {
  customerSub: any;
  zoneSub: any;
  sensorSub: any;

  customers: Object[];
  zones: Object[];
  sensors: Object[];

  isPageLoad: boolean;
  isGetCustomers: boolean;
  isGetZones: boolean;
  isGetSensors: boolean;
  isAuthorize: boolean;

  errorMessage: string;

  constructor(
    private _activeRoute: ActivatedRoute,
    private _purehttpService: PurehttpService
  ) {
    this.isPageLoad = false;
    this.isGetCustomers = false;
    this.isGetZones = false;
    this.isGetSensors = false;
    this.isAuthorize = false;

    this.customers = [];
    this.zones = [];
    this.sensors = [];

    this.errorMessage = '';
  }

  ngOnInit() {

    this._activeRoute.queryParams.subscribe(params => {
      const code = params['code'];
      if (code === 'mrxnrsjmhpxvlpz') {
        const strFireFunctionUrl = global_variables['FirebaseFunctionUrlCloud']; // cloud
        // let strFireFunctionUrl = global_variables.FirebaseFunctionUrlLocal; // local

        // customer data
        let objPostData = {
          url: environment['APIS']['CUSTOMERS']
        };

        this.customerSub = this._purehttpService
          .callFirebaseFunction(`${strFireFunctionUrl}/getDatabase`, objPostData).subscribe((res: any) => {
          if (res.status === 'success') {
            this.customers = res.data;
            this.isGetCustomers = true;
            this.checkLoad();
          } else {
            this.isPageLoad = true;
            this.isAuthorize = false;
            this.errorMessage = 'Server error.';
          }
        }, error => {
          this.isPageLoad = true;
          this.isAuthorize = false;
          this.errorMessage = 'Internet connection error.';
        });

        // zone data
        objPostData = {
          url: environment['APIS']['ZONES']
        };

        this.zoneSub = this._purehttpService
          .callFirebaseFunction(`${strFireFunctionUrl}/getDatabase`, objPostData).subscribe((res: any) => {
          if (res.status === 'success') {
            this.zones = res.data;
            this.isGetZones = true;
            this.checkLoad();
          } else {
            this.isPageLoad = true;
            this.isAuthorize = false;
            this.errorMessage = 'Server error.';
          }
        }, error => {
          this.isPageLoad = true;
          this.isAuthorize = false;
          this.errorMessage = 'Internet connection error.';
        });

        // sensor data
        objPostData = {
          url: environment['APIS']['SENSORS']
        };

        this.sensorSub = this._purehttpService
          .callFirebaseFunction(`${strFireFunctionUrl}/getDatabase`, objPostData).subscribe((res: any) => {
          if (res.status === 'success') {
            this.sensors = res.data;
            this.isGetSensors = true;
            this.checkLoad();
          } else {
            this.isPageLoad = true;
            this.isAuthorize = false;
            this.errorMessage = 'Server error.';
          }
        }, error => {
          this.isPageLoad = true;
          this.isAuthorize = false;
          this.errorMessage = 'Internet connection error.';
        });

      } else {
        this.isPageLoad = true;
        this.isAuthorize = false;
        this.errorMessage = 'Your code is invalid.';
      }
    });
  }

  ngOnDestroy() {
    if (this.customerSub) {
      this.customerSub.unsubscribe();
    }

    if (this.zoneSub) {
      this.customerSub.unsubscribe();
    }

    if (this.sensorSub) {
      this.customerSub.unsubscribe();
    }
  }

  checkLoad() {
    if (this.isGetCustomers && this.isGetZones && this.isGetSensors) {
      this.zones = this.zones.map(item => {
        item['sensors'] = [];
        return item;
      });

      if (this.sensors) {
        for (let i = 0; i < this.sensors.length; i++) {
          this.filterSensorsToZone(this.sensors[i]);
        }
      }

      this.isPageLoad = true;
      this.isAuthorize = true;
    }
  }

  filterSensorsToZone(sensor: Object) {
    const filterZoneList = this.zones.filter(function(e) {
      return e['key'] === sensor['zoneId'];
    });

    if (filterZoneList && filterZoneList.length > 0) {
      filterZoneList[0]['sensors'].push(sensor);
    }
  }
}
