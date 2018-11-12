import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MatTableDataSource, MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment.dev';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { Calibration } from '../../models/calibration';
import { database } from 'firebase';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-sensor-calibration',
  templateUrl: './sensor-calibration.component.html',
  styleUrls: ['./sensor-calibration.component.scss']
})
export class SensorCalibrationComponent implements OnInit, OnDestroy, AfterViewInit {
  paramSub: Subscription;
  dataSub: Subscription;
  sensorSub: Subscription;
  sensorTypeSub: Subscription;
  calibrationSeriesSub: Subscription;
  calibrationRecentSub: Subscription;
  calibrationStausSub: Subscription;
  barometricPressureSub: Subscription;

  sensorKey: string;
  selectedCalibrationKey: string;

  totalVOCLabel: string;
  temperatureLabel: string;
  humidityLabel: string;
  totalVOCKey: string;
  tempartureKey: string;
  humidityKey: string;
  calibrationStaus: string;
  barometricPressureComment: string;

  barometricPressure: number;
  savedBarometricPressure: number;
  dataSource: any;
  recentCalibrationData: Object;

  isLoadSeriesCalibration: boolean;
  isLoadRecentCalibration: boolean;


  originCalibration: Calibration;
  savedCalibration: Calibration;
  savedCommentCalibration: Calibration;
  selectedCalibration: Calibration;
  selectedCommentCalibration: Calibration;

