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
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  strTitle: string;
  strDescription: string;

  constructor(public dialgoRef: MatDialogRef<ConfirmModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.strTitle = data['title'];
    this.strDescription = data['description'];
  }

  ngOnInit() {
  }

  onAgree() {
    this.dialgoRef.close(true);
  }

  onClose() {
    this.dialgoRef.close(false);
  }

}
