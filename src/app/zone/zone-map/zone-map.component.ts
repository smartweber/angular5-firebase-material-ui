import { Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
declare var google: any;

@Component({
  selector: 'app-zone-map',
  templateUrl: './zone-map.component.html',
  styleUrls: ['./zone-map.component.scss']
})
export class ZoneMapComponent implements OnInit {
  paths: any[];
  positions: any[];
  latlngbounds: any;

  @Input() zoneObjects: any[];
  @Input() centerCoordinate: Object;
  @Input() strZoneKey: string;
  @Input() strSensorKey: string;
  @Input() customerId: string;

  @ViewChild('mapWrap') mapWrap: ElementRef;

  constructor(
    private _router: Router,
    private _mapApiLoader: MapsAPILoader
  ) {
  }

  ngOnInit() {
    this.positions = [];
    this.paths = [];
    let sensors = [];

    for (let i = 0; i < this.zoneObjects.length; i++) {
      sensors = [];
      const icon = this.pinSymbol(this.zoneObjects[i].color);

      for (const key in this.zoneObjects[i]['sensors']) {
        if (this.zoneObjects[i]['sensors'].hasOwnProperty(key)) {
          const sensor = this.zoneObjects[i]['sensors'][key];

          this.positions.push(
          {
            position: [parseFloat(sensor.lat), parseFloat(sensor.lng)],
            icon: icon,
            customerKey: sensor.customerId,
            zoneKey: sensor.zoneId,
            sensorKey: sensor.key,
            label: {
              text: sensor.name,
              color: this.zoneObjects[i].color
            }
          });

          sensors.push({
            lat: parseFloat(sensor.lat),
            lng: parseFloat(sensor.lng),
            customerKey: sensor.customerId,
            zoneKey: sensor.zoneId,
            zoneColor: this.zoneObjects[i]['color']
          });
        }
      }

      this.generateAllLines(sensors);
    }

    if (this.strZoneKey && this.strSensorKey) { // sensor
      const strZoneKey = this.strZoneKey;
      const arrZoneList = this.zoneObjects.filter(function(e) {
        return e.key === strZoneKey;
      });

      if (arrZoneList[0] && arrZoneList[0].sensors.length > 0) {
        const strSensorKey = this.strSensorKey;
        const zoneSensors = arrZoneList[0].sensors.filter((s) => {
          return s.key === strSensorKey;
        });
        this.calculateAutoZoom(zoneSensors);
      }
    } else if (this.strZoneKey) { // zone
      const strZoneKey = this.strZoneKey;
      const arrZoneList = this.zoneObjects.filter(function(e) {
        return e.key === strZoneKey;
      });

      if (arrZoneList[0].sensors.length > 0) {
        this.calculateAutoZoom(arrZoneList[0].sensors);
      }
    } else {
      let arrSensorlistShowed = [];

      for (let i = 0; i < this.zoneObjects.length; i ++) {
        if (this.zoneObjects[i].sensors.length > 0) {
          arrSensorlistShowed = arrSensorlistShowed.concat(this.zoneObjects[i].sensors);
        }
      }

      if (arrSensorlistShowed.length > 0) {
        this.calculateAutoZoom(arrSensorlistShowed);
      }
    }

    this.getMapHeight();
  }

  calculateAutoZoom(arrSensors: any[]) {
    // Initialize the Geocoder
    this._mapApiLoader.load().then(() => {
      const latlngs = arrSensors.filter((item) => {
        return item.hasOwnProperty('lat') && item.hasOwnProperty('lng');
      }).map((item) => {
        return new google.maps.LatLng(parseFloat(item.lat), parseFloat(item.lng));
      });

      this.latlngbounds = new google.maps.LatLngBounds();
      for (let i = 0; i < latlngs.length; i++) {
        this.latlngbounds.extend(latlngs[i]);
      }
    });
  }

  // click the sensor marker
  clickMarker(customerKey: string, zoneKey: string, sensorKey: string) {
    let strMainUrl = '';

    if (!this.customerId) {
      strMainUrl = '/zone';
    } else {
      strMainUrl = `/${this.customerId}/zone`;
    }

    this._router.navigate([strMainUrl], { queryParams: {
      type: 'list',
      zoneId: zoneKey,
      sensorId: sensorKey
    } });
  }

  // click the line in google map
  clickLine(customerKey: string, zoneKey: string) {
    let strMainUrl = '';

    if (!this.customerId) {
      strMainUrl = '/zone';
    } else {
      strMainUrl = `/${this.customerId}/zone`;
    }

    this._router.navigate([strMainUrl], { queryParams: {
      type: 'list',
      zoneId: zoneKey
    } });
  }

  // generate the connections of all lines
  generateAllLines(arrLine: any[]) {
    for (let i = 0; i < arrLine.length; i++) {
      for (let j = i; j < arrLine.length; j++) {
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

  /*
  get map wrap height
  */
  getMapHeight() {
    const marginTopElement = this.mapWrap.nativeElement;
    const marginWrapStyle = marginTopElement.currentStyle || window.getComputedStyle(marginTopElement);
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
     };
  }
}
