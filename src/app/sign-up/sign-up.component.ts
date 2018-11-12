import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { environment } from '../../environments/environment.dev';
import { global_variables } from '../../environments/global_variables';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';
import { PurehttpService } from '../services/purehttp.service';
import { NotificationService } from '../services/notification.service';
import { PasswordValidation } from '../components/password-validation';
import { SpinnerService } from '../components/spinner/spinner.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  error: string;
  customerPath: string;
  customerId: string;
  companyLogo: string;

  isSubmit: boolean;
  isLoadPage: boolean;

  paramSub: any;
  companyInfoSub: any;

  userTypes: string[];
  customers: Object[]; // all public customers' info

  signUpForm: FormGroup;
  formErrors: Object;
  validationMessages: Object;

  constructor(
    public _authService: AuthService,
    private _httpService: HttpService,
    public _pureHttpService: PurehttpService,
    private _nofication: NotificationService,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _spinner: SpinnerService,
    private cdRef: ChangeDetectorRef
  ) {

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
      },
      type: {
        required: 'Type is required'
      }
    };

    this.formErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      type: ''
    };

    this.userTypes = global_variables['userTypes'];

    this.customerId = '';
    this.customers = [];
    this.isLoadPage = false;
    this.isSubmit = false;
   }

  ngOnDestroy() {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }

    if (this.companyInfoSub) {
      this.companyInfoSub.unsubscribe();
    }
  }

  ngOnInit() {
    this._spinner.start();
    this.paramSub = this._activeRoute.params.subscribe(params => {
      this.customerPath =  params['customerId'];

      if (this.customerPath) { // customer user
        this.companyInfoSub = this._httpService.getListByOrder(
          `${environment['APIS']['CUSTOMERPORTALS']}`,
          'path',
          this.customerPath
        ).subscribe((customerInfo: Object[]) => {
          if (customerInfo && customerInfo.length > 0) {
            this.companyLogo = customerInfo[0]['logo'];
            this.customerId = customerInfo[0]['key'];
            this.createRegisterForm();
            this.isLoadPage = true;
            this._spinner.stop();
          } else {
            this._nofication.createNotification('error', 'Error', 'The company\'s portal is not existed');
            this.cdRef.detectChanges();
            this._authService.logout(true, false, this.customerPath);
          }
        }, error => {
          console.log(error);
        });
      } else { // omniscent user
        this.companyInfoSub = this._httpService.getAsObject(environment['APIS']['STAFFINFO']).subscribe(staffInfo => {
          if (staffInfo) {
            this.companyLogo = staffInfo['logo'];
          }

          this.createRegisterForm();
          this.isLoadPage = true;
          this._spinner.stop();
        }, error => {
          console.log(error);
        });
      }
    });
   }

  createRegisterForm() {
    const emailRegEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.signUpForm = this.fb.group({
      email: new FormControl('', [
        <any>Validators.required,
        <any>Validators.pattern(emailRegEx)
      ]),
      password: new FormControl('', [
        <any>Validators.required
      ]),
      confirmPassword: new FormControl('', [
        <any>Validators.required
      ])
    }, {validator: PasswordValidation.MatchPassword});

    this.signUpForm.valueChanges.subscribe(data => this.onValueChanged(data));
   }

  // check the validation
  onValueChanged(data?: any) {
    if (!this.signUpForm) { return; }

    const form = this.signUpForm;
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

  submit() {
    if (this.signUpForm.valid) {
      this.isSubmit = true;

      this._authService.signUpWithEmail(this.signUpForm['value']['email'], this.signUpForm['value']['password'])
        .then(res => {
          this.saveUserData(res);
        })
        .catch((error) => {
          console.error('Error fetching users', error);
          this._nofication.createNotification('error', 'Alert', error['message']);
          this.isSubmit = false;
        });
    }
  }

  emailRequest(userId: string) {

    const url = window.location.href;
    const arr = url.split('/');
    const result = arr[0] + '//' + arr[2];

    const strFireFunctionUrl = global_variables['FirebaseFunctionUrlCloud']; // cloud
    // let strFireFunctionUrl = global_variables.FirebaseFunctionUrlLocal; // local

    const objPostData = {
      host: result,
      userId: userId,
      customerPath: this.customerPath ? this.customerPath : '',
      systemMode: environment['SystemType']
    };

    this._pureHttpService.callFirebaseFunction(`${strFireFunctionUrl}/registerRequest`, objPostData).subscribe((res: any) => {
      if (res.status === 'success') {
        this._nofication.createNotification('success', 'Email', 'Your request is successfully sent to Admin email!');
      } else {
        this._nofication.createNotification('error', 'Error', 'Fail to send a invitation because of mail service');
      }
    }, error => {
      this._spinner.stop();
      console.log(error);
      this._nofication.createNotification('error', 'Error', 'Fail to send a invitation because of internet connection');
    });

  }

  // save the user data to the user table
  saveUserData(user: any) {
    this.isSubmit = true;
    const uid = user ? user['uid'] : '';
    if (!uid) {
      return;
    }

    let userType = global_variables['userTypes'][0];
    const newUserData: Object = {
      action: {
        status: global_variables['userStatus'][1]
      },
      info: {
        email: this.signUpForm ? this.signUpForm['value']['email'] : ''
      }
    };

    if (this.customerId) {
      userType = global_variables['userTypes'][1];
      newUserData['info']['customerId'] = this.customerId;
    }

    const strFireFunctionUrl = global_variables['FirebaseFunctionUrlCloud']; // cloud
    // let strFireFunctionUrl = global_variables.FirebaseFunctionUrlLocal; // local

    const objPostData = {
      url: `${environment['APIS']['USERS']}/${userType}/${uid}`,
      postData: newUserData
    };

    this._pureHttpService.callFirebaseFunction(`${strFireFunctionUrl}/postAsObject`, objPostData).subscribe((res: any) => {
      this.isSubmit = false;

      if (res['status'] === 'success') {
        this.emailRequest(uid);
        this.gotoLogin();
        this._nofication.createNotification('success', 'Sign up', 'Sign Up Successful!');
      } else {
        this._nofication.createNotification('info', 'Alert', res['message']);
      }
    }, error => {
      console.log(error);
      this.isSubmit = false;
      this._nofication.createNotification('error', 'Error', 'Fail to send a invitation because of internet connection');
    });

  }

  gotoLogin() {
    this._authService.logout(true, false, this.customerPath);
  }

}
