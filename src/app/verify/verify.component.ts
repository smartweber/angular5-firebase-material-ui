import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import {
  MatSnackBar
} from '@angular/material';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import { PurehttpService } from '../services/purehttp.service';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { PasswordValidation } from '../components/password-validation';

import { environment } from '../../environments/environment.dev';
import { global_variables } from '../../environments/global_variables';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  signUpForm: FormGroup;
  forgotPasswordForm: FormGroup;
  formErrors: Object;
  validationMessages: Object;
  accountInfo: Object;

  type: number;
  isPageLoad: boolean;
  isSend: boolean;
  isResend: boolean;
  emailRegex: any;

  constructor(
    private _activeRoute: ActivatedRoute,
    private _purehttpService: PurehttpService,
    private fb: FormBuilder,
    public _snackBar: MatSnackBar,
    private _authService: AuthService,
    private _httpService: HttpService,
    private _nofication: NotificationService,
    private _cdRef: ChangeDetectorRef,
    private _router: Router
  ) {
    this.type = -1;
    this.isPageLoad = false;
    this.isSend = false;
    this.isResend = false;
    this.emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.validationMessages = {
      email: {
        required: 'Email is required',
        pattern: 'Please enter a valid address'
      },
      password: {
        required: 'Password is required'
      },
      confirmPassword: {
        required: 'Confirm password is required',
        MatchPassword: 'Password not match'
      }
    };
    this.formErrors = {
      email: '',
      password: '',
      confirmPassword: ''
    };
  }

  ngOnInit() {
    this._activeRoute.params.subscribe(params => {
      this._activeRoute.queryParams
        .filter(queryParams => queryParams.data)
        .subscribe(queryParams => {
          this.accountInfo = JSON.parse(atob(queryParams.data));

          if (params['type'] === 'set_password') {
            const resultValideAccountInfo = this.validateAccountData();
            if (resultValideAccountInfo['status']) {
              this.type = 0;
              this.createSignupForm();
            } else {
              this._nofication.createNotification('error', 'Error', resultValideAccountInfo['message']);
              this._cdRef.detectChanges();
              this._router.navigate(['/login']);
            }
          }

          this.isPageLoad = true;
        });

      if (params['type'] === 'forgot_password') {
        this.type = 1;
        this.createForgotPasswordForm();
        this.isPageLoad = true;
      }
    });
  }

  validateAccountData() {
    if (!this.accountInfo['email']) {
      return {
        status: false,
        message: 'Empty email'
      };
    }

    if (!this.accountInfo['role']) {
      return {
        status: false,
        message: 'Empty user role'
      };
    }

    if (!this.accountInfo.hasOwnProperty('userType')) {
      return {
        status: false,
        message: 'Empty user type'
      };
    }

    if (this.accountInfo['userType'] === 1 && !this.accountInfo['customerKey']) {
      return {
        status: false,
        message: 'Empty customer key'
      };
    }

    return {
      status: true
    };
  }

  onSubmitSignUp() {
    if (this.signUpForm.valid) {
      this.isSend = true;
      this._authService.signUpWithEmail(this.accountInfo['email'], this.signUpForm['value']['password'])
        .then(res => {
          this.saveUser(res);
        })
        .catch((error) => {
          console.error('Error fetching users', error);
          this._nofication.createNotification('error', 'Error', error['message']);
          this.isSend = false;
        });
    }
  }

  saveUser(userData: any) {
    if (userData['uid']) {
      let type = global_variables['userTypes'][0];

      const newUserData = {
        info: {
          email: userData['email']
        },
        action: {
          status: global_variables['userStatus'][0],
          role: this.accountInfo['role']
        }
      };

      if (this.accountInfo['userType'] === 0) {
        type = global_variables['userTypes'][0];
      } else {
        type = global_variables['userTypes'][1];
        newUserData['info']['customerId'] = this.accountInfo['customerKey'];
      }

      this._httpService.postAsObject(`${environment.APIS.USERS}/${type}/${userData['uid']}`, newUserData)
        .then(
          ()  => {
            this.isSend = false;
            this._nofication.createNotification('success', 'Register', 'Successful register');
            this._cdRef.detectChanges();
            this._router.navigate(['/login']);
          },
          error => {
            this.isSend = false;
            console.error(error);
            this._snackBar.open('Internet connection error', 'Error', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          });
    } else {
      this._nofication.createNotification('error', 'Error', 'Your account is not saved properly.');
    }
  }

  onSubmitForgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.isSend = true;
      this._authService.resetPassword(this.forgotPasswordForm['value']['email'])
        .then(() => {
          this._nofication.createNotification('success', 'Success', 'Email transmission is successful, please check your email!');
          this.isSend = false;
          this.isResend = true;
        })
        .catch((error) => {
          console.error('Error fetching users', error);
          this._nofication.createNotification('error', 'Error', 'Fail to send a email');
        });
    }
  }

  createForgotPasswordForm() {
    this.forgotPasswordForm = this.fb.group({
      email: new FormControl('', [
          <any>Validators.required,
          <any>Validators.pattern(this.emailRegex)
        ])
    });

    this.forgotPasswordForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  createSignupForm() {
    this.signUpForm = this.fb.group({
      password: new FormControl('', [
        <any>Validators.required
      ]),
      confirmPassword: new FormControl('', [
        <any>Validators.required
      ])
    }, {
      validator: PasswordValidation.MatchPassword
    });

    this.signUpForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    let form;
    if (this.type === 0) { // set password case
      form = this.signUpForm;
    } else { // forgot password case
      form = this.forgotPasswordForm;
    }
    if (!form) { return; }

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

}
