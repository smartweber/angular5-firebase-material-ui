import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @Input() strInputType: string;
  @Input() strValue: string;
  @Input() arrStrOptions: string[];
  @Output() doneEdit = new EventEmitter();
  arrStrInputTypes: string[];
  bIsEdit: boolean;
  bIsShowEditBtn: boolean;

  constructor() {
    this.arrStrInputTypes = ['number', 'text', 'textarea', 'date', 'option'];
    this.bIsEdit = false;
    this.bIsShowEditBtn = false;
  }

  ngOnInit() {
    if (!this.strInputType) {
      this.strInputType = this.arrStrInputTypes[0];
    }
  }

  onOver() {
    this.bIsShowEditBtn = true;
  }

  onLeave() {
    this.bIsShowEditBtn = false;
  }

  onClickEdit() {
    this.bIsEdit = true;
  }

  onDone() {
    this.bIsEdit = false;
    this.bIsShowEditBtn = false;
    this.doneEdit.emit(this.strValue);
  }

}
