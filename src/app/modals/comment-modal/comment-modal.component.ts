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
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss']
})
export class CommentModalComponent implements OnInit {
  strComment: string;
  bIsEdit: boolean;

  constructor(public dialgoRef: MatDialogRef<CommentModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.strComment = data['strComment'];
    this.bIsEdit = data['bIsEdit'];
  }

  ngOnInit() {
  }

  close() {
    this.dialgoRef.close({status: false});
  }

  done() {
    this.dialgoRef.close({status: true, comment: this.strComment});
  }
}

