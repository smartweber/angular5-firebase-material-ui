import {
  Component,
  OnInit,
  OnChanges,
  Input
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-sensor-type-info',
  templateUrl: './sensor-type-info.component.html',
  styleUrls: ['./sensor-type-info.component.scss']
})
export class SensorTypeInfoComponent implements OnInit, OnChanges {
  nSelectedCategory: number;

  isPageLoading: boolean;
  isRowHeader: boolean;
  isHeaderShow: boolean;
  isRowShow: boolean;
  isDebug: boolean;

  selectedSensorType: Object;
  sensorTypes: Object[];
  categories: string[];

  TABLETYPE = ['header_type', 'header_row_type'];
  PARATYPE = ['option'];

  @Input() strTypeKey: string;
  @Input() isComponent: boolean;

  constructor(
    private _activeRoute: ActivatedRoute,
    private _dataService: DataService,
    private _httpService: HttpService
  ) {
    this.nSelectedCategory = -1; /*0: status, 1:voc analytics, 2:debug*/
    this.isPageLoading = false;
    this.isRowHeader = false;
    this.isHeaderShow = false;
    this.isRowShow = false;
    this.isDebug = false;

    this.categories = global_variables['Categories'];
  }

  ngOnInit() {
    if (!this.isComponent) {
      this._activeRoute.params.subscribe(params => {
        this.getSensorTypes(params['id']);
      });
    }

    this.checkAvailability();
  }

  ngOnChanges() {
    if (this.isComponent) { // used as a component
      this.getSensorTypes(this.strTypeKey);
    }
  }

  getSensorTypes(strKey: string) {
    this._httpService.getAsList(`${environment.APIS.SENSORTYPES}/${strKey}`, 1).subscribe(programs => {
        this.sensorTypes = programs;
        this.isPageLoading = true;
        this.onChangeCategory(0);
      },
      error => {
        console.log(error);
      });
  }

  checkAvailability() {
    const userType = this._dataService.getString('customer_id');

    if (userType && userType !== '') { // customer
      this.isDebug = false;
    } else { // staff
      this.isDebug = true;
    }
  }

  onChangeCategory(category: number) {
    this.nSelectedCategory = category;
    const that = this;

    if (this.sensorTypes && this.sensorTypes.length) {
      const types = this.sensorTypes.filter(function(x) {
        return x['key'] === that.categories[that.nSelectedCategory];
      });

      this.selectedSensorType = types[0];

      if ((this.selectedSensorType as any).tableType === this.TABLETYPE[1]) {
        this.isRowHeader = true;
      } else {
        this.isRowHeader = false;
      }

      if ((this.selectedSensorType as any).heads) {
        this.isHeaderShow = true;
      } else {
        this.isHeaderShow = false;
      }

      if ((this.selectedSensorType as any).rows) {
        this.isRowShow = true;
      } else {
        this.isRowShow = false;
      }
    }
  }
}

