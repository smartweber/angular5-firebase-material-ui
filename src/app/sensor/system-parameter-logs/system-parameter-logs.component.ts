import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';
import { Subscription } from 'rxjs/Subscription';
import {
  MatPaginator,
  MatTableDataSource,
  MatDialog,
  MatSnackBar
} from '@angular/material';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { AngularFireStorage } from 'angularfire2/storage';
import { PurehttpService } from '../../services/purehttp.service';

@Component({
  selector: 'app-system-parameter-logs',
  templateUrl: './system-parameter-logs.component.html',
  styleUrls: ['./system-parameter-logs.component.scss']
})
export class SystemParameterLogsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() sensorKey: string;
  @Input() sensorType: Object;
  sensorDataSub: Subscription;
  logs: Object[];
  columns: string[];
  dataSource: any;
  fireFunctionUrl: string;
  selectedItemKey: string;
  isDownloading: boolean;
  statusSensorType: Object;
  @ViewChild('paginator') paginator: MatPaginator;

  constructor(
    private _httpService: HttpService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _storage: AngularFireStorage,
    private _purehttpService: PurehttpService
  ) {
    this.logs = [];
    this.columns = ['sequence', 'time', 'action'];
    this.dataSource = new MatTableDataSource();
    this.fireFunctionUrl = global_variables['FirebaseFunctionUrlCloud']; // cloud
    // this.fireFunctionUrl = global_variables.FirebaseFunctionUrlLocal; // local
    this.isDownloading = false;
    this.selectedItemKey = '';
    this.statusSensorType = {};
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.initData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

  initData() {
    this.logs = [];
    this.statusSensorType = {};

    if (this.sensorKey) {
      this.sensorDataSub = this._httpService.getAsList(`${environment.APIS.SENSORDATA}/status/${this.sensorKey}/logs`).subscribe((list) => {
        if (list) {
          this.logs = list
          .sort((a, b) => {
            return parseFloat(b['timestamp']) - parseFloat(a['timestamp']);
          })
          .map((item, index) => {
            return {
              sequence: index,
              key: item['key'],
              storageUrl: item['storageUrl'],
              downloadUrl: item['downloadUrl'],
              time: item['timestamp'] ? this.convertToDate(item['timestamp']) : 'N/A'
            };
          });
          this.dataSource.data = this.logs;
        }
      });
    }

    if (this.sensorType) {
      for (let index = 0; index < this.sensorType['status']['rows'].length; index ++) {
        const row = this.sensorType['status']['rows'][index];
        this.statusSensorType[row['id']] = row['name'];
      }
    }
  }

  onDelete(item: Object) {
    this.selectedItemKey = item['key'];
    const config = {
      disableClose: true,
      data: {
        title: 'Delete',
        description: 'Are you sure to delete the analytical data file?'
      }
    };
    const dialogRef = this._dialog.open(ConfirmModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // delete the file from storage
        this.deleteStorageFile(item['storageUrl']).then(() => {

        }).catch(() => {
          this._snackBar.open('Deleting a file is failed!', 'Error', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        });

        const url = `${environment.APIS.SENSORDATA}/status/${this.sensorKey}/logs/${item['key']}`;

        this._httpService.deleteAsObject(url)
          .then(() => {
            console.log('Successfully delete database: ' + url);
            this._snackBar.open('Deleting is successful!', 'Success', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          }, error => {
            console.log('Fail to delete database: ' + url);
            console.error(error);
            this._snackBar.open('Deleting is failed!', 'Error', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          });
      }
    });
  }

  onDownload(item: Object) {
    if (Object.keys(this.statusSensorType).length === 0) {
      this._snackBar.open('Empty system parameter keys of the sensor type.', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      return;
    }

    this.isDownloading = true;
    this.selectedItemKey = item['key'];
    const objPostData = {
      url: item['downloadUrl']
    };

    this._purehttpService.callFirebaseFunction(`${this.fireFunctionUrl}/getData`, objPostData).subscribe((res: any) => {
      const data = res.data;
      const newData = this.adjustFileData(data);
      const csv = this.convertToCSV(newData);
      this.downloadFile(csv, 'log.csv');
    }, error => {
      console.log('Fail to get the data to download.');
      console.log(error);
      this._snackBar.open('Downloading is failed!', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      this.isDownloading = false;
    });
  }

  convertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (const index in array[i]) {
          if (array[i].hasOwnProperty(index)) {
            if (line !== '') {
              line += ',';
            }

            line += array[i][index];
          }
        }

        str += line + '\r\n';
    }

    return str;
}

  adjustFileData(data) {
    const newData = [];
    const keys = [];
    let isGetKeys = false;
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const item = data[key];
          const newRow = [];

          if (isGetKeys) {
            if (keys.length > 0) {
              newRow.push(item['timestamp']);
              for (let index = 0; index < keys.length; index ++) {
                if (item['value'].hasOwnProperty(keys[index])) {
                  newRow.push(item['value'][keys[index]]);
                } else {
                  newRow.push('');
                }
              }
            }
          } else {
            const titles = ['timestamp'];
            newRow.push(item['timestamp']);
            for (const itemKey in item['value']) {
              if (item['value'].hasOwnProperty(itemKey) && this.statusSensorType.hasOwnProperty(itemKey)) {
                keys.push(itemKey);
                titles.push(this.statusSensorType[itemKey]);
                newRow.push(item['value'][itemKey]);
              }
            }
            newData.push(titles);
          }

          isGetKeys = true;
          newData.push(newRow);
        }
      }
    }

    return newData;
  }

  downloadFile(data: any, strName: string) {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', strName);
    link.click();
    this.isDownloading = false;
  }

  // delete the file from storage
  deleteStorageFile(storageUrl: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._storage.ref(storageUrl).delete().take(1).subscribe(() => {
        // File deleted successfully
        console.log('Successfully delete the storage file: ' + storageUrl);
        resolve();
      }, err => {
        // Uh-oh, an error occurred!
        console.log('Fail to delete the storage file: ' + storageUrl);
        console.log(err);
        reject();
      });
    });
  }

}
