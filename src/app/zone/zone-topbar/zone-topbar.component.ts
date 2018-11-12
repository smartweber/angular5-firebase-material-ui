import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter } from '@angular/core';

@Component({
  selector: 'app-zone-topbar',
  templateUrl: './zone-topbar.component.html',
  styleUrls: ['./zone-topbar.component.scss']
})
export class ZoneTopbarComponent implements OnInit {
  @Input() status: number;
  @Output() getTabEven = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onViewTypeChange(event: any) {
    this.getTabEven.emit(event.value);
  }

}
