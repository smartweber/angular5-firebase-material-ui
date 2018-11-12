import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {
  createType: number;

  typeString: string;
  customerId: string;
  zoneId: string;
  createName: string;

  routeParamsSub: any;
  routeQueryParamsSub: any;

  constructor(
    private route: ActivatedRoute
  ) {
    this.createType = -1; // 0: customer, 1: sensor, 2: zone
  }

  ngOnInit() {
    // get URL parameters
      this.routeParamsSub = this.route
          .params
          .subscribe(params => {
              this.typeString = params['name']; // --> Name must match wanted paramter

              if (this.typeString === 'newCustomer') {
                this.createType = 0;
              } else if (this.typeString === 'newZone') {
                this.createType = 1;
              } else  if (this.typeString === 'newSensor') {
                this.createType = 2;
              } else {
                this.createType = -1;
              }
      });

      this.routeQueryParamsSub = this.route
          .queryParams
          .subscribe(params => {
        this.createName = params['create'];
            this.customerId = params['customerId'];
            this.zoneId = params['zoneId'];
      });
  }

  ngOnDestroy() {
    if (this.routeParamsSub) {
      this.routeParamsSub.unsubscribe();
    }

    if (this.routeQueryParamsSub) {
      this.routeQueryParamsSub.unsubscribe();
    }
  }
}
