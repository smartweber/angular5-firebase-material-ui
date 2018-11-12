import { Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { HttpService } from '../../services/http.service';
import { SpinnerService } from '../../components/spinner/spinner.service';
import { environment } from '../../../environments/environment.dev';

@Component({
  selector: 'app-sensor-type-list',
  templateUrl: './sensor-type-list.component.html',
  styleUrls: ['./sensor-type-list.component.scss']
})
export class SensorTypeListComponent implements OnInit, OnDestroy {
  arrSensorTypes: any[];
  sensorTypeSub: any;

  strSelectedType: string;
  strWrapHeight: Object;
  bIsLoadList: boolean;
  bIsLoadDetail: boolean;

  constructor(
    private _httpService: HttpService,
    private _spinner: SpinnerService
  ) {
    this.strSelectedType = '';
    this.bIsLoadList = false;
    this.bIsLoadDetail = false;
    this.arrSensorTypes = [];
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.sensorTypeSub) {
      this.sensorTypeSub.unsubscribe();
    }
  }

  loadData() {
    this.arrSensorTypes = [];
    this._spinner.start();
    this.sensorTypeSub = this._httpService.getAsList(environment.APIS.SENSORTYPES).subscribe(types => {
      if (types.length > 0) {
        this.arrSensorTypes = types;
        this.onSelectType(this.arrSensorTypes[0]['key']);
      }

        this.bIsLoadList = true;
        this._spinner.stop();
      },
      error => {
        console.log(error);
        this._spinner.stop();
      });
  }

  onSelectType(strKey: string) {
    this.strSelectedType = strKey;
    this.bIsLoadDetail = true;
  }
}
