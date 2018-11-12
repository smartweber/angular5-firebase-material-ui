import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent implements OnInit {
  strTitle: string;
  strDescription: string;

  constructor(public dialgoRef: MatDialogRef<AlertModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.strTitle = data['title'];
    this.strDescription = data['description'];
  }

  ngOnInit() {
  }

  onClose() {
    this.dialgoRef.close(false);
  }

}
