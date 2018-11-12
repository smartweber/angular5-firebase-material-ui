import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sensor-topbar',
  templateUrl: './sensor-topbar.component.html',
  styleUrls: ['./sensor-topbar.component.scss']
})
export class SensorTopbarComponent implements OnInit {

  @Input() sensorName: string;

  constructor(private _location: Location) {
  }

  ngOnInit() {
  }

  onBack() {
    this._location.back();
  }

}
