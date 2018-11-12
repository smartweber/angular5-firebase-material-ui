import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Location } from '@angular/common';
import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {
  MatSnackBar,
  MatDialog
} from '@angular/material';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';
import { HttpService } from '../../services/http.service';
import { SpinnerService } from '../../components/spinner/spinner.service';
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import { AlertModalComponent } from '../../modals/alert-modal/alert-modal.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { database } from 'firebase/app';
declare var google: any;

@Component({
  selector: 'app-create-sensor',
  templateUrl: './create-sensor.component.html',
  styleUrls: ['./create-sensor.component.scss']
})
export class CreateSensorComponent implements OnInit, OnDestroy {
  @Input() createName: string;
  @Input() customerId: string;
  @Input() zoneId: string;
  model: Object;

  customerTotal: number;
  customerOffCount: number;
  zoneTotal: number;
  zoneOffCount: number;
  customerName: string;
  zoneName: string;
  geocoder: any;
  sensorTypeSub: any;

  isCreateSensor: boolean;
  isGettingData: boolean;

  CREATENAMES: string[];
  sensorTypes: Object[];

  sensorForm: FormGroup;

  formErrors: Object;

  validationMessages = {
    'name': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name can not be more that 24 characters long.'
    },
    'type': {
      'required': 'Sensor type is required.'
    }
  };

  constructor(
    private _httpService: HttpService,
    private _mapApiLoader: MapsAPILoader,
    private _spinner: SpinnerService,
    private _router: Router,
    public _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _location: Location,
    private _db: AngularFirestore
  ) {
    this.customerTotal = -1;
    this.customerOffCount = -1;
    this.zoneTotal = -1;
    this.zoneOffCount = -1;
    this.CREATENAMES = ['customer', 'zone'];
    this.isGettingData = false;
    this.customerName = '';
    this.zoneName = '';
  }

  ngOnInit() {
    this.getCustomerAndZoneName();
    this.initForm();
    this.initData();
  }

  ngOnDestroy() {
    if (this.sensorTypeSub) {
      this.sensorTypeSub.unsubscribe();
    }
  }

  getCustomerName(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._httpService.getAsObject(
        `${environment['APIS']['CUSTOMERS']}/${this.customerId}`
      ).subscribe((customer) => {
        if (customer) {
          this.customerName = customer['name'];
          resolve(true);
        } else {
          resolve(false);
        }
      }, reject);
    });
  }

  getZoneName(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._httpService.getAsObject(
        `${environment['APIS']['ZONES']}/${this.zoneId}`
      ).subscribe((zone) => {
        if (zone) {
          this.zoneName = zone['name'];
          resolve(true);
        } else {
          resolve(false);
        }
      }, reject);
    });
  }

  getCustomerAndZoneName() {
    this._spinner.start();

    Promise.all([
      this.getCustomerName(),
      this.getZoneName()
    ]).then((values) => {
      this._spinner.stop();

      if (!values[0] || !values[1]) {
        this._snackBar.open('Either customer or zone don\'t have enough data', 'Alert', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this._router.navigate(['/dashboard']);
      }
    },
    error =>  {
      this._spinner.stop();
      this._snackBar.open('Network error', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      this._router.navigate(['/dashboard']);
    });
  }

  initForm() {
    this.formErrors = {
      name: '',
      type: '',
      serialNumber: ''
    };

    this.model = {
      address: '',
      name: '',
      description: '',
      customerId: '',
      zoneId: '',
      availability: global_variables.deviceStatus[1],
      lat: '',
      lng: '',
      type: '',
      serialNumber: ''
    };

    this.sensorForm = new FormGroup({
      name: new FormControl(this.model['name'], [
        <any>Validators.required,
        <any>Validators.minLength(2),
        <any>Validators.maxLength(25)
      ]),
      type: new FormControl(this.model['type'], <any>Validators.required),
      description: new FormControl(),
      situation: new FormControl(1),
      address: new FormControl(),
      lat: new FormControl(),
      lng: new FormControl(),
      serialNumber: new FormControl(this.model['serialNumber'], <any>Validators.required)
    });

    this.sensorForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  // get data from back end
  initData() {
    this.sensorTypeSub = this._httpService.getAsList(environment['APIS']['SENSORTYPES']).subscribe(sensorTypes => {
      this.sensorTypes = sensorTypes.map(item => {
        return {
          name: item['typeName'],
          key: item['key']
        };
      });

      if (this.sensorTypes.length > 0) {
        this.model['type'] = this.sensorTypes[0]['key'];
        this.isGettingData = true;
      } else {
        console.log('You need to create sensor type');
      }
    },
    error => {
      console.log(error);
    });

    this._mapApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  // check the validation
  onValueChanged(data?: any) {
    if (!this.sensorForm) { return; }

    const form = this.sensorForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSave() {
    if (this.sensorForm.valid) {
      this.model = {
        address: this.sensorForm.value.address,
        name: this.sensorForm.value.name,
        description: this.sensorForm.value.description,
        customerId: this.customerId,
        customerName: this.customerName,
        zoneId: this.zoneId,
        zoneName: this.zoneName,
        availability: global_variables.deviceStatus[1],
        lat: this.sensorForm.value.lat,
        lng: this.sensorForm.value.lng,
        sensorTypeId: this.sensorForm.value.type,
        serialNumber: this.sensorForm.value.serialNumber,
        timestamp: database.ServerValue.TIMESTAMP
      };

      this.isCreateSensor = true;

      if (this.sensorForm.value.situation === 1) {
        this.getLatitudeLongitude(this.showResult, this);
      } else {
        this.createNewSensor();
      }
    } else {
      console.log('Your form is invalid.');
    }
  }

  showResult(result: any, that: any) {
    that.model['lat'] = result.geometry.location.lat();
    that.model['lng'] = result.geometry.location.lng();
    that.createNewSensor();
  }

  getLatitudeLongitude(callback, that) {
    const address = that.model['address'];
    if (address) {
      // Initialize the Geocoder
      if (that.geocoder) {
        that.geocoder.geocode({
          'address': address
        }, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            callback(results[0], that);
          }
        });
      }
    } else {
      const config = {
        width: '400px',
        disableClose: true,
        data: {
          title: 'Alert',
          description: 'Please input sensor location.'
        }
      };
      this.dialog.open(AlertModalComponent, config);
      this.isCreateSensor = false;
    }
  }

  createNewSensor() {
    this._httpService.getListByOrder(
      environment.APIS.SENSORS,
      'serialNumber',
      this.model['serialNumber'],
      1
    ).subscribe((sensors) => {
      if (sensors && sensors.length > 0) {
        const config = {
          width: '400px',
          disableClose: true,
          data: {
            title: 'Alert',
            description: 'The serial number is already existed.'
          }
        };
        this.dialog.open(AlertModalComponent, config);
        this.isCreateSensor = false;
      } else {
        // create new sensor
        this._httpService.createAsList(environment.APIS.SENSORS, this.model)
          .then(
            res  => {
              this._httpService.updateAsObject(`${environment['APIS']['SENSORDEVICES']}/${res}`, { isInRealTime: true })
              .then(()  => {
                this.initForm();
                this._snackBar.open('New Sensor creation is successful!', 'Success', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
                if (this.createName === this.CREATENAMES[0]) {
                  this._router.navigate(['/customer'], { queryParams: {type: 'list', customerId: this.customerId, zoneId: this.zoneId} });
                } else {
                  this._router.navigate(['/zone'], { queryParams: {type: 'list', zoneId: this.zoneId} });
                }

                this.isCreateSensor = false;
              },
              error => {
                this.isCreateSensor = false;
                console.log(error);
              });
            },
            error => {
              this.isCreateSensor = false;
              console.log(error);
            });
      }
    });
  }

  onBack() {
    this._location.back();
  }
}
