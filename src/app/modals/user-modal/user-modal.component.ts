import {
  Component,
  OnInit,
  ViewChild,
  Inject
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatSnackBar
} from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {
  context: any;
  strUserType: string;
  bIsProcess: boolean;

  arrObjRoles: Object[];
  arrStrUserTypes: string[];
  arrStrUserStatus: string[];

  settingForm: FormGroup;
  formErrors: Object;
  validationMessages: Object;

  constructor(
    public dialgoRef: MatDialogRef<UserModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _httpService: HttpService,
    public _snackBar: MatSnackBar
  ) {
    this.context = data;
    this.strUserType = (this.context as any).type;
    this.arrStrUserTypes = global_variables['userTypes'];
    this.arrStrUserStatus = global_variables['userStatus'];

    const arrObjStaffRoles = [
      { value: 'admin', display: 'Administrator' },
      { value: 'developer', display: 'Developer' },
      { value: 'debugger', display: 'Debug Operator'} ,
      { value: 'operator', display: 'Operator' },
      { value: 'viewer', display: 'Viewer' }
    ];

    const arrObjCustomerRoles = [
      { value: 'admin', display: 'Administrator' },
      { value: 'operator', display: 'Operator' },
      { value: 'viewer', display: 'Viewer' }
    ];

    if ( this.strUserType === this.arrStrUserTypes[0] ) { // staff
      this.arrObjRoles = arrObjStaffRoles;
    } else { // customer
      this.arrObjRoles = arrObjCustomerRoles;
    }

    this.bIsProcess = false;
  }

  ngOnInit() {
    this.settingForm = new FormGroup({
      role: new FormControl(this.context['user']['role'] ? this.context['user']['role'] : this.arrObjRoles[0]['value'], [
        <any>Validators.required
      ]),
      status: new FormControl((this.context as any)['user']['status'], [
        <any>Validators.required
      ])
    });
  }

  submitSetting() {
    const objUpdateValue = {
      role: this.settingForm['value']['role'],
      status: this.settingForm['value']['status']
    };
    const selectedUser = this.context['user'];
    this.bIsProcess = true;

    this._httpService.updateAsObject(`${environment['APIS']['USERS']}/${this.strUserType}/${selectedUser['key']}/action`, objUpdateValue)
      .then(
        res  => {
          this._snackBar.open('User information update is successful!', 'Success', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          this.bIsProcess = false;
          this.dialgoRef.close();
        },
        error =>  {
          this._snackBar.open('Fail to update in firebase', 'Error', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          console.error(error);
          this.bIsProcess = false;
          this.dialgoRef.close();
        });
  }

  close(event: any) {
    event.preventDefault();
    this.dialgoRef.close();
  }
}

