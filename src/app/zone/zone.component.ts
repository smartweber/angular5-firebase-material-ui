import { Component,
  OnInit,
  OnDestroy,
  OnChanges,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  MatSnackBar
} from '@angular/material';
import { environment } from '../../environments/environment.dev';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';
import { SpinnerService } from '../components/spinner/spinner.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit, OnChanges, OnDestroy {
  bIsMap: boolean;
  bIsLoading: boolean;
  bIsGettingZones: boolean;
  bIsGettingSensors: boolean;

  zones: any[];
  sensors: any[];

  status: number;
  nMAHeight: number;

  customerId: string;
  strZoneKey: string;
  strSensorKey: string;

  activeRouteSub: Subscription;
  zoneSub: Subscription;
  sensorSub: Subscription;

  focusCoordinate: Object;

  @ViewChild('zoneTopBarScreen') zoneTopBarScreen: ElementRef;
  @ViewChild('customerMAScreen') customerMAScreen: ElementRef;
  @ViewChild('zoneList') zoneList: ElementRef;

  constructor(
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _httpService: HttpService,
    private _authService: AuthService,
    private _spinner: SpinnerService,
    private _snackBar: MatSnackBar
    ) {
  }

  ngOnInit() {
    this.bIsMap = false;
    this.bIsGettingZones = false;
    this.bIsGettingSensors = false;
    this.status = 0;

    if (this._authService.isCheckUser && this._authService.isUserEmailLoggedIn) { // get the user auth status already
      this.getData();
    }

    this.activeRouteSub = this._activeRoute.queryParams.subscribe(params => {
      if (params['type'] === 'list') {
        this.status = 1;
      } else {
        this.status = 0;
      }
      this.strZoneKey   = params['zoneId'];
      this.strSensorKey = params['sensorId'];
    });
  }

  ngOnDestroy() {
    if (this.activeRouteSub) {
      this.activeRouteSub.unsubscribe();
    }

    this.destorySub();
  }

  ngOnChanges() {
  }

  destorySub() {
    if (this.zoneSub) {
      this.zoneSub.unsubscribe();
    }

    if (this.sensorSub) {
      this.sensorSub.unsubscribe();
    }
  }

  gotoSensorStatus(event: any) {
    if (!this.customerId) {
      this._router.navigate(['/zone'], { queryParams: {type: 'list', zoneId: event.zoneKey, sensorId: event.sensorKey} });
    } else {
      this._router.navigate(
        [`/${this.customerId}/zone`],
        { queryParams: {type: 'list', zoneId: event.zoneKey, sensorId: event.sensorKey} });
    }
  }

  // get data from backend
  getData() {
    const userData = this._authService.userData;

    if (!userData) {
      this._snackBar.open('User data is not enough', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      this._authService.logout();
      return;
    }

    this.customerId = userData['info']['customerId'] ? userData['info']['customerId'] : '';
    this._spinner.start();

    this.destorySub();
    this.bIsLoading = false;

    if (!this._authService.isUserStaff) { // customer case
      this.zoneSub = this._httpService.getListByOrder(environment.APIS.ZONES, 'customerId', this.customerId).subscribe(zones => {
        this.zones = zones;
        this.bIsGettingZones = true;
        this.checkLoad();
      },
      error => {
        console.log('You do not have permission for the Zones');
        console.log(error);
      });

      this.sensorSub = this._httpService.getListByOrder(environment.APIS.SENSORS, 'customerId', this.customerId).subscribe(sensors => {
        this.sensors = sensors;

        this.bIsGettingSensors = true;
        this.checkLoad();
      },
      error => {
        console.log('You do not have permission for the Sensors');
        console.log(error);
      });
    } else { // staff case
      this.zoneSub = this._httpService.getAsList(environment.APIS.ZONES).subscribe(zones => {
        this.zones = zones;
        this.bIsGettingZones = true;
        this.checkLoad();
      },
      error => {
        console.log('You do not have permission for the Zones');
        console.log(error);
      });

      this.sensorSub = this._httpService.getAsList(environment.APIS.SENSORS).subscribe(sensors => {
        this.sensors = sensors;

        this.bIsGettingSensors = true;
        this.checkLoad();
      },
      error => {
        console.log('You do not have permission for the Sensors');
        console.log(error);
      });
    }
  }

  checkLoad() {
    let count = 0;
    if (this.bIsGettingZones) {
      count ++;
    }

    if (this.bIsGettingSensors) {
      count ++;
    }

    if (count >= 2) {
      this.zones = this.zones.map(item => {
        item.sensors = [];
        item.total = 0;
        item.offTotal = 0;
        return item;
      });

      this.makeZoneList();
      this.setMainHeight();
      this._spinner.stop();
      this.bIsLoading = true;
    }
  }

  // set the offTotal and total of the zone
  setZoneCount(zone: any) {
    for (let i = 0; i < zone['sensors'].length; i++) {
      const sensor = zone ['sensors'][i];
      zone['total'] += 1 ;
      if (sensor['availability'] === 'off') {
        zone['offTotal'] += 1;
      }
    }
  }

  // put sensors to their zones
  makeZoneList() {
    for (let i = 0; i < this.sensors.length; i++) {
      this.getZone(this.sensors[i]);
    }
  }

  // push the sensor to their zone
  getZone(sensor: Object) {
    const filterZoneList = this.zones.filter(function(e) {
      return e.key === sensor['zoneId'];
    });

    const filterZone = filterZoneList[0];
    if (filterZone && filterZone.hasOwnProperty('name')) {
      filterZone['total'] += 1 ;
      if (sensor['availability'] === 'off') {
        filterZone['offTotal'] += 1;
      }
      filterZone.sensors.push(sensor);
    }
  }

  setMainHeight(count: number = 0) {
    if (count > 50) {
      console.log('Timeout!');
    } else if (!this.zoneTopBarScreen) {
      count ++;
      setTimeout(() => this.setMainHeight(count), 50);
    } else {
      this.nMAHeight = this.customerMAScreen.nativeElement.offsetHeight - this.zoneTopBarScreen.nativeElement.offsetHeight;
      this.bIsMap = true;
    }
  }

  getTabEven(event: any) {
    let strMainUrl = '';

    if (!this.customerId) {
      strMainUrl = '/zone';
    } else {
      strMainUrl = `/${this.customerId}/zone`;
    }

    if (event === 1) {
      if (this.strZoneKey && this.strSensorKey) { // selected specific sensor
        this._router.navigate([strMainUrl], { queryParams: {
          type: 'list',
          zoneId: this.strZoneKey,
          sensorId: this.strSensorKey
        } });
      } else if (this.strZoneKey) { // selected specific zone
        this._router.navigate([strMainUrl], { queryParams: {
          type: 'list',
          zoneId: this.strZoneKey
        } });
      } else {
        this._router.navigate([strMainUrl], { queryParams: {
          type: 'list'
        } });
      }
    } else {
      if (this.strZoneKey && this.strSensorKey) { // selected specific sensor
        this._router.navigate([strMainUrl], { queryParams: {
          zoneId: this.strZoneKey,
          sensorId: this.strSensorKey
        } });
      } else if (this.strZoneKey) { // selected specific zone
        this._router.navigate([strMainUrl], { queryParams: {
          zoneId: this.strZoneKey
        } });
      } else {
        this._router.navigate([strMainUrl]);
      }
    }
  }

  getSensorEvent(event: any) {
    this.focusCoordinate = event;
  }

  loadPage(event: any) {
    if (event) {
      this._router.navigate(['/zone'], { queryParams: {type: 'list', zoneId: event} });
    } else {
      this._router.navigate(['/zone'], { queryParams: {type: 'list'} });
    }
  }
}
