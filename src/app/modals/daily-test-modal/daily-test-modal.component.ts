import {
  Component,
  OnInit,
  Inject,
  ViewChild
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatPaginator,
  MatTableDataSource
} from '@angular/material';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';

@Component({
  selector: 'app-daily-test-modal',
  templateUrl: './daily-test-modal.component.html',
  styleUrls: ['./daily-test-modal.component.scss']
})
export class DailyTestModalComponent implements OnInit {
  strCurrentDataType: string;
  strSelectConfigKey: string;
  strError: string;
  isLoadTable: boolean;
  nModalType: number;
  nScheduleTime: number;
  arrDataTypes: string[];
  arrTableColumns: string[];
  arrSchedules: Object[];
  arrConfigs: Object[];

  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('table') table: any;

  constructor(
    public dialgoRef: MatDialogRef<DailyTestModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _httpService: HttpService
  ) {
    this.isLoadTable = false;
    this.nModalType = 1;
    this.nScheduleTime = -1;
    this.strSelectConfigKey = '';
    this.strError = '';
    this.arrDataTypes = global_variables['DataTypes'];
    this.arrTableColumns = ['position', 'name', 'time', 'actions'];
    this.strCurrentDataType = this.arrDataTypes[0];
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
  }

  ngOnInit() {
    this.getConfigList();
  }

  close() {
    this.dialgoRef.close();
  }

  getConfigList() {
    this.isLoadTable = true;
    this._httpService.getListByOrder(
      `${environment.APIS.CONFIGURATIONS}`,
      'mode',
      this.strCurrentDataType,
      1
    ).subscribe((configs) => {
      this.arrConfigs = [];
      let pos = 0;

      this.arrConfigs = configs.filter((item) => {
        return item.modalType === this.nModalType;
      })
      .sort((a, b) => {
        return parseFloat(b.timestamp) - parseFloat(a.timestamp);
      })
      .map((item) => {
        pos ++;

        return {
          position: pos,
          name: (item['path'] && item['path'].indexOf('/') > -1) ? item['path'].split('/').pop() : '',
          url: item['configUrl'],
          path: item['path'],
          time: this.convertToDate(item['timestamp']),
          key: item['key']
        };
      });
      this.isLoadTable = false;
      this.initDataTable();
    },
    error => {
      console.log(error);
      this.arrConfigs = [];
      this.isLoadTable = false;
    });
  }

  checkZero(data: string) {
    if (data.length === 1) {
      data = '0' + data;
    }
    return data;
  }

  convertToDate(timestamp: any) {
    const date = new Date(timestamp);
    let day = date.getDate() + '';
    let month = (date.getMonth() + 1) + '';
    let year = date.getFullYear() + '';
    let hour = date.getHours() + '';
    let minutes = date.getMinutes() + '';
    let seconds = date.getSeconds() + '';

    day     = this.checkZero(day);
    month   = this.checkZero(month);
    year    = this.checkZero(year);
    hour    = this.checkZero(hour);
    minutes = this.checkZero(minutes);
    seconds = this.checkZero(seconds);
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
  }

  initDataTable(nCount: number = 0) {
    if (nCount > 50) {
      console.log('Timeout to create the datatable');
    } else if (!this.table || !this.paginator) {
      setTimeout(() => this.initDataTable(nCount), 50);
    } else {
      this.dataSource = new MatTableDataSource(this.arrConfigs);
      this.dataSource.paginator = this.paginator;
    }
  }

  onChangeSetting() {
    this.getConfigList();
  }

  onUpdateFilter(event: any) {
    let filterValue = event.target.value.toLowerCase();
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onSelect(config: Object) {
    this.strSelectConfigKey = config['key'];
  }

  onUnSelect() {
    this.strSelectConfigKey = '';
  }

  onSubmit() {
    if (!this.strSelectConfigKey || this.nScheduleTime < 0) {
      this.strError = 'Empty configuration file or schedule.';
    } else {
      this.dialgoRef.close({
        configFileKey: this.strSelectConfigKey,
        configSchedule: this.nScheduleTime
      });
    }
  }
}

