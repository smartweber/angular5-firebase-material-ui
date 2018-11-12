import { Component,
  OnInit,
  OnChanges,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import { environment } from '../../environments/environment.dev';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';
import { SpinnerService } from '../components/spinner/spinner.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, OnDestroy, OnChanges {
  status: number;

  bIsLoading: boolean;
  bIsGettingCustomers: boolean;
  bIsGettingZones: boolean;
  bIsGettingSensors: boolean;
  bIsMap: boolean;

  nMAHeight: number;
  customers: any;
  zones: any[];
  sensors: any[];

  strCustomerKey: string;
  strZoneKey: string;
  strSensorKey: string;

  activeRouteSub: any;
  customerSub: Subscription;
  zoneSub: Subscription;
  sensorSub: Subscription;

  @ViewChild('customerTopBarScreen') customerTopBarScreen: ElementRef;
  @ViewChild('customerMAScreen') customerMAScreen: ElementRef;
  @ViewChild('customerList') customerList: ElementRef;

  constructor(
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _httpService: HttpService,
    private _spinner: SpinnerService,
    private _authService: AuthService
  ) {
    this.status = 1;
    this.bIsLoading = false;
    this.bIsGettingCustomers = false;
    this.bIsGettingZones = false;
    this.bIsGettingSensors = false;
    this.bIsMap = false;
  }

  ngOnInit() {
    this.activeRouteSub = this._activeRoute.queryParams.subscribe(params => {
      this.getParams(params);
    });

    if (this._authService.isCheckUser && this._authService.isUserEmailLoggedIn) { // user already login
      this.getData();
    }
  }

  ngOnChanges() {
    console.log('----------ngOnChanges');
  }

  ngOnDestroy() {
    if (this.activeRouteSub) {
      this.activeRouteSub.unsubscribe();
    }

    if (this.customerSub) {
      this.customerSub.unsubscribe();
    }

    if (this.zoneSub) {
      this.zoneSub.unsubscribe();
    }

    if (this.sensorSub) {
      this.sensorSub.unsubscribe();
    }
  }

  getParams(params: Object) {
    if (params['type'] === 'list') {
      this.status = 1;
    } else {
      this.status = 0;
    }
    this.strCustomerKey = params['customerId'];
    this.strZoneKey = params['zoneId'];
    this.strSensorKey = params['sensorId'];
  }

  getData() {
    this._spinner.start();

    this.customerSub = this._httpService.getAsList(environment.APIS.CUSTOMERS).subscribe(customers => {
      this.customers = customers;
      this.bIsGettingCustomers = true;
      this.checkLoad();
    },
    error => {
      console.log(error);
    });

    this.zoneSub = this._httpService.getAsList(environment.APIS.ZONES).subscribe(zones => {
      this.zones = zones;
      this.bIsGettingZones = true;
      this.checkLoad();
    },
    error => {
      console.log(error);
    });

    this.sensorSub = this._httpService.getAsList(environment.APIS.SENSORS).subscribe(sensors => {
      this.sensors = sensors;

      this.bIsGettingSensors = true;
      this.checkLoad();
    },
    error => {
      console.log(error);
    });
  }

  checkLoad() {
    let count = 0;
    if (this.bIsGettingCustomers) {
      count ++;
    }

    if (this.bIsGettingZones) {
      count ++;
    }

    if (this.bIsGettingSensors) {
      count ++;
    }

    if (count >= 3) {
      this.customers = this.customers.map(item => {
        item.total = 0;
        item.offTotal = 0;
        return item;
      });

      this.zones = this.zones.map(item => {
        item.sensors = [];
        item.total = 0;
        item.offTotal = 0;
        return item;
      });

      this.initZones();
      this.setMainHeight();
      this._spinner.stop();
      this.bIsLoading = true;
    }
  }

  /*
  - put sensors to their zones
  - init the offTotal and total counter of the zone
  */
  initZones() {
    for (let i = 0; i < this.sensors.length; i++) {
      this.putToZone(this.sensors[i]);
    }
  }

  // push the sensor to their zone
  putToZone(sensor: Object) {
    const filterZoneList = this.zones.filter(function(e) {
      return e.key === sensor['zoneId'];
    });

    const filterZone = filterZoneList[0];
    if (filterZone && filterZone.hasOwnProperty('name')) {
      filterZone['total'] += 1 ;
      if (sensor['availability'] === 'off') {
        filterZone['offTotal'] += 1 ;
      }
      filterZone.sensors.push(sensor);
    }

    const filterCustomerList = this.customers.filter(function(e) {
      return e.key === sensor['customerId'];
    });

    const filterCustomer = filterCustomerList[0];
    if (filterCustomer && filterCustomer.hasOwnProperty('name')) {
      filterCustomer['total'] += 1 ;
      if (sensor['availability'] === 'off') {
        filterCustomer['offTotal'] += 1;
      }
    }
  }

  setMainHeight(count: number = 0) {
    if (count > 100) {
      console.log('Timeout!');
    } else if (!this.customerTopBarScreen) {
      count ++;
      setTimeout(() => this.setMainHeight(count), 50);
    } else {
      this.nMAHeight = this.customerMAScreen.nativeElement.offsetHeight - this.customerTopBarScreen.nativeElement.offsetHeight;
      this.bIsMap = true;
    }
  }

  getTabEven(event: number) {
    if (event === 1) {
      if (this.strCustomerKey && this.strZoneKey && this.strSensorKey) { // selected specific sensor
        this._router.navigate(['/customer'], { queryParams: {
          type: 'list',
          customerId: this.strCustomerKey,
          zoneId: this.strZoneKey,
          sensorId: this.strSensorKey
        } });
      } else if (this.strCustomerKey && this.strZoneKey) { // selected specific zone
        this._router.navigate(['/customer'], { queryParams: {
          type: 'list',
          customerId: this.strCustomerKey,
          zoneId: this.strZoneKey
        } });
      } else if (this.strCustomerKey) { // selected specific customer
        this._router.navigate(['/customer'], { queryParams: {
          type: 'list',
          customerId: this.strCustomerKey
        } });
      } else {
        this._router.navigate(['/customer'], { queryParams: {
          type: 'list'
        } });
      }
    } else {
      if (this.strCustomerKey && this.strZoneKey && this.strSensorKey) { // selected specific sensor
        this._router.navigate(['/customer'], { queryParams: {
          customerId: this.strCustomerKey,
          zoneId: this.strZoneKey,
          sensorId: this.strSensorKey
        } });
      } else if (this.strCustomerKey && this.strZoneKey) { // selected specific zone
        this._router.navigate(['/customer'], { queryParams: {
          customerId: this.strCustomerKey,
          zoneId: this.strZoneKey
        } });
      } else if (this.strCustomerKey) { // selected specific customer
        this._router.navigate(['/customer'], { queryParams: {
          customerId: this.strCustomerKey
        } });
      } else {
        this._router.navigate(['/customer']);
      }
    }
  }
}