  calibrations: Object[];
  columns: string[];
  @ViewChild('paginator') paginator: MatPaginator;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _httpService: HttpService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource();
    this.columns = ['no', 'time', 'action', 'comment'];
    this.calibrations = [];
    this.totalVOCLabel = 'Ambient Total VOC';
    this.temperatureLabel = 'Ambient Temperature (°C)';
    this.humidityLabel = 'Ambient Relative Humidity';
    this.totalVOCKey = '';
    this.tempartureKey = '';
    this.humidityKey = '';
    this.selectedCalibrationKey = '';
    this.calibrationStaus = '';
    this.isLoadSeriesCalibration = false;
    this.isLoadRecentCalibration = false;
    this.recentCalibrationData = {};
    this.originCalibration = new Calibration();
    this.savedCalibration = new Calibration();
    this.savedCommentCalibration = new Calibration();
    this.selectedCalibration = new Calibration();
    this.selectedCommentCalibration = new Calibration();
  }

  ngOnInit() {
    this.paramSub = this._route.params.subscribe(params => {
      this.sensorKey = params['sensorKey'];
      this.getData();
    });
  }

  ngOnDestroy() {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

    if (this.sensorSub) {
      this.sensorSub.unsubscribe();
    }

    if (this.sensorTypeSub) {
      this.sensorTypeSub.unsubscribe();
    }

    if (this.calibrationSeriesSub) {
      this.calibrationSeriesSub.unsubscribe();
    }

    if (this.calibrationRecentSub) {
      this.calibrationRecentSub.unsubscribe();
    }

    if (this.calibrationStausSub) {
      this.calibrationStausSub.unsubscribe();
    }

    if (this.barometricPressureSub) {
      this.barometricPressureSub.unsubscribe();
    }

    this.updateCalibrationStatus(1);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getData() {
    const combineSubscribe = combineLatest(
      this.getSensorData(),
      this.getSensorTypeKeys()
    );

    this.dataSub = combineSubscribe.subscribe(data => {
      if (data[0] && data[0]['value']) {
        this.originCalibration.zeroGas = data[0]['value'][this.totalVOCKey];
        this.originCalibration.spanGas = data[0]['value'][this.totalVOCKey];
        this.originCalibration.temparature = data[0]['value'][this.tempartureKey];
        this.originCalibration.humidity = data[0]['value'][this.humidityKey];
      }
    });

    this.calibrationSeriesSub = this._httpService.getAsList(
      `${environment['APIS']['CALIBRATIONDATA']}/${this.sensorKey}/series`).subscribe((calibrationData: any) => {
        this.calibrations = [];
        if (calibrationData) {
          let no = 0;
          this.calibrations = calibrationData.filter((item) => {
            return item['timestamp'] && item['valueArea'];
          }).sort((a, b) => {
            return parseFloat(b['timestamp']) - parseFloat(a['timestamp']);
          }).map((item) => {
            no ++;
            return {
              no: no,
              key: item['key'],
              commentArea: item['commentArea'],
              time: this.convertToDate(item['timestamp']),
              timestamp: item['timestamp'],
              valueArea: item['valueArea'],
              comment: item['comment'] ? item['comment'] : ''
            };
          });
        }
        this.dataSource.data = this.calibrations;
        this.isLoadSeriesCalibration = true;
    });

    this.calibrationRecentSub = this._httpService.getAsObject(
      `${environment['APIS']['CALIBRATIONDATA']}/${this.sensorKey}/recent`).subscribe((calibrationData: any) => {
        this.selectedCalibration = new Calibration();
        this.selectedCommentCalibration = new Calibration();
        this.recentCalibrationData = {};
        if (calibrationData) {
          this.recentCalibrationData = calibrationData;
          if (calibrationData['commentArea']) {
            this.selectedCommentCalibration = calibrationData['commentArea'];
          }

          if (calibrationData['valueArea']) {
            this.selectedCalibration = calibrationData['valueArea'];
          }

          this.selectedCalibrationKey = calibrationData['seriesKey'];
        }
        this.isLoadRecentCalibration = true;
      });

      this.calibrationStausSub = this._httpService.getAsObject(
      `${environment['APIS']['SENSORDEVICES']}/${this.sensorKey}/calibrationStatus`).subscribe((calibrationStatus: any) => {
        if (calibrationStatus && calibrationStatus.hasOwnProperty('$value')) {
          switch (calibrationStatus['$value']) {
            case 0:
              this.calibrationStaus = 'Start';
              break;

            case 1:
              this.calibrationStaus = 'Stop';
              break;

            case 2:
              this.calibrationStaus = 'Save';
              break;

            default:
              this.calibrationStaus = 'N/A';
              break;
          }
        }
      });
      this.barometricPressureSub = this._httpService.getAsObject(
        `${environment['APIS']['CALIBRATIONDATA']}/${this.sensorKey}/barometricPressure`).subscribe((barometricPressure: any) => {
          this.savedBarometricPressure = null;
          this.barometricPressureComment = null;
          if (barometricPressure) {
            this.savedBarometricPressure = barometricPressure.hasOwnProperty('value') ? barometricPressure['value'] : null;
            this.barometricPressureComment = barometricPressure['comment'];
          }
        });
  }

  getSensorData(): Observable<any> {
    const url = `${environment['APIS']['SENSORDATA']}/status/${this.sensorKey}/recent`;
    return this._httpService.getAsObject(url);
  }

  getSensorTypeKeys(): Observable<any> {
    return new Observable<any>(observer => {
      this.sensorSub = this._httpService.getAsObject(`${environment['APIS']['SENSORS']}/${this.sensorKey}`).subscribe((sensorData: any) => {
        if (sensorData && sensorData['sensorTypeId']) {
          if (this.sensorTypeSub) {
            this.sensorTypeSub.unsubscribe();
          }
          this.sensorTypeSub = this._httpService.getAsObject(
            `${environment['APIS']['SENSORTYPES']}/${sensorData['sensorTypeId']}`).subscribe((sensorTypeData: any) => {
              if (sensorTypeData && sensorTypeData['status']) {
                if (sensorTypeData['status']['rows']) {
                  for (let index = 0; index < sensorTypeData['status']['rows'].length; index ++) {
                    if (sensorTypeData['status']['rows'][index]['name'] === this.totalVOCLabel) {
                      this.totalVOCKey = sensorTypeData['status']['rows'][index]['id'];
                    }

                    if (sensorTypeData['status']['rows'][index]['name'] === this.temperatureLabel) {
                      this.tempartureKey = sensorTypeData['status']['rows'][index]['id'];
                    }

                    if (sensorTypeData['status']['rows'][index]['name'] === this.humidityLabel) {
                      this.humidityKey = sensorTypeData['status']['rows'][index]['id'];
                    }
                  }
                  observer.next(true);
                } else {
                  observer.next(false);
                }
              } else {
                this._snackBar.open('Empty system parameter for this sensor type.', 'Error', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
                observer.next(false);
              }
          });
        } else {
          this._snackBar.open('Empty sensor type for this sensor.', 'Error', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          observer.next(false);
        }
      });
    });
  }

  onSet(key: string) {
    this.savedCalibration[key] = this.originCalibration[key] ? parseFloat(this.originCalibration[key]) : 0;
  }

  onSaveCalibration() {
    if (Object.keys(this.savedCalibration).length !== 6) {
      this._snackBar.open('Please fill all of saved values.', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      return;
    }

    for (const key in this.savedCalibration) {
      if (this.savedCalibration.hasOwnProperty(key)) {
        const element = this.savedCalibration[key];
        if (!element && element !== 0) {
          this._snackBar.open('Please fill all of saved values.', 'Error', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          return;
        }
      }
    }
    const postValue = {
      timestamp: database.ServerValue.TIMESTAMP,
      valueArea: this.savedCalibration,
      commentArea: this.savedCommentCalibration
    };
    this._httpService.createAsList(`${environment.APIS.CALIBRATIONDATA}/${this.sensorKey}/series`, postValue).then((res) => {
      this._httpService.getAsObject(
        `${environment['APIS']['CALIBRATIONDATA']}/${this.sensorKey}/series/${res}`, 1).subscribe((calibration: any) => {
          calibration['seriesKey'] = calibration['key'];
          delete calibration['key'];
          this._httpService.updateAsObject(`${environment.APIS.CALIBRATIONDATA}/${this.sensorKey}/recent`, calibration).then(() => {
            this._snackBar.open('Saving is successful!', 'Success', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
            this.updateCalibrationStatus(2);
            this.savedCalibration = new Calibration();
            this.savedCommentCalibration = new Calibration();
            this._httpService.updateAsObject(`${environment['APIS']['SENSORDEVICES']}/${this.sensorKey}`, {
              calibrationSavedTimestamp: calibration['timestamp']
            });
          }).catch((error) => {
            console.log(error);
            this._snackBar.open('Internet or Permission Error.', 'Error', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          });
        });
    }).catch((error) => {
      console.log(error);
      this._snackBar.open('Internet or Permission Error.', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    });
  }

  /**
   * update calibration status
   * @param status (0: start, 1: stop, 2: save)
   */
  updateCalibrationStatus(status: number) {
    return this._httpService.updateAsObject(`${environment['APIS']['SENSORDEVICES']}/${this.sensorKey}`, {
      calibrationStatus: status
    });
  }

  formatDate(data: string) {
    if (data.length === 1) {
      data = '0' + data;
    }
    return data;
  }

  convertToDate(timestamp: number) {
    const date = new Date(timestamp);
    let day = date.getDate() + '';
    let month = (date.getMonth() + 1) + '';
    let year = date.getFullYear() + '';
    let hour = date.getHours() + '';
    let minutes = date.getMinutes() + '';
    let seconds = date.getSeconds() + '';

    if (isNaN(parseInt(day, 10)) || isNaN(parseInt(month, 10)) || isNaN(parseInt(year, 10)) ||
      isNaN(parseInt(seconds, 10)) || isNaN(parseInt(minutes, 10)) || isNaN(parseInt(hour, 10))) {
      return 'N/A';
    } else {
      day     = this.formatDate(day);
      month   = this.formatDate(month);
      year    = this.formatDate(year);
      hour    = this.formatDate(hour);
      minutes = this.formatDate(minutes);
      seconds = this.formatDate(seconds);

      return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
    }
  }

  onUpdateComment(event: any) {
    if (event.hasOwnProperty('comment') && event['key']) {
      const objUpdateValue = {
        comment: event['comment']
      };

      this._httpService.updateAsObject(
        `${environment['APIS']['CALIBRATIONDATA']}/${this.sensorKey}/series/${event['key']}`, objUpdateValue)
        .then(() => {
          this._snackBar.open('Updating a comment is successful!', 'Success', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        }, error => {
          console.error(error);
          this._snackBar.open('Updating a comment is failed.', 'Fail', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        });
    } else {
      console.log('The comment or key is empty');
    }
  }

  onLoad(calibration: Object) {
    this.selectedCalibration = new Calibration();
    this.selectedCommentCalibration = new Calibration();
    this.selectedCalibrationKey = calibration['key'];
    if (calibration['commentArea']) {
      this.selectedCommentCalibration = calibration['commentArea'];
    }

    if (calibration['valueArea']) {
      this.selectedCalibration = calibration['valueArea'];
    }
  }

  onSubmit(calibration: Object) {
    const config = {
      disableClose: true,
      data: {
        title: 'Submit',
        description: 'Are you sure to submit this saved calibration?'
      }
    };
    const dialogRef = this.dialog.open(ConfirmModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!calibration['commentArea']) {
          delete calibration['commentArea'];
        }
        const updateValue = Object.assign({}, calibration);
        updateValue['seriesKey'] = calibration['key'];
        this._httpService.updateAsObject(
          `${environment['APIS']['CALIBRATIONDATA']}/${this.sensorKey}/recent`, updateValue)
          .then(() => {
            this.selectedCalibrationKey = calibration['key'];
            this.updateCalibrationStatus(2);
          }, error => {
            console.error(error);
            this._snackBar.open('Submitting a calibration is failed.', 'Fail', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          });
      }
    });
  }

  onDelete(calibration: Object) {
    const config = {
      disableClose: true,
      data: {
        title: 'Delete',
        description: 'Are you sure to delete this saved calibration?'
      }
    };
    const dialogRef = this.dialog.open(ConfirmModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._httpService.deleteAsObject(
          `${environment['APIS']['CALIBRATIONDATA']}/${this.sensorKey}/series/${calibration['key']}`)
          .then(() => {
            this.selectedCalibrationKey = '';
            this._snackBar.open('Saved calibration deletion is successful!', 'Success', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          }, error => {
            console.error(error);
            this._snackBar.open('Saved calibration deletion is failed.', 'Fail', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          });
      }
    });
  }

  onStartCalibration() {
    this.updateCalibrationStatus(0);
  }

  onStopCalibration() {
    this.updateCalibrationStatus(1);
  }

  onCancelCalibration() {
    this.updateCalibrationStatus(1).then(() => {
      this._router.navigate(['/sensor_list']);
    }).catch((error) => {
      console.log(error);
      this._snackBar.open('Internet Connection Error.', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    });
  }

  onLoadRecentCalibration() {
    this.selectedCalibration = new Calibration();
    this.selectedCommentCalibration = new Calibration();
    if (this.recentCalibrationData) {
      if (this.recentCalibrationData['commentArea']) {
        this.selectedCommentCalibration = this.recentCalibrationData['commentArea'];
      }

      if (this.recentCalibrationData['valueArea']) {
        this.selectedCalibration = this.recentCalibrationData['valueArea'];
      }

      this.selectedCalibrationKey = this.recentCalibrationData['seriesKey'];
    }
  }

  onUpdateBP() {
    this._httpService.postAsObject(
      `${environment['APIS']['CALIBRATIONDATA']}/${this.sensorKey}/barometricPressure`, {
        value: this.barometricPressure,
        comment: this.barometricPressureComment ? this.barometricPressureComment : ''
      })
      .then(() => {
        this._snackBar.open('Updating barometric pressure is successful!', 'Success', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }).catch((error) => {
        console.log(error);
        this._snackBar.open('Internet Connection Error.', 'Error', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      });
  }
}
