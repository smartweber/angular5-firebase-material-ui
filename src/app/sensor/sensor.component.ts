import { Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { environment } from '../../environments/environment.dev';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss']
})
export class SensorComponent implements OnInit, OnDestroy {
  isPageLoading: boolean;

  selectedSensor: Object;
  sensorKey: string;

  sensorSub: any;

  constructor(
    private _httpService: HttpService,
    private _activeRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.isPageLoading = false;
  }

  ngOnInit() {
    this._activeRoute.params.subscribe(params => {
      this.sensorKey = params['id'];
      this.sensorSub = this._httpService.getAsObject(`${environment.APIS.SENSORS}/${this.sensorKey}`).subscribe(sensor => {
        if (sensor) {
          this.selectedSensor = sensor;
          this.isPageLoading = true;
        } else {
          this._router.navigate(['/dashboard']);
        }
      },
      error => {
        console.log(error);
      });
    });
  }

  ngOnDestroy() {
    if (this.sensorSub) {
      this.sensorSub.unsubscribe();
    }
  }

}
