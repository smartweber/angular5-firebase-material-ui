import { Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewContainerRef
} from '@angular/core';
import {
  MatDialog
} from '@angular/material';
import {
  Router
} from '@angular/router';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss']
})
export class ZoneListComponent implements OnInit, OnChanges {
  @Input() zones: Object[];
  @Input() strZoneKey: string;
  @Input() strSensorKey: string;
  @Input() customerId: string;
  @Output() loadPage = new EventEmitter();

  selectedCustomId: number;
  selectedZoneId: number;
  selectedSensorId: number;

  bIsSelectedZone: boolean;
  bIsSelectedSensor: boolean;
  bIsClearZone: boolean;
  bIsZoneEditatble: boolean;

  selectedZone: Object;
  selectedSensor: Object;
  sensors: Object[];

  constructor(
    private _httpService: HttpService,
    private _dataService: DataService,
    private _nofication: NotificationService,
    private _viewContainerRef: ViewContainerRef,
    private _router: Router,
    public dialog: MatDialog,
    private _authService: AuthService
  ) {
    this.bIsSelectedZone = false;
    this.bIsSelectedSensor = false;
    this.bIsClearZone = false;
    this.bIsZoneEditatble = false;
    this.selectedCustomId = -1;
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.preload(this.strZoneKey, this.strSensorKey);
  }

  checkUserRole() {
    const userRole = this._authService.userData['action']['role'];

    if (this.customerId) { // customer case
      if (userRole === global_variables['userRoles'][0] || userRole === global_variables['userRoles'][2]) {
        this.bIsZoneEditatble = true;
      } else {
        this.bIsZoneEditatble = false;
      }
    } else { // staff case
      const roles = [global_variables['userRoles'][0], global_variables['userRoles'][2], global_variables['userRoles'][4]];

      if (roles.indexOf(userRole) > -1) {
        this.bIsZoneEditatble = true;
      } else {
        this.bIsZoneEditatble = false;
      }
    }
  }

  // preload with the zone key
  preload(zoneKey: string = null, sensorKey: string = null) {
    this.checkUserRole();

    const zoneIndex =  this.getIndexFromArray('zone', zoneKey);
    if (zoneIndex > -1) {
      this.gotoZone(zoneIndex);
      const sensorIndex = this.getIndexFromArray('sensor', sensorKey);
      if (sensorIndex > -1) {
        this.gotoSensor(sensorIndex);
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
      case 'zone':
        arr = that.zones;
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

  clearSensor() {
    // clear sensor
    this.selectedSensorId = -1;
    this.selectedSensor = {};
    this.bIsSelectedZone = false;
    this.bIsSelectedSensor = false;
    this.bIsClearZone = false;
  }

  selectZone(index: number) {
    if (!this.customerId) {
      this._router.navigate(['/zone'], { queryParams: {type: 'list',
        zoneId: this.zones[index]['key']
      } });
    } else {
      this._router.navigate([`/${this.customerId}/zone`], { queryParams: {type: 'list',
        zoneId: this.zones[index]['key']
      } });
    }
  }

  gotoZone(index: number) {
    this.clearSensor();
    this.bIsClearZone = true;

    this.selectedZoneId = index;
    this.selectedZone = this.zones[index];
    this.sensors = this.selectedZone['sensors'];
    this.bIsSelectedZone = true;
  }

  selectSensor(index: number) {
    if (!this.customerId) {
      this._router.navigate(['/zone'], { queryParams: {type: 'list',
        zoneId: this.selectedZone['key'],
        sensorId: this.sensors[index]['key']
      } });
    } else {
      this._router.navigate([`/${this.customerId}/zone`], { queryParams: {type: 'list',
        zoneId: this.selectedZone['key'],
        sensorId: this.sensors[index]['key']
      } });
    }
  }

  gotoSensor(index: number) {
    this.selectedSensorId = index;
    this.selectedSensor = this.sensors[this.selectedSensorId];
    this.bIsSelectedSensor = true;
  }

  deleteAction(type: string, key: string) {
    let url = null;
    let customerKey, zoneKey;
    switch (type) {
      case 'zone':
        url = environment.APIS.ZONES + '/';
        customerKey = this.selectedZone['customerId'];
        break;

      case 'sensor':
        url = environment.APIS.SENSORS + '/';
        customerKey = this.selectedZone['customerId'];
        zoneKey = this.selectedZone['key'];
        break;
    }

    if (url) {
      url += key;
    }
    console.log(url);
    this._httpService.deleteAsObject(url)
      .then(()  => {
      console.log('Delete successfully: ' + url);
      switch (type) {
        case 'zone':
          this.loadPage.emit(null);
          break;

        case 'sensor':
          this.preload(this.selectedZone['key']);
          break;
      }
    }, error =>  {
      console.error(error);
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
        this.deleteAction('zone', key);

        for (let i = 0; i < this.selectedZone['sensors'].length; i++) {
          const sensor = this.selectedZone['sensors'][i];
          this.deleteAction('sensor', sensor['key']);
        }

        this.clearSensor();
      }
    });
  }

  deleteSensor(key: string) {
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
        this.deleteAction('sensor', key);
        this.bIsSelectedSensor = false;
      }
    });
  }

  createZone() {
    if (this.customerId) {
      this._router.navigate(['create/newZone'], {queryParams: {customerId: this.customerId}});
    } else {
      this._nofication.createNotification(
        'alert',
        'Alert',
        'Customers can create their zone here. If you want, please go to customer page to create.'
      );
    }
  }

  createSensor() {
    const customerId = this.selectedZone['customerId'];
    const zoneId = this.selectedZone['key'];
    this._router.navigate(['create/newSensor'], {queryParams: {customerId: customerId, zoneId: zoneId}});
  }
}
