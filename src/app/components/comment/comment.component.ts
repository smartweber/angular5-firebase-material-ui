import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  ViewChild,
  ElementRef,
  EventEmitter
} from '@angular/core';
import {
  MatDialog
} from '@angular/material';
import { CommentModalComponent } from '../../modals/comment-modal/comment-modal.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnChanges {
  @Input() strComment: string;
  @Input() key: string;
  @Output() updateComment = new EventEmitter();

  @ViewChild('displayElement') displayElement: ElementRef;

  bIsHover: boolean;

  constructor(
    public dialog: MatDialog
  ) {
    this.bIsHover = false;
  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.applyToElement();
  }

  applyToElement() {
    if (!this.strComment) {
      this.strComment = '';
    }
    this.displayElement.nativeElement.innerHTML = '';
    this.displayElement.nativeElement.insertAdjacentHTML('beforeend', this.strComment);
  }

  onOver() {
    this.bIsHover = true;
  }

  onEdit(bIsEdit: boolean) {
    const config = {
      width: '400px',
      disableClose: false,
      data: {
        bIsEdit: bIsEdit,
        strComment: this.strComment
      }
    };
    const dialogRef = this.dialog.open(CommentModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result && result['status']) {
        this.updateComment.emit({
          comment: (result as any).comment,
          key: this.key
        });
      }
    });
  }

  onLeave() {
    this.bIsHover = false;
  }
}
