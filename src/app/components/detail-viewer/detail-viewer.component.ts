import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detail-viewer',
  templateUrl: './detail-viewer.component.html',
  styleUrls: ['./detail-viewer.component.scss']
})
export class DetailViewerComponent implements OnInit {
  @Input() strName: string;
  @Input() strDescription: string;

  constructor() { }

  ngOnInit() {
  }

}
