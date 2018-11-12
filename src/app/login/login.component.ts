import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import { environment } from '../../environments/environment.dev';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';
import { NotificationService } from '../services/notification.service';
import { SpinnerService } from '../components/spinner/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  strCustomerPath: string;
  strCompanyLogo: string;
  strReturnedUrl: string;

  isSubmit: boolean;
  isTryLogin: boolean;
  isLoadPage: boolean;

  customerPortalSub: any;
  authLoadAPISub: any;
  paramSub: any;
  companyInfoSub: any;

  loginForm: FormGroup;
  formErrors: Object;
  validationMessages: Object;

  constructor(
    public _authService: AuthService,
    private _httpService: HttpService,
    private _spinner: SpinnerService,
    private _nofication: NotificationService,
    private _router: Router,
    private cdRef: ChangeDetectorRef,
    private _route: ActivatedRoute
  ) {
    this.strCustomerPath = '';
    this.isSubmit = false;
    this.isTryLogin = false;
    this.isLoadPage = false;

    this.validationMessages = {
      email: {
        required: 'Email is required',
        pattern: 'Please enter a valid address'
      },
      password: {
        required: 'Password is required'
      }
    };
    this.formErrors = {
      email: '',
      password: ''
    };
  }

  ngOnInit() {
    this.paramSub = this._route.params.subscribe(params => {
      this.strCustomerPath = params['customerId'];
      // this.strReturnedUrl = decodeURIComponent(this._route.snapshot.queryParams['returnUrl'] || '/dashboard');
      this.strReturnedUrl = '/dashboard';

      if (this.strCustomerPath) { // customer user
        this.companyInfoSub = this._httpService.getListByOrder(
          `${environment['APIS']['CUSTOMERPORTALS']}`,
          'path',
          this.strCustomerPath
        ).subscribe((customerInfo: Object[]) => {
          if (customerInfo && customerInfo.length > 0) {
            this.strCompanyLogo = customerInfo[0]['logo'];
            this.createLoginForm();
            this.isLoadPage = true;
            this._spinner.stop();
          } else {
            this._nofication.createNotification('error', 'Error', 'The company\'s portal is not existed');
            this.cdRef.detectChanges();
            this._router.navigate(['/login']);
          }
        }, error => {
          console.log(error);
        });
      } else { // omniscent user
        this.companyInfoSub = this._httpService.getAsObject(environment['APIS']['STAFFINFO']).subscribe(staffInfo => {
          if (staffInfo) {
            this.strCompanyLogo = staffInfo['logo'];
          }

          this.createLoginForm();
          this.isLoadPage = true;
          this._spinner.stop();
        }, error => {
          console.log(error);
        });
      }
    });
  }

  createLoginForm() {
    this.checkLoginStatus();
    const emailRegEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    this.loginForm = new FormGroup({
      email: new FormControl('', [
        <any>Validators.required,
        <any>Validators.pattern(emailRegEx)
      ]),
      password: new FormControl('', [
        <any>Validators.required
      ])
    });

    this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  // check the validation
  onValueChanged(data?: any) {
    if (!this.loginForm) { return; }

    const form = this.loginForm;
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

  ngOnDestroy() {
    if (this.customerPortalSub) {
      this.customerPortalSub.unsubscribe();
    }

    if (this.authLoadAPISub) {
      this.authLoadAPISub.unsubscribe();
    }

    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }

    if (this.companyInfoSub) {
      this.companyInfoSub.unsubscribe();
    }
  }

  submitLogin(event) {
    event.preventDefault();

    if (this.loginForm) {
      this.isSubmit = true;
      this.isTryLogin = true;
      this._authService.loginWithEmail(this.loginForm['value']['email'], this.loginForm['value']['password'])
        .then(() => {
          this.isSubmit = false;
        })
        .catch((error) => {
          this._nofication.createNotification('error', 'Error', error.message);
          this.isSubmit = false;
        });
    }
  }

  checkLoginStatus() {
    this._spinner.start();

    this.authLoadAPISub = this._authService.loadAPI.subscribe((res: Object) => {
      console.log('--login--');
      console.log(res);
      let bIsLogin = false;

      switch (res['status']) {
        case -1:

          break;
        case 0:
          this._nofication.createNotification('error', 'Error', res['message']);
          break;
        case 1:
          this._nofication.createNotification('info', 'Alert', res['message']);
          break;
        case 2:
          if (this.isSubmit) {
            this._nofication.createNotification('success', 'Login Success', 'Welcome to Omniscent!');
          }
          bIsLogin = true;
          this.redirectToReturnUrl(this.strReturnedUrl);
          break;
      }

      if (!bIsLogin && res['status'] !== -1) {
        this._authService.logout(false);
      }
      this._spinner.stop();
    },
    error => {
      console.log(error);
      this._spinner.stop();
    });

    if (this._authService.isCheckUser) { // get the user auth status already
      this._spinner.stop();

      if (this._authService.isUserEmailLoggedIn) { // user already logined
        this.redirectToReturnUrl(this.strReturnedUrl);
      }
    }
  }

  redirectToReturnUrl(url: string) {
    const queryParams = this.parseQueryString(url);
    const mainUrl = this.strReturnedUrl.split('?')[0];
    if (queryParams && Object.keys(queryParams).length !== 0) {
      this._router.navigate([mainUrl], { queryParams: queryParams });
    } else {
      if (mainUrl) {
        this._router.navigate([mainUrl]);
      } else {
        this._router.navigate(['/dashboard']);
      }
    }
  }

  parseQueryString(query: string) {
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    const params = {};
    let match;
    while (match = regex.exec(query)) {
      params[match[1]] = match[2];
    }
    return params;
  }

  goToSignUp() {
    if (this.strCustomerPath) {
      this._router.navigate([`/${ this.strCustomerPath }/register`]);
    } else {
      this._router.navigate(['/register']);
    }
  }
}
