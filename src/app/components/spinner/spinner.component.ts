import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  active: boolean;

  constructor(private spinner: SpinnerService) {
    this.spinner.status.subscribe((status: boolean) => {
      this.active = status;
    });
  }

  ngOnInit() {
  }

}
