import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { Location } from '@angular/common';
import {
  MatPaginator,
  MatTableDataSource,
  MatDialog,
  MatSnackBar
} from '@angular/material';
import { HttpService } from '../../services/http.service';
import { PurehttpService } from '../../services/purehttp.service';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';
import { ConfigModalComponent } from '../../modals/config-modal/config-modal.component';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { DailyTestModalComponent } from '../../modals/daily-test-modal/daily-test-modal.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss']
})
export class SensorListComponent implements OnInit, OnDestroy {
  dataSource: any;
  sensorsSub: Subscription;
  sensorDevicesSub: Subscription;
  cronJobDetailsSub: Subscription;
  fileName: string;
  selectedSensorKey: string;
  bIsGetData: boolean;
  strFilerText: string;
  bIsDownloadProcess: boolean;
  bIsDeleteProcess: boolean;
  objDeviceStatus: Object;
  objCrobJobStatus: Object;
  objPreviousDeviceStatus: Object;
  arrFilterColumns: Object[];
  arrStrColumns: string[];
  arrSensors: Object[];
  arrSchedules: Object[];

  @ViewChild('paginator') paginator: MatPaginator;


  constructor(
    private _httpService: HttpService,
    private _purehttpService: PurehttpService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _location: Location,
    private cdRef: ChangeDetectorRef
  ) {
    this.bIsGetData = false;
    this.bIsDownloadProcess = false;
    this.bIsDeleteProcess = false;
    this.fileName = '';
    this.selectedSensorKey = '';
    this.arrSensors = [];
    this.objDeviceStatus = {};
    this.objCrobJobStatus = {};
    this.objPreviousDeviceStatus = {};
    this.arrFilterColumns = [
      {
        key: 'position',
        label: 'No',
        value: true
      },
      {
        key: 'serialNumber',
        label: 'Serial number (raspberry pi serial number)',
        value: true
      },
      {
        key: 'customerName',
        label: 'Name of customer',
        value: true
      },
      {
        key: 'zoneName',
        label: 'Name of zone',
        value: true
      },
      {
        key: 'sensorName',
        label: 'Name of sensor',
        value: true
      },
      {
        key: 'status',
        label: 'Status',
        value: true
      },
      {
        key: 'configure',
        label: 'Assigned configuration for customer',
        value: true
      },
      {
        key: 'time',
        label: 'Sensor Registered date and time by customer for first time',
        value: true
      },
      {
        key: 'dailyTest',
        label: 'Daily test schedule',
        value: true
      },
      {
        key: 'pidCalibration',
        label: 'PID calibration',
        value: true
      },
      {
        key: 'comment',
        label: 'Comment',
        value: true
      }
    ];
    this.arrStrColumns = this.arrFilterColumns
      .filter((item: Object) => {
        if (item['value']) {
          return item;
        }
      })
      .map((item: Object) => item['key']);
    this.arrSchedules = [
      {
        label: '8pm',
        value: 0
      },
      {
        label: '9pm',
        value: 1
      },
      {
        label: '10pm',
        value: 2
      },
      {
        label: '11pm',
        value: 3
      },
      {
        label: '12am',
        value: 4
      },
      {
        label: '1am',
        value: 5
      },
      {
        label: '2am',
        value: 6
      },
      {
        label: '3am',
        value: 7
      },
      {
        label: '4am',
        value: 8
      },
      {
        label: '5am',
        value: 9
      },
      {
        label: '6am',
        value: 10
      }
    ];
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.generateSensorList();
  }

  ngOnDestroy() {
    if (this.sensorsSub) {
      this.sensorsSub.unsubscribe();
    }

    if (this.sensorDevicesSub) {
      this.sensorDevicesSub.unsubscribe();
    }

    if (this.cronJobDetailsSub) {
      this.cronJobDetailsSub.unsubscribe();
    }
  }

