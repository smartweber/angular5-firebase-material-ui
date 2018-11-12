import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';
import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { global_variables } from '../../../environments/global_variables';
import { environment } from '../../../environments/environment.dev';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.scss']
})
export class InviteModalComponent implements OnInit {
  bIsLoadModal: boolean;
  bIsCheckUser: boolean;
  strCurrentUserType: string;
  strError: string;
  arrStrUserTypes: string[];
  arrObjRoles: Object[];

  inviteForm: FormGroup;
  formErrors: Object;
  validationMessages: Object;

  constructor(
    public dialgoRef: MatDialogRef<InviteModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public _httpService: HttpService
  ) {
    this.arrStrUserTypes = global_variables['userTypes'];
    this.bIsLoadModal = false;
    this.bIsCheckUser = false;
    this.strError = '';

    this.validationMessages = {
      email: {
        required: 'Email is required',
        pattern: 'Invalid email pattern'
      },
      role: {
        required: 'Password is required'
      }
    };

    this.formErrors = {
      email: '',
      role: ''
    };

    if (data && data['type'] === this.arrStrUserTypes[0]) { // staff
      this.arrObjRoles = [
        { value: 'admin', display: 'Administrator' },
        { value: 'developer', display: 'Developer' },
        { value: 'debugger', display: 'Debug Operator' },
        { value: 'operator', display: 'Operator'} ,
        { value: 'viewer', display: 'Viewer' }
      ];

      this.strCurrentUserType = this.arrStrUserTypes[0];
    } else if (data && data['type'] === this.arrStrUserTypes[1]) { // customer
      this.arrObjRoles = [
        { value: 'admin', display: 'Administrator' },
        { value: 'operator', display: 'Operator' },
        { value: 'viewer', display: 'Viewer' }
      ];

      this.strCurrentUserType = this.arrStrUserTypes[1];
    } else {
      this.arrObjRoles = [];
      this.strCurrentUserType = '';
    }
  }

  ngOnInit() {
    if (this.arrObjRoles.length === 0) {
      this.close();
    } else {
      const emailRegEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      this.inviteForm = new FormGroup({
        email: new FormControl('', [
          <any>Validators.required,
          <any>Validators.pattern(emailRegEx)
        ]),
        role: new FormControl(this.arrObjRoles[0]['value'], [
          <any>Validators.required
        ])
      });

      this.inviteForm.valueChanges.subscribe(data => this.onValueChanged(data));
      this.bIsLoadModal = true;
    }
  }

  // check the validation
  onValueChanged(data?: any) {
    if (!this.inviteForm) { return; }

    const form = this.inviteForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  submit(event) {
    event.preventDefault();
    this.bIsCheckUser = true;
    this.strError = '';

    if (this.inviteForm.valid) {
      this._httpService.getListByOrder(
        `${environment['APIS']['USERS']}/${this.strCurrentUserType}`,
        'info/email',
        this.inviteForm['value']['email'],
        1
      ).subscribe((users) => {
        if (users && users.length > 0) {
          this.strError = 'The user is already existed';
        } else {
          this.dialgoRef.close(this.inviteForm['value']);
        }

        this.bIsCheckUser = false;
      }, error => {
        console.log(error);
        this.strError = 'Internet connection error';
        this.bIsCheckUser = false;
      });
    }
  }

  close() {
    this.dialgoRef.close();
  }

}
