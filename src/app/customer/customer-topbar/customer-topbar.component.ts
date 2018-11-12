import { Component,
  OnInit,
  Input,
  Output,
  EventEmitter } from '@angular/core';

@Component({
  selector: 'app-customer-topbar',
  templateUrl: './customer-topbar.component.html',
  styleUrls: ['./customer-topbar.component.scss']
})
export class CustomerTopbarComponent implements OnInit {
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