  generateSensorList() {
    Promise.all([
      this.getSensorList(),
      this.getSensorDevices(),
      this.getCronJobDetails()
    ]).then(() => {
      this.integrateSensorDetails();
      this.bIsGetData = true;
      this.initDataTable();
    },
    errors => {
      console.log(errors);
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

  getSensorList(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.sensorsSub = this._httpService.getAsList(`${environment.APIS.SENSORS}`).subscribe((sensors) => {
        if (sensors && sensors.length > 0) {
          let position = 0;

          this.arrSensors = sensors.filter((item) => {
            return item['name'];
          }).sort((a, b) => {
            return parseFloat(b['timestamp']) - parseFloat(a['timestamp']);
          }).map((item) => {
            position ++;

            return {
              key: item['key'],
              position: position,
              serialNumber: item['serialNumber'],
              customerName: item['customerName'],
              zoneName: item['zoneName'],
              sensorName: item['name'],
              status: (item['availability'] === global_variables.deviceStatus[0]) ? 1 : 0,
              time: item['timestamp'] ? this.convertToDate(item['timestamp']) : 'N/A',
              comment: '',
              customerId: item['customerId'],
              zoneId: item['zoneId'],
              fileName: '',
              fileKey: '',
              configFileKey: '',
              configSchedule: ''
            };
          });
        }

        if (this.bIsGetData) {
          this.integrateSensorDetails();
        }

        resolve();
      }, reject);
    });
  }

  getSensorDevices(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.objDeviceStatus = <any>{};

      this.sensorDevicesSub = this._httpService.getAsList(environment.APIS.SENSORDEVICES).subscribe((devices: Object[]) => {
        if (devices) {
          for (let i = 0; i < devices.length; i ++) {
            this.objDeviceStatus[devices[i]['key']] = {
              actionStatus: devices[i]['actionStatus'],
              comment: devices[i]['comment'] ? devices[i]['comment'] : '',
              fileName: devices[i]['fileName'] ? devices[i]['fileName'] : '',
              fileKey: devices[i]['fileKey'] ? devices[i]['fileKey'] : '',
              calibrationSavedTimestamp: devices[i]['calibrationSavedTimestamp'] ?
                this.convertToDate(devices[i]['calibrationSavedTimestamp']) : ''
            };
          }
        }

        if (this.bIsGetData) {
          this.integrateSensorDetails();
        }

        resolve();
      }, reject);
    });
  }

  getCronJobDetails(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.objCrobJobStatus = <any>{};

      this.cronJobDetailsSub = this._httpService.getAsList(environment.APIS.CRONJOBTESTSENSOR).subscribe((cronJobDetails: Object[]) => {
        if (cronJobDetails) {
          for (let i = 0; i < cronJobDetails.length; i ++) {
            this.objCrobJobStatus[cronJobDetails[i]['key']] = {
              configFileKey: cronJobDetails[i]['configFileKey'] ? cronJobDetails[i]['configFileKey'] : '',
              configSchedule: (cronJobDetails[i]['configSchedule'] || cronJobDetails[i]['configSchedule'] === 0) ?
                this.arrSchedules[cronJobDetails[i]['configSchedule']] ?
                  this.arrSchedules[cronJobDetails[i]['configSchedule']]['label'] : '' :
                ''
            };
          }
        }

        if (this.bIsGetData) {
          this.integrateSensorDetails();
        }

        resolve();
      }, reject);
    });
  }

  integrateSensorDetails() {
    if (this.objDeviceStatus !== this.objPreviousDeviceStatus) {
      for (let i = 0; i < this.arrSensors.length; i ++) {
        const key = this.arrSensors[i]['key'];

        if (this.objDeviceStatus.hasOwnProperty(key)) {
          if (this.arrSensors[i]['status'] === 1 && this.objDeviceStatus[key]['actionStatus'] === 2) {
            this.arrSensors[i]['status'] = 2;
          }

          if (this.arrSensors[i]['status'] === 2 && this.objDeviceStatus[key]['actionStatus'] !== 2) {
            this.arrSensors[i]['status'] = 1;
          }

          this.arrSensors[i]['comment'] = this.objDeviceStatus[key]['comment'];
          this.arrSensors[i]['fileName'] = this.objDeviceStatus[key]['fileName'];
          this.arrSensors[i]['fileKey'] = this.objDeviceStatus[key]['fileKey'];
          this.arrSensors[i]['calibrationSavedTimestamp'] = this.objDeviceStatus[key]['calibrationSavedTimestamp'];
        }

        if (this.objCrobJobStatus.hasOwnProperty(key)) {
          this.arrSensors[i]['configFileKey'] = this.objCrobJobStatus[key]['configFileKey'];
          this.arrSensors[i]['configSchedule'] = this.objCrobJobStatus[key]['configSchedule'];
        }
      }

      this.objPreviousDeviceStatus = { ...this.objDeviceStatus};
    }
  }

  initDataTable(nCount: number = 0) {
    if (nCount > 50) {
      console.log('Timeout to init the analytical table, Try again.');
    } else if (!this.paginator) {
      nCount ++;
      setTimeout(() => this.initDataTable(nCount), 50);
    } else {
      // this.dataSource = new MatTableDataSource(this.arrSensors);
      this.dataSource.data = this.arrSensors;
      this.dataSource.paginator = this.paginator;
    }
  }

  onConfigure(sensor: Object) {
    const config = {
      width: '560px',
      disableClose: true,
      data: {
        sensor: sensor,
        configData: null,
        isAssignMode: true
      }
    };
    const dialogRef = this.dialog.open(ConfigModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fileName = result['fileName'];

        this._httpService.postAsObject(`${environment['APIS']['SENSORCONFIGS']}/${sensor['key']}`, {
          Current_Modal_Type: result['modalType'],
          File_Name: result['fileName'] ? result['fileName'] : ''
        })
          .then(
            ()  => {
              console.log('Modal type update is successful!');
            },
            error =>  console.error(error));

        this._httpService.postAsObject(`${environment['APIS']['SENSORCONFIGS']}/${sensor['key']}/${result['modalType']}`, result['data'])
          .then(
            ()  => {
              console.log('The sensor is configured successfully.');
            },
            error =>  console.error(error));

        this._httpService.updateAsObject(`${environment['APIS']['SENSORDEVICES']}/${sensor['key']}`, {
          fileName: result['fileName'] ? result['fileName'] : '' ,
          fileKey: result['fileKey'] ? result['fileKey'] : ''
        })
          .then(
            ()  => {
              console.log('Assign is successful!');
            },
            error =>  console.error(error));
      }
    });
  }

  onSetDailyTest(sensor: Object) {
    const config = {
      width: '560px',
      disableClose: true,
      data: {
        sensor: sensor,
        configData: null,
        isAssignMode: true
      }
    };
    const dialogRef = this.dialog.open(DailyTestModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (sensor['key']) {
          this._httpService.updateAsObject(`${environment.APIS.CRONJOBTESTSENSOR}/${sensor['key']}`, {
            configFileKey: result['configFileKey'] ? result['configFileKey'] : '',
            configSchedule: (result['configSchedule'] || result['configSchedule'] === 0) ? result['configSchedule'] : ''
          })
            .then(
              ()  => {
                console.log('Updating schedule is successful!');
              },
              error => {
                console.log(error);
                this._snackBar.open('Internet connection error', 'Error', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
              });
        } else {
          this._snackBar.open('Invalid Sensor', 'Alert', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        }
      }
    });
  }

  downloadFile(data: any, strName: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', strName);
    link.click();
    this.bIsDownloadProcess = false;
  }

  onDownloadFile(sensor: Object) {
    const fileKey = sensor['fileKey'];
    this.selectedSensorKey = sensor['key'];
    this.bIsDownloadProcess = true;

    this._httpService.getAsObject(`${environment.APIS.CONFIGURATIONS}/${fileKey}`, 1).subscribe((file) => {
      if (file && file['path'] && file['configUrl']) {
        const strUri = file['configUrl'];
        const strName = file['path'].split('/').pop();

        const strFireFunctionUrl = global_variables['FirebaseFunctionUrlCloud']; // cloud
        // let strFireFunctionUrl = environment.VARIABLES.FirebaseFunctionUrlLocal; // local
        const objPostData = {
          url: strUri
        };

        this._purehttpService.callFirebaseFunction(`${strFireFunctionUrl}/getData`, objPostData).subscribe((res: any) => {
          const data = res.data;
          this.downloadFile(data, strName);
        }, error => {
          console.log('Fail to get the data to download.');
          console.log(error);
        });
      } else {
        this._snackBar.open('Invalid file path', 'Alert', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    });
  }

  onDeleteConfig(sensor: Object) {
    const config = {
      width: '300px',
      disableClose: true,
      data: {
        title: 'Confirm!',
        description: 'Are you sure to remove the assignment?'
      }
    };
    const dialogRef = this.dialog.open(ConfirmModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bIsDeleteProcess = true;
        this._httpService.updateAsObject(`${environment['APIS']['SENSORDEVICES']}/${sensor['key']}`, {
          fileName: '',
          fileKey: ''
        })
          .then(
            ()  => {
              console.log('Unassign is successful');
              this.bIsDeleteProcess = false;
            },
            error =>  {
              this.bIsDeleteProcess = false;
              console.error(error);
              this._snackBar.open('Network connection error', 'Error', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center'
              });
            });
      }
    });
  }

  onChangeComment(event: Object) {
    if (event.hasOwnProperty('comment') && event['key']) {
      this._httpService.updateAsObject(`${environment.APIS.SENSORDEVICES}/${event['key']}`, {
        comment: event['comment'] ? event['comment'] : '' ,
      })
        .then(
          ()  => {
            console.log('Sensor device comment update is successful');
          },
          error =>  {
            console.error(error);
            this._snackBar.open('Network connection error', 'Error', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          });
    }
  }

  onUpdateFilter(event: any) {
    let filterValue = event.target.value.toLowerCase();

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onDeleteSchedule(sensor: Object) {
    if (!sensor['key']) {
      this._snackBar.open('Invalid Sensor', 'Alert', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      return;
    }

    const config = {
      width: '300px',
      disableClose: true,
      data: {
        title: 'Confirm!',
        description: 'Are you sure to stop this test schedule?'
      }
    };
    const dialogRef = this.dialog.open(ConfirmModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._httpService.updateAsObject(`${environment.APIS.CRONJOBTESTSENSOR}/${sensor['key']}`, {
          configFileKey: '' ,
          configSchedule: ''
        })
          .then(
            ()  => {
              console.log('Deleting schedule is successful!');
            },
            error => {
              console.log(error);
              this._snackBar.open('Network connection error', 'Error', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center'
              });
            });
      }
    });
  }

  onBack() {
    this._location.back();
  }

  onChangeColumnFilter(key: string, event: any) {
    this.arrStrColumns = this.arrFilterColumns
      .filter((item: Object) => {
        if (item['value']) {
          return item;
        }
      })
      .map((item: Object) => item['key']);
    const sensors = this.arrSensors.map(item => ({... item}));
    this.dataSource.data = sensors.map((item: Object) => {
      const columns = [
        'position',
        'serialNumber',
        'customerName',
        'zoneName',
        'sensorName',
        'status',
        'configure',
        'time',
        'dailyTest',
        'comment'
      ];
      for (let index = 0; index < columns.length; index ++) {
        if (this.arrStrColumns.indexOf(columns[index]) < 0) {
          delete item[columns[index]];
        }
      }
      return item;
    });
  }
}
