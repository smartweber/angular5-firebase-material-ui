import { Component,
  OnInit,
  OnChanges,
  Input,
  ViewContainerRef
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  MatDialog
  } from '@angular/material';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';
import { NotificationService } from '../../services/notification.service';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../components/spinner/spinner.service';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnChanges {
  @Input() windowH: number;
  @Input() customers: any[];
  @Input() zones: any[];
  @Input() strCustomerKey: string;
  @Input() strZoneKey: string;
  @Input() strSensorKey: string;

  selectedCustomId: number;
  selectedZoneId: number;
  selectedSensorId: number;

  bIsLoading: boolean;
  bIsSelectedCustomer: boolean;
  bIsSelectedZone: boolean;
  bIsSelectedSensor: boolean;

  bIsClearCustomer: boolean;
  bIsClearZone: boolean;
  bIsClearSensor: boolean;
  bIsEditable: boolean;

  selectedCustom: Object;
  selectedZone: Object;
  selectedSensor: Object;
  sensors: any[];
  focusZones: any[];
  isSensorStatus: boolean[];

  constructor(
    private _httpService: HttpService,
    private _viewContainerRef: ViewContainerRef,
    private _nofication: NotificationService,
    private _spinner: SpinnerService,
    private _router: Router,
    public dialog: MatDialog,
    private _authService: AuthService
  ) {
    this.bIsLoading = true;
    this.bIsSelectedCustomer = false;
    this.bIsSelectedZone = false;
    this.bIsSelectedSensor = false;
    this.bIsClearCustomer = false;
    this.bIsClearZone = false;
    this.bIsClearSensor = false;
    this.bIsEditable = false;
    this.selectedCustomId = -1;
  }

  ngOnInit() {
    this.checkUserRole();
  }

  checkUserRole() {
    if (this._authService.userData['action']['role'] === global_variables['userRoles'][0]) { // admin case
      this.bIsEditable = true;
    } else {
      this.bIsEditable = false;
    }
  }

  ngOnChanges() {
    if (this.selectedCustomId > -1) {
      const that = this;
      // get all own zones of the customer selected
      this.focusZones = this.zones.filter(function(e) {
        return e.customerId === that.selectedCustom['key'];
      });
    }

    this.preLoad(this.strCustomerKey, this.strZoneKey, this.strSensorKey);
  }

  // preload the page with customer and zone key if existed
  preLoad(
    customerKey: string = null,
    zoneKey: string = null,
    sensorKey: string = null
  ) {
    const customerIndex =  this.getIndexFromArray('customer', customerKey);
    if (customerIndex > -1) {
      this.gotoCustomer(customerIndex);
      const zoneIndex =  this.getIndexFromArray('zone', zoneKey);
      if (zoneIndex > -1) {
        this.gotoZone(zoneIndex);
        const sensorIndex = this.getIndexFromArray('sensor', sensorKey);
        if (sensorIndex > -1) {
          this.gotoSensor(sensorIndex);
        }
      }
    }
  }

  getIndexFromArray(type: string, key: string) {
    if (!key) {
      return -1;
    }

    let arr: any[];
    const that = this;
    switch (type) {
      case 'customer':
        arr = that.customers;
        break;

      case 'zone':
        arr = that.focusZones;
        break;

      case 'sensor':
        arr = that.sensors;
        break;
    }

    for (let i = 0; i < arr.length; i++) {
      if (arr[i]['key'] === key) {
        return i;
      }
    }

    return -1;
  }

  clearZone() {
    // clear zone
    this.selectedZoneId = -1;
    this.selectedZone = {};
    this.bIsSelectedCustomer = false;
    this.bIsSelectedZone = false;
    this.bIsSelectedSensor = false;
    this.bIsClearCustomer = false;
  }

  selectCustomer(index: number) {
    this._router.navigate(['/customer'], { queryParams: {type: 'list', customerId: this.customers[index]['key']} });
  }

  gotoCustomer(index: number) {
    this.clearZone();
    this.bIsClearCustomer = true;

    this.selectedCustomId = index;
    this.selectedCustom = this.customers[this.selectedCustomId];

    const that = this;
    // get all own zones
    this.focusZones = this.zones.filter(function(e) {
      return e.customerId === that.selectedCustom['key'];
    });
    this.bIsSelectedCustomer = true;
  }

  clearSensor() {
    // clear sensor
    this.selectedSensorId = -1;
    this.selectedSensor = {};
    this.bIsSelectedZone = false;
    this.bIsSelectedSensor = false;
    this.bIsClearZone = false;
  }

  selectZone(index: number) {
    this._router.navigate(['/customer'], { queryParams: {type: 'list',
      customerId: this.selectedCustom['key'],
      zoneId: this.focusZones[index]['key']
    } });
  }

  gotoZone(index: number) {
    this.clearSensor();
    this.bIsClearZone = true;

    this.selectedZoneId = index;
    this.selectedZone = this.focusZones[index];
    this.sensors = (this.selectedZone as any).sensors;
    this.bIsSelectedZone = true;
  }

  selectSensor(index: number) {
    this._router.navigate(['/customer'], { queryParams: {type: 'list',
      customerId: this.selectedCustom['key'],
      zoneId: this.selectedZone['key'],
      sensorId: this.sensors[index]['key']
    } });
  }

  gotoSensor(index: number) {
    this.selectedSensorId = index;
    this.selectedSensor = this.sensors[this.selectedSensorId];
    this.bIsSelectedSensor = true;
  }

  deleteSensorDependencies(strSensorKey: string) {
    return Promise.all([
      this._httpService.deleteAsObject(`${environment['APIS']['SENSORDEVICES']}/${strSensorKey}`)
        .then(
          res  => { // delete sensor device data
            console.log('Successfully delete the sensor device data: ' + `${environment['APIS']['SENSORDEVICES']}/${strSensorKey}`);
          },
          error =>  {
            console.error(error);
          }),
      this._httpService.deleteAsObject(`${environment['APIS']['SENSORCONFIGS']}/${strSensorKey}`)
        .then(
          res  => { // delete sensor config data
            console.log('Successfully delete the sensor config data: ' + `${environment['APIS']['SENSORCONFIGS']}/${strSensorKey}`);
          },
          error =>  {
            console.error(error);
          }),
      this._httpService.deleteAsObject(`${environment['APIS']['ANAYLYTICALDATA']}/${strSensorKey}`)
        .then(
          res  => { // delete analytical data
            console.log('Successfully delete the sensor analytical data: ' + `${environment['APIS']['ANAYLYTICALDATA']}/${strSensorKey}`);
          },
          error =>  {
            console.error(error);
          }),
      this._httpService.deleteAsObject(`${environment['APIS']['PROCESSEDDATA']}/${strSensorKey}`)
        .then(
          res  => { // delete processed data
            console.log('Successfully delete the sensor processed data: ' + `${environment['APIS']['PROCESSEDDATA']}/${strSensorKey}`);
          },
          error =>  {
            console.error(error);
          }),
      this._httpService.deleteAsObject(`${environment['APIS']['RAWDATA']}/${strSensorKey}`)
        .then(
          res  => { // delete sensor raw data
            console.log('Successfully delete the sensor raw data: ' + `${environment['APIS']['RAWDATA']}/${strSensorKey}`);
          },
          error =>  {
            console.error(error);
          })
    ]);
  }

  deleteAction(type: string, key: string) {
    let arrPromises = [];
    switch (type) {
      case 'customer':
        arrPromises = [
          this._httpService.deleteAsObject(`${environment['APIS']['CUSTOMERS']}/${key}`)
            .then(
              res  => {
                console.log('Delete the customer successfully: ', `${environment['APIS']['CUSTOMERS']}/${key}`);
              },
              error =>  {
                console.error(error);
              })
        ];
        break;

      case 'zone':
        arrPromises = [
          this._httpService.deleteAsObject(`${environment['APIS']['ZONES']}/${key}`)
            .then(
              res  => {
                console.log('Delete the zone successfully: ', `${environment['APIS']['ZONES']}/${key}`);
              },
              error =>  {
                console.error(error);
              })
        ];
        break;

      case 'sensor':
        arrPromises = [
          this.deleteSensorDependencies(key),
          this._httpService.deleteAsObject(`${environment['APIS']['SENSORS']}/${key}`)
            .then(
              res  => {
                console.log('Delete the zone successfully: ', `${environment['APIS']['ZONES']}/${key}`);
              },
              error =>  {
                console.error(error);
              })
        ];
        break;
    }

    return Promise.all(arrPromises);
  }

  deleteCustomer(key: string) {
    const config = {
      disableClose: true,
      data: {
        title: 'Delete',
        description: 'Are you sure to delete this customer? Its zones and sensors will be removed.'
      }
    };
    const dialogRef = this.dialog.open(ConfirmModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._spinner.start();
        const arrPromises = [];
        arrPromises.push(
          this._httpService.deleteAsObject(`${environment['APIS']['CUSTOMERPORTALS']}/${key}`)
            .then(
              res  => {
                console.log('Delete the customer data successfully.');
              },
              error =>  {
                console.error(error);
              })
        );
        arrPromises.push(this.deleteAction('customer', key));

        for (let i = 0; i < this.focusZones.length; i++) {
          const zone = this.focusZones[i];
          arrPromises.push(this.deleteAction('zone', zone['key']));

          for (let j = 0; j < zone['sensors'].length; j++) {
            const sensor = zone['sensors'][j];
            arrPromises.push(this.deleteAction('sensor', sensor['key']));
          }
        }

        Promise.all(arrPromises).then(() => {
          this._spinner.stop();
          this._nofication.createNotification('success', 'Delete', 'The customer deletion is successful.');
        },
        error =>  {
          console.error(error);
          this._spinner.stop();
        });

        this.clearZone();
      }
    });
  }

  deleteZone(key: string) {
    const config = {
      disableClose: true,
      data: {
        title: 'Delete',
        description: 'Are you sure to delete this zone? Its sensors will be removed.'
      }
    };
    const dialogRef = this.dialog.open(ConfirmModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._spinner.start();
        const arrPromises = [];
        arrPromises.push(this.deleteAction('zone', key));

        for (let i = 0; i < this.selectedZone ['sensors'].length; i++) {
          const sensor = this.selectedZone['sensors'][i];
          arrPromises.push(this.deleteAction('sensor', sensor['key']));
        }

        Promise.all(arrPromises).then(() => {
          this._spinner.stop();
          this._nofication.createNotification('success', 'Delete', 'Delete the zone successfully.');
        },
        error =>  {
          console.error(error);
          this._spinner.stop();
        });
        this.clearSensor();
      }
    });
  }

  deleteSensor(strSensorKey: string) {
    const config = {
      disableClose: true,
      data: {
        title: 'Delete',
        description: 'Are you sure to delete this sensor?'
      }
    };
    const dialogRef = this.dialog.open(ConfirmModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._spinner.start();
        this.bIsSelectedSensor = false;
        this.deleteAction('sensor', strSensorKey).then(() => {
          this._spinner.stop();
          this._nofication.createNotification('success', 'Confirm', 'Deleting a sensor is successful.');
        });
      }
    });
  }

  createCustomer() {
    this._router.navigate(['create/newCustomer']);
  }

  createZone() {
    const customerId = this.selectedCustom['key'];
    this._router.navigate(['create/newZone'], {queryParams: {create: 'customer', customerId: customerId}});
  }

  createSensor() {
    const customerId = this.selectedCustom['key'];
    const zoneId = this.selectedZone['key'];
    this._router.navigate(['create/newSensor'], {queryParams: {create: 'customer', customerId: customerId, zoneId: zoneId}});
  }

}
