import { Component,
  OnInit,
  Input,
  Output,
  ElementRef,
  ViewChild,
  EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.dev';
import { MapsAPILoader } from '@agm/core';
declare let google: any;

@Component({
  selector: 'app-customer-map',
  templateUrl: './customer-map.component.html',
  styleUrls: ['./customer-map.component.scss']
})
export class CustomerMapComponent implements OnInit {
  isLoading: boolean;

  @Input() customers: any[];
  @Input() zones: any[];
  @Input() strCustomerKey: string;
  @Input() strZoneKey: string;
  @Input() strSensorKey: string;
  @Input() nIsBorder: number;

  latlngbounds: any;
  paths: any[];
  pos = [];
  positions = [];
  pathObjects: Object[];

  constructor(
    private el: ElementRef,
    private _router: Router,
    public _mapApiLoader: MapsAPILoader
  ) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.pathObjects = [];
    this.positions = [];
    this.paths = [];

    if (!this.customers) {
      this.customers = [];
    }

    if (!this.zones) {
      this.zones = [];
    }

    for (let i = 0; i < this.zones.length; i++) {
      const zone = this.zones[i];
      const sensors = [];
      const color = this.getCustomerColor((zone as any).customerId);
      const icon = this.pinSymbol(color);

      for (const key in zone.sensors) {
        if (zone.sensors.hasOwnProperty(key)) {
          const sensor = zone.sensors[key];
          if (sensor.hasOwnProperty('lat') && sensor.hasOwnProperty('lng')) {
            this.positions.push({
              position: [parseFloat(sensor.lat), parseFloat(sensor.lng)],
              icon: icon,
              customerKey: sensor.customerId,
              zoneKey: sensor.zoneId,
              sensorKey: sensor.key,
              label: {
                text: sensor.name,
                color: color
              }
            });

            sensors.push({
              lat: parseFloat(sensor.lat),
              lng: parseFloat(sensor.lng),
              customerKey: sensor.customerId,
              zoneKey: sensor.zoneId,
              zoneColor: (zone as any).color
            });
          }
        }
      }

      this.generateAllLines(sensors);
    }

    this.init();
  }

  init() {
    // Initialize the Geocoder
    this._mapApiLoader.load().then(() => {
      if (this.strCustomerKey && this.strZoneKey && this.strSensorKey) { // sensor
        const strZoneKey = this.strZoneKey;
        const arrZoneList = this.zones.filter(function(e) {
          return e.key === strZoneKey;
        });

        if (arrZoneList[0] && arrZoneList[0].sensors.length > 0) {
          const strSensorKey = this.strSensorKey;
          const sensors = arrZoneList[0].sensors.filter((s) => {
            return s.key === strSensorKey;
          });
          this.calculateAutoZoom(sensors);
        }
      } else if (this.strCustomerKey && this.strZoneKey) { // zone
        const strZoneKey = this.strZoneKey;
        const arrZoneList = this.zones.filter(function(e) {
          return e.key === strZoneKey;
        });

        if (arrZoneList[0] && arrZoneList[0].sensors.length > 0) {
          this.calculateAutoZoom(arrZoneList[0].sensors);
        }
      } else if (this.strCustomerKey) { // customer
        const strCustomerKey = this.strCustomerKey;
        const arrZoneList = this.zones.filter(function(e) {
          return e.customerId === strCustomerKey;
        });

        let arrSensorlistShowed = [];

        for (let i = 0; i < arrZoneList.length; i ++) {
          if (arrZoneList[i] && arrZoneList[i].sensors.length > 0) {
            arrSensorlistShowed = arrSensorlistShowed.concat(arrZoneList[i].sensors);
          }
        }

        if (arrSensorlistShowed.length > 0) {
          this.calculateAutoZoom(arrSensorlistShowed);
        }
      } else {
        let arrSensorlistShowed = [];

        for (let i = 0; i < this.zones.length; i ++) {
          if (this.zones[i] && this.zones[i].sensors.length > 0) {
            arrSensorlistShowed = arrSensorlistShowed.concat(this.zones[i].sensors);
          }
        }

        if (arrSensorlistShowed.length > 0) {
          this.calculateAutoZoom(arrSensorlistShowed);
        }
      }
    });
  }

  calculateAutoZoom(arrSensors: any[]) {
    const latlngs = arrSensors.filter((item) => {
      return item.hasOwnProperty('lat') && item.hasOwnProperty('lng');
    }).map((item) => {
      return new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng));
    });

    this.latlngbounds = new google.maps.LatLngBounds();
    for (let i = 0; i < latlngs.length; i ++) {
      this.latlngbounds.extend(latlngs[i]);
    }
  }

  // get customer color with zone Object
  getCustomerColor(customerKey: string) {
    let color;

    for (let i = 0; i < this.customers.length; i++) {
      if (customerKey === (this.customers[i] as any).key) {
        color = (this.customers[i] as any).color;
        break;
      }
    }

    return color;
  }

  // click the sensor marker
  clickMarker(customerKey: string, zoneKey: string, sensorKey: string) {
    if (this.nIsBorder === 1) {
      this._router.navigate(['/customer'], { queryParams: {
        type: 'list',
        customerId: customerKey,
        zoneId: zoneKey,
        sensorId: sensorKey
      } });
    }
  }

  // click the line in google map
  clickLine(customerKey: string, zoneKey: string) {
    if (this.nIsBorder === 1) {
      this._router.navigate(['/customer'], { queryParams: {
        type: 'list',
        customerId: customerKey,
        zoneId: zoneKey
      } });
    }
  }

  // connect between two lines
  generateAllLines(arrLine: any[]) {
    for (let i = 0; i < arrLine.length; i++) {
      for (let j = i; j < arrLine.length; j++) {
        if (i !== j) {
          this.paths.push([
            {
              lat: parseFloat(arrLine[i].lat),
                lng: parseFloat(arrLine[i].lng),
                customerKey: arrLine[i].customerKey,
                zoneKey: arrLine[i].zoneKey,
                zoneColor: arrLine[i].zoneColor
            },
            {
              lat: parseFloat(arrLine[j].lat),
                lng: parseFloat(arrLine[j].lng)
            }
          ]);
        }
      }
    }
  }

  // generate the pin with background color
  pinSymbol(color: string) {
      return {
          path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#000',
          strokeWeight: 2,
      scale: 1,
      label: 'sensor'
     };
  }
}
