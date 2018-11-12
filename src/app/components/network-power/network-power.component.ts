import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-network-power',
  templateUrl: './network-power.component.html',
  styleUrls: ['./network-power.component.scss']
})
export class NetworkPowerComponent implements OnInit, OnChanges {
  @Input() powerCount: number;
  powers: number[];

  constructor() {
    this.powers = [];
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.powers = [];
    for (let index = 0; index < 5; index ++) {
      const value = this.powerCount > index ? 1 : 0;
      this.powers.push(value);
    }
  }

}
