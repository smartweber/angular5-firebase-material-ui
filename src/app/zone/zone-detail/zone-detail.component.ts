import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import { environment } from '../../../environments/environment.dev';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs/Subscription';
import { Location } from '@angular/common';

const VALUE_KEYS = ['name', 'description', 'color', 'criticality'];

@Component({
  selector: 'app-zone-detail',
  templateUrl: './zone-detail.component.html',
  styleUrls: ['./zone-detail.component.scss']
})
export class ZoneDetailComponent implements OnInit, OnDestroy {
  bIsPageLoading: boolean;
  bIsEditable: boolean;
  bIsTypeLoading: boolean;

  status: number;
  sensorCounter: number;

  error: string;
  userRole: string;
  paramValue: string;

  currentZone: Object;

  activeRouteSub: Subscription;
  zoneDataSub: Subscription;
  sensorsDataSub: Subscription;

  sensorTypes: string[];

  CRITICALITIES = ['high', 'medium', 'low'];

  constructor(
    private _httpService: HttpService,
    private _authService: AuthService,
    private _activeRoute: ActivatedRoute,
    private _nofication: NotificationService,
    private _router: Router,
    private cdRef: ChangeDetectorRef,
    private _location: Location
  ) {
    this.status = 0; // 0: none, > 1: edit
    this.error = '';
    this.paramValue = '';
    this.bIsTypeLoading = false;
  }

  ngOnInit() {

    this.activeRouteSub = this._activeRoute.params.subscribe(params => {
      const zoneKey = params['id'];
      const zoneUrl = environment.APIS.ZONES ;

      // get the zone
      this.zoneDataSub = this._httpService.getAsObject(`${zoneUrl}/${zoneKey}`).subscribe(zone => {
        if (zone) {
          this.currentZone = zone;
        }

        this.bIsPageLoading = true;
      },
      error => {
        console.log(error);
      });

      // get sensors
      this.sensorsDataSub = this._httpService.getListByOrder(environment.APIS.SENSORS, 'zoneId', zoneKey).subscribe((sensors) => {
        this.sensorCounter = sensors.length;
        let sensorTypes = sensors.map(item => {
          return item.sensorTypeId;
        });

        sensorTypes = sensorTypes.filter((item, index, self) => {
          return self.lastIndexOf(item) === index;
        });

        this.sensorTypes = [];
        let counter = 0;
        const sensortypeUrl = environment.APIS.SENSORTYPES;

        for (let i = 0; i < sensorTypes.length; i++) {
          this._httpService.getAsObject(`${sensortypeUrl}/${sensorTypes[i]}`).subscribe((type) => {
            this.sensorTypes[i] = type.typeName;
            counter ++;

            if (sensorTypes.length <= counter) {
              this.bIsTypeLoading = true;
            }
          }, error => {
            console.log(error);
          });
        }

      }, error => {
        console.log(error);
      });
    });

    if (this._authService.isCheckUser && this._authService.isUserEmailLoggedIn) { // get the user auth status already
      this.checkUserRole();
    }
  }

  ngOnDestroy() {
    if (this.activeRouteSub) {
      this.activeRouteSub.unsubscribe();
    }

    if (this.zoneDataSub) {
      this.zoneDataSub.unsubscribe();
    }

    if (this.sensorsDataSub) {
      this.sensorsDataSub.unsubscribe();
    }
  }

  checkUserRole() {
    this.userRole = this._authService.userData['action'] ? this._authService.userData['action']['role'] : '';

    if (this._authService.isUserStaff) { // staff
      const roles = ['admin', 'debugger', 'operator'];

      if (roles.indexOf(this.userRole) > -1) {
        this.bIsEditable = true;
      } else {
        this.bIsEditable = false;
      }
    } else { // customer
      const roles = ['admin', 'operator'];

      if (roles.indexOf(this.userRole) > -1) {
        this.bIsEditable = true;
      } else {
        this.bIsEditable = false;
      }
    }
  }

  /*
  update the values
  1: name
  2: description
  3: color
  */
  editValue(index: number, value: string) {
    this.status = index;
    this.paramValue = value;
  }

  // update the value
  update() {
    const updateValue = <any>{};
    updateValue[VALUE_KEYS[this.status - 1]] = this.paramValue;

    this._httpService.updateAsObject(`${environment.APIS.ZONES}/${this.currentZone['key']}`, updateValue)
      .then(()  => {
        this.clearEdit();
        this._nofication.createNotification('success', 'Update', 'The zone\'s parameter update is successful!');
        this.cdRef.detectChanges();
      }, error =>  console.error(error));
  }

  // cancel to edit
  cancel() {
    this.clearEdit();
  }

  clearEdit() {
    this.status = 0;
    this.paramValue = '';
    this.error = '';
  }

  onBack() {
    this._location.back();
  }

}
