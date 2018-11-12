import { Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import {
  Router
} from '@angular/router';
import { FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import {
  MatDialog,
  MatSnackBar
} from '@angular/material';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { NotificationService } from '../../services/notification.service';
import { SpinnerService } from '../../components/spinner/spinner.service';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

const SENSOR_TYPES = ['header_row_type', 'header_type'];

@Component({
  selector: 'app-sensor-type-detail',
  templateUrl: './sensor-type-detail.component.html',
  styleUrls: ['./sensor-type-detail.component.scss']
})

export class SensorTypeDetailComponent implements OnInit, OnDestroy {
  type: number;
  status: number;
  selectedSensorTypeId: number;
  deletedCounter: number;
  totalCounter: number;
  nMAHeight: number;

  strUserRole: string;
  strUserType: string;
  sensorTypeName: string;
  sensorTypeLinkName: string;
  selectedSensorTypeKey: string;

  isCreateSensorType: boolean;
  isEditSensorType: boolean;
  isPageLoading: boolean;
  isUpdateToggle: boolean;

  arrSensorTypes: any[]; // sensor types
  arrStrUserRoles: string[];
  arrStrUserTypes: string[];
  arrStrCategories: string[];

  focusCategory: Object;

  stForm: FormGroup;

  sensorTypeSub: Subscription;

  constructor(
    private _httpService: HttpService,
    private _authService: AuthService,
    private _spinner: SpinnerService,
    private _nofication: NotificationService,
    private _router: Router,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar
  ) {
    this.type = -1; // 0: status, 1: voc analytics, 2: voc raw, 3: processed data, 4: debug
    this.status = 0; // 0: none, 1: edit, 2: create

    this.selectedSensorTypeId = -1;
    this.isPageLoading = false;
    this.isCreateSensorType = false;
    this.isEditSensorType = false;
    this.isUpdateToggle = false;

    this.strUserType = '';
        this.strUserRole = '';

    this.arrStrUserRoles = global_variables['userRoles'];
    this.arrStrUserTypes = global_variables['userTypes'];
    this.arrStrCategories = global_variables['Categories'];

    this.loadData();
  }

  ngOnInit() {
    this.initTypeForm('');
    if (this._authService.isCheckUser) { // get the user auth status already

      this.getUserData();

    }
  }

  initTypeForm(name: string) {
    this.stForm = new FormGroup({
          name: new FormControl(name, [
              <any>Validators.required
            ])
      });
  }

  ngOnDestroy() {
    if (this.sensorTypeSub) {
      this.sensorTypeSub.unsubscribe();
    }
  }

  getUserData() {
    if (this._authService.isUserEmailLoggedIn) { // user already logined
      const userData = this._authService.userData;
      this.strUserRole = userData['action']['role'];

      if (this._authService.isUserStaff) { // staff case
        this.strUserType = this.arrStrUserTypes[0];
      } else { // customer case
        this.strUserType = this.arrStrUserTypes[1];
      }

    }
  }

  loadData() {
    this._spinner.start();
    this.sensorTypeSub = this._httpService.getAsList(environment['APIS']['SENSORTYPES']).subscribe(programs => {
        this.arrSensorTypes = programs;
        this.arrSensorTypes = _.uniqBy(this.arrSensorTypes, 'key');

        if (this.selectedSensorTypeId === -1) {
        this.selectedSensorTypeId = 0;
        if (this.arrSensorTypes && this.arrSensorTypes.length > 0) {
          this.selectedSensorTypeKey = this.arrSensorTypes[0]['key'];
        }
        }

        if (!this.isPageLoading) {
          this.goTargetNavigation(0);
        } else {
          this.goTargetNavigation(this.type);
        }

        this._spinner.stop();
        this.isPageLoading = true;
        this.isUpdateToggle = this.isUpdateToggle ? false : true;
      },
      error => {
        console.log(error);
      });
  }

  /*
  *** sensor type start ***
  */
  // select the sensor type
  selectSensorType(sensorTypeIndex: number) {
    this.selectedSensorTypeId = sensorTypeIndex;
    this.goTargetNavigation(0);
    if (this.arrSensorTypes && this.arrSensorTypes.length > 0) {
      this.selectedSensorTypeKey = this.arrSensorTypes[sensorTypeIndex]['key'];
    }
  }

  // edit the sensor title
  editSensorType(sensorType: Object) {
    this.isEditSensorType = true;
    this.sensorTypeName = (sensorType as any).typeName;
    this.selectedSensorTypeKey = sensorType['key'];
    this.initTypeForm(this.sensorTypeName);
  }

  // delete the sensor type
  onDeleteSensorType(typeKey: string) {
    this._spinner.start();
      this._httpService.getListByOrder(environment.APIS.SENSORS, 'sensorTypeId', typeKey, 1).subscribe((sensors) => {
      this._spinner.stop();

      if (sensors && sensors.length > 0) {
        let alert = '<div class="description">You should delete all the sensors.</div>';
        alert += '<table class="table table-bordered"><thead><tr><th>Customer</th><th>Zone</th><th>Sensor</th></tr></thead><tbody>';
        for (let i = 0; i < sensors.length; i++) {
          const item = `<tr><td>${sensors[i].customerId}</td><td>${sensors[i].zoneId}</td><td>${sensors[i].key}</td></tr>`;
          alert += item;
        }
        alert += '</tbody></table>';

        const config = {
          disableClose: true,
          data: {
            title: 'Delete',
            description: alert
          }
        };
        const dialogRef = this.dialog.open(ConfirmModalComponent, config);

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // start to delete the sensors related to the sensor type
            this._spinner.start();
            const arrPromises = [];

            for (let i = 0; i < sensors.length; i++) {
              if (sensors[i].hasOwnProperty('key')) {
                arrPromises.push(this.deleteSensor(sensors[i]['key']));
              }
            }

            Promise.all(arrPromises).then(() => {
              this.deleteSensorType(typeKey);
            },
            error =>  {
              console.error(error);
              this._spinner.stop();
            });
          }
        });
      } else {
        const alert = 'Are you sure to delete the sensor type?';
        const config = {
          disableClose: true,
          data: {
            title: 'Delete',
            description: alert
          }
        };
        const dialogRef = this.dialog.open(ConfirmModalComponent, config);

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this._spinner.start();
            this.deleteSensorType(typeKey);
          }
        });
      }
    }, error => {
      console.log(error);
      console.log('You do not have the permission for the sensor table.');
      this._router.navigate(['/dashboard']);
    });
  }

  /*
  delete sensor dependencies
  */
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
          }),
      this._httpService.deleteAsObject(`${environment['APIS']['SENSORCONFIGS']}/${strSensorKey}`)
        .then(
          res  => { // delete sensor config data
            console.log('Successfully delete the sensor raw data: ' + `${environment['APIS']['SENSORCONFIGS']}/${strSensorKey}`);
          },
          error =>  {
            console.error(error);
          })
    ]);
  }

  /*
  delete sensor with the sensor key
  */
  deleteSensor(strSensorKey: string) {
    return Promise.all([
      this._httpService.deleteAsObject(`${environment['APIS']['SENSORS']}/${strSensorKey}`)
        .then(
          () => {
            console.log('Delete the sensor successfully: ', `${environment['APIS']['SENSORS']}/${strSensorKey}`);
          },
          error =>  console.error(error)),
      this.deleteSensorDependencies(strSensorKey)
    ]);
  }

  /*
  delete the specific sensor type with the key
  */
  deleteSensorType(strTypeKey: string) {
    this._httpService.deleteAsObject(`${environment['APIS']['SENSORTYPES']}/${strTypeKey}`)
      .then(() => {
        this._snackBar.open('The sensor type deletion is successful!', 'Success', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.clearSensorTypeForm();
        this._spinner.stop();
      }, error => console.error(error));
  }

  // clear the create sensor type form
  clearSensorTypeForm() {
    this.sensorTypeName = '';
    this.isCreateSensorType = false;
    this.isEditSensorType = false;
    this.selectedSensorTypeId = 0;
    this.selectedSensorTypeKey = null;
    this.selectSensorType(this.selectedSensorTypeId);
  }

  showSensorTypeForm() {
    this.sensorTypeName = '';
    this.isCreateSensorType = true;
    this.initTypeForm('');
  }

  // crete new sensor type
  submitSensorType() {
    if (this.stForm.valid) {
      const url = environment.APIS.SENSORTYPES;

      if (this.isCreateSensorType) {// create type
        const newData = {
          typeName: this.stForm['value']['name'],
          status: {
            tableType: ''
          },
          vocAnalytics: {
            tableType: ''
          },
          vocRaw: {
            tableType: ''
          },
          processedData: {
            tableType: ''
          },
          debug: {
            tableType: ''
          }
        };

        this._httpService.createAsList(url, newData)
          .then(
            res  => {
              this._snackBar.open('New sensor type creation is successful!', 'Success', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center'
              });
              this.clearSensorTypeForm();
            },
            error =>  console.error(error));
      }

      if (this.isEditSensorType) {// edit type
        const value = {typeName: this.stForm['value']['name']};
        this._httpService.updateAsObject(`${url}/${this.selectedSensorTypeKey}`, value)
          .then(
            () => {
              this._snackBar.open('Sensor type update is successful!', 'Success', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center'
              });
              this.clearSensorTypeForm();
            },
            error =>  console.error(error));
      }
    } else {
      this._snackBar.open('Invalid form.', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }
  }

  // cancel to crete new sensor type
  cancelSensorType() {
    this.clearSensorTypeForm();
  }

  /*
  *** sensor type end ***
  */
  goTargetNavigation(navNumber: number) {
    this.type = navNumber;
    if (this.arrSensorTypes[this.selectedSensorTypeId]) {
      this.sensorTypeLinkName = (this.arrSensorTypes[this.selectedSensorTypeId] as any).typeName;

      switch (navNumber) {
        case 0:
          // status
          this.focusCategory = (this.arrSensorTypes[this.selectedSensorTypeId] as any).status;
          break;

        case 1:
          // vocAnalytics
          this.focusCategory = (this.arrSensorTypes[this.selectedSensorTypeId] as any).vocAnalytics;
          break;

        case 2:
          // debug
          this.focusCategory = (this.arrSensorTypes[this.selectedSensorTypeId] as any).debug;
          break;

        default:
          this._nofication.createNotification('error', 'Error', 'Your category is not available.');
          break;
      }
    }
  }

  updateTableTypeEmit(event: any) {
    const selectedSensorType = this.arrSensorTypes[this.selectedSensorTypeId];
    const objUpdateVal = {
      tableType: event
    };

    this._httpService.updateAsObject(
      `${environment.APIS.SENSORTYPES}/${selectedSensorType['key']}/${this.arrStrCategories[this.type]}`,
      objUpdateVal
    ).then(() => {
      this._snackBar.open('Table type update is successful!', 'Success', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }, error => console.error(error));
  }

  checkDeleteStatus(totalCounter: number, currentCounter: number) {
    if (totalCounter <= currentCounter) {
      this._spinner.stop();
      this._snackBar.open('Delete process is successfully done!', 'Success', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }
  }

  // check if name field is already existed
  checkExistedName(newField: Object, arrField: Object[]) {
    if (!newField) {
      console.log('New field is not existed');
      return true;
    }

    if (arrField && arrField.length > 0) {
      for (let i = 0; i < arrField.length; i++) {
        if (newField['name'] && arrField[i]['name']) {
          if (newField['name'] === arrField[i]['name']) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /*
  Row Param action
  */
  // create new row param
  createRowParamEmit(event: any) {
    const selectedSensorType = this.arrSensorTypes[this.selectedSensorTypeId];
    const category = this.arrStrCategories[this.type];
    let values = selectedSensorType[category]['rows'];
    if (!values) {
      values = [];
    }

    values = values.map(item => {
      delete item['detail'];
      return item;
    });

    if (this.checkExistedName(event, values)) {
      this._nofication.createNotification('alert', 'Alert', 'The field name is already existed!');
      return;
    }

    values.push(event);
    const objUpdateVal = {
      rows: values
    };

    this._httpService.updateAsObject(
      `${environment.APIS.SENSORTYPES}/${selectedSensorType['key']}/${this.arrStrCategories[this.type]}`,
      objUpdateVal
    ).then(() => {
      this._snackBar.open('New parameter additon is successful!', 'Success', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }, error =>  console.error(error));
  }

  // update new row param
  updateRowParamEmit(event: any) {
    const selectedSensorType = this.arrSensorTypes[this.selectedSensorTypeId];

    if (event.isDelete) {
      const alert = 'Are you sure to delete this sensor type?';
      const config = {
        disableClose: true,
        data: {
          title: 'Delete',
          description: alert
        }
      };
      const dialogRef = this.dialog.open(ConfirmModalComponent, config);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const values = event.data.map(item => {
            delete item['detail'];
            return item;
          });

          const sensorTypeUrl = environment.APIS.SENSORTYPES;
          const value = {rows: values};
          const deletedDataKey = value.rows[event.deleteId].id;
          value['rows'].splice(event.deleteId, 1);

          // delete the sensor type param in the sensor type table
          this._httpService.updateAsObject(`${sensorTypeUrl}/${selectedSensorType['key']}/${this.arrStrCategories[this.type]}`, value)
            .then(
              ()  => {
                this._snackBar.open('Parameter deletion is successful!', 'Success', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
              }, error => console.error(error));

          // delete the sensor type param in the relevant sensor data table
          if (deletedDataKey) {
            this._spinner.start();
            // initial the counter for checking the delete status
            this.totalCounter = 0;
            this.deletedCounter = 0;

            const strSensorUrl = environment.APIS.SENSORS;
            const sensorDataUrl = environment.APIS.SENSORDATA;

            this._httpService.getListByOrder(strSensorUrl, 'sensorTypeId', selectedSensorType['key'], 1).subscribe((data) => {
              if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                  this._httpService.getAsList(
                    `${sensorDataUrl}/${this.arrStrCategories[this.type]}/${data[i].key}/series`,
                    1
                  ).subscribe((sensorDataSeries) => {
                    this.totalCounter += sensorDataSeries.length;
                    this.totalCounter += 1;

                    // delete the recent data in sensor data
                    this._httpService.deleteAsObject(
                      `${sensorDataUrl}/${this.arrStrCategories[this.type]}/${data[i].key}/recent/value/${deletedDataKey}`
                    ).then(() => {
                        console.log('Delete the recent data key in SensorData table Successfully.');
                        this.deletedCounter ++;
                        this.checkDeleteStatus(this.totalCounter, this.deletedCounter);
                      }, error => console.error(error));

                    if (sensorDataSeries && sensorDataSeries.length > 0) {
                      for (let s = 0; s < sensorDataSeries.length; s++) {
                        this._httpService.deleteAsObject(
                          `${sensorDataUrl}/${this.arrStrCategories[this.type]}/${data[i].key}/series/
													${sensorDataSeries[s].key}/value/${deletedDataKey}`
                        )
                          .then(() => {
                              console.log('Delete the series list keys in SensorData table Successfully!');
                              this.deletedCounter ++;
                              this.checkDeleteStatus(this.totalCounter, this.deletedCounter);
                            },
                            error =>  console.error(error));
                      }
                    }
                  },
                  error => {
                    console.log(error);
                  });
                }
              }
            }, error => {
              console.log(error);
              console.log('You do not have the permission for the sensor data table.');
              this._router.navigate(['/dashboard']);
            });
          } else {
            console.log('The data key is not existed');
            this._spinner.stop();
          }
        }
      });
    } else {
      const values = event.data.map(item => {
        delete item['detail'];
        return item;
      });

      const sensorTypeUrl = environment.APIS.SENSORTYPES;
      const objUpdateVal = {rows: values};

      this._httpService.updateAsObject(`${sensorTypeUrl}/${selectedSensorType['key']}/${this.arrStrCategories[this.type]}`, objUpdateVal)
        .then(()  => {
          this._snackBar.open('The row parameter update is successful!', 'Success', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        }, error =>  console.error(error));
    }
  }

  /*
  Header Param action
  */
  // create new header param
  createHeaderParamEmit(event: any) {
    const selectedSensorType = this.arrSensorTypes[this.selectedSensorTypeId];
    const category = this.arrStrCategories[this.type];
    let values = selectedSensorType[category]['heads'];
    if (!values) {
      values = [];
    }

    if (this.checkExistedName(event, values)) {
      this._nofication.createNotification('alert', 'Alert', 'The field name is already existed!');
      return;
    }

    values.push(event);
    const url = environment.APIS.SENSORTYPES;
    const objUpdateVal = {heads: values};

    this._httpService.updateAsObject(`${url}/${selectedSensorType['key']}/${this.arrStrCategories[this.type]}`, objUpdateVal)
      .then(() => {
        this._snackBar.open('New header parameter creation is successful!', 'Success', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }, error =>  console.error(error));
  }

  // update new header param
  updateHeaderParamEmit(event: any) {
    const selectedSensorType = this.arrSensorTypes[this.selectedSensorTypeId];
    const url = environment.APIS.SENSORTYPES;
    const value = {heads: event.data};

    if (event.isDelete) {
        // check if the param is primary key
      if (event['data'][event.deleteId].hasOwnProperty('primaryKey') &&
        event['data'][event.deleteId]['primaryKey']) {
        const localAlert = 'This category should be deleted, are you sure?';
        const localConfig = {
          disableClose: true,
          data: {
            title: 'Delete',
            description: localAlert
          }
        };
        const localDialogRef = this.dialog.open(ConfirmModalComponent, localConfig);

        localDialogRef.afterClosed().subscribe(result => {
          if (result) {
            this._httpService.deleteAsObject(
              `${environment.APIS.SENSORTYPES}/${selectedSensorType['key']}/${this.arrStrCategories[this.type]}`
            )
              .then(
                () => {
                  this._snackBar.open('Delete is successful!', 'Success', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'center'
                  });
                  this._spinner.stop();
                },
                error =>  console.error(error));
          }
        });

        return;
      }

      const alert = 'Are you sure to delete the sensor type?';
      const config = {
        disableClose: true,
        data: {
          title: 'Delete',
          description: alert
        }
      };
      const dialogRef = this.dialog.open(ConfirmModalComponent, config);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const deletedDataKey = value.heads[event.deleteId].id;
          (value as any).heads.splice(event.deleteId, 1);
          this._spinner.start();

          this._httpService.updateAsObject(`${url}/${selectedSensorType['key']}/${this.arrStrCategories[this.type]}`, value)
            .then(
              res  => {
                this._snackBar.open('The header parameter update is successful!', 'Success', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
                this._spinner.stop();
              },
              error =>  console.error(error));

          // delete the sensor type param in the relevant sensor data table
          if (deletedDataKey) {
            // initial the counter for checking the delete status
            this.totalCounter = 0;
            this.deletedCounter = 0;
            this._spinner.start();

            const category = selectedSensorType[this.arrStrCategories[this.type]];
            const sensorDataUrl = environment.APIS.SENSORDATA;

            this._httpService.getListByOrder(
              `${sensorDataUrl}/${this.arrStrCategories[this.type]}`,
              'sensorTypeId',
              selectedSensorType['key'],
              1
            ).subscribe((data) => {
              if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                  this._httpService
                  .getAsList(`${sensorDataUrl}/${this.arrStrCategories[this.type]}/${data[i].key}/series`).subscribe((sensorDataSeries) => {
                    this.totalCounter += sensorDataSeries.length;

                    for (let s = 0; s < sensorDataSeries.length; s++) {
                      if (sensorDataSeries[s] && sensorDataSeries[s].hasOwnProperty('value')) {
                        const values = sensorDataSeries[s]['value'];
                        if (category.tableType === SENSOR_TYPES[0]) { // row-header case
                          for (const pro in values) {
                            if (values.hasOwnProperty(pro) && values[pro].hasOwnProperty(deletedDataKey)) {
                              delete values[pro][deletedDataKey];
                            }
                          }
                        } else { // header case
                          if (values.hasOwnProperty(deletedDataKey)) {
                            delete values[deletedDataKey];
                          }
                        }

                        this._httpService.updateAsObject(
                          `${sensorDataUrl}/${this.arrStrCategories[this.type]}/${data[i].key}/series/${sensorDataSeries[s].key}/value`,
                          values
                        )
                          .then(
                            () => {
                              console.log('The sensor data param deleted Successfully!');
                              this.deletedCounter ++;
                              this.checkDeleteStatus(this.totalCounter, this.deletedCounter);
                            },
                            error =>  console.error(error));
                      } else {
                        console.log('The sensor data series are not existed.');
                      }
                    }
                  },
                  error => {
                    console.log(error);
                  });
                }
              }
            }, error => {
              console.log(error);
              console.log('You do not have the permission for the sensor data table.');
              this._router.navigate(['/dashboard']);
            });
          } else {
            console.log('The data key is not existed');
            this._spinner.stop();
          }
        }
      });
    } else {
      this._httpService.updateAsObject(`${url}/${selectedSensorType['key']}/${this.arrStrCategories[this.type]}`, value)
        .then(() => {
          this._snackBar.open('The header parameter update is successful!', 'Success', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        }, error =>  console.error(error));
    }
  }

  gotoSensorTypeInfoEmit() {
    const selectedSensorType = this.arrSensorTypes[this.selectedSensorTypeId];
    this._router.navigate([`/sensor_type_info/${selectedSensorType['key']}`]);
  }
}
