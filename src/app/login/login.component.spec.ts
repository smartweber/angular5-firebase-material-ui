import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
    MatFormFieldModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatIconModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import {
    Router,
    ActivatedRoute
} from '@angular/router';
import { DataService } from '../services/data.service';
import { HttpService } from '../services/http.service';
import { EventService } from '../services/event.service';
import { AuthService } from '../services/auth.service';
import { SpinnerService } from '../components/spinner/spinner.service';
import { NotificationService } from '../services/notification.service';

import { LoginComponent } from './login.component';
import { environment } from '../../environments/environment.dev';
import { global_variables } from '../../environments/global_variables';

// describe('LoginComponent', () => {
//     let component: LoginComponent;
//     let fixture: ComponentFixture<LoginComponent>;
//     const NotificationMocks = {
//         createNotification: function(type: string, title: string, content: string) {
//             return true;
//         }
//     };

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 LoginComponent
//             ],
//             imports: [
//                 FormsModule,
//                 ReactiveFormsModule,
//                 MatProgressBarModule,
//                 MatFormFieldModule,
//                 MatCardModule,
//                 MatCheckboxModule,
//                 MatIconModule
//             ],
//             providers: [
//                 DataService,
//                 EventService,
//                 SpinnerService,
//                 { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
//                 {
//                     provide: ActivatedRoute, useValue: {
//                         params: Observable.of({
//                             customerId: 'customer1'
//                         })
//                     }
//                 },
//                 { provide: HttpService, useClass: HttpServiceMockClass },
//                 { provide: AuthService, useClass: AuthServiceMockClass },
//                 { provide: NotificationService, useValue: NotificationMocks }
//             ]
//         })
//         .compileComponents()
//             .then(() => {
//                 fixture = TestBed.createComponent(LoginComponent);
//                 component = fixture.componentInstance;
//             });
//     }));

//     describe('when refreshing browser,', () => {
//         it('#if customer info matched is existed, the login form will be created', () => {
//             const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMockClass;
//             spyOn(mockHttpService, 'getListByOrder').and.callThrough();
//             mockHttpService.returnValue = [{
//                 logo: 'http://logo.com/logo.png'
//             }];
//             spyOn(component, 'createLoginForm');
//             component.ngOnInit();
//             expect(component.createLoginForm).toHaveBeenCalled();
//         });

//         it('#if customer info matched is not existed, you will be redirected to login page', () => {
//             const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMockClass;
//             spyOn(mockHttpService, 'getListByOrder').and.callThrough();
//             mockHttpService.returnValue = [];
//             component.ngOnInit();
//             expect((component as any)._router.navigate).toHaveBeenCalledWith(['/login']);
//         });
//     });

//     it('#should create login form by createLoginForm() function', () => {
//         spyOn(component, 'checkLoginStatus');
//         component.createLoginForm();
//         expect(component.checkLoginStatus).toHaveBeenCalled();
//         expect(component.loginForm).toBeDefined();
//     });

//     it('#should login in by submitLogin() function', () => {
//         spyOn(component._authService, 'loginWithEmail').and.callThrough();
//         component.createLoginForm();

//         fixture.whenStable().then(() => {
//             const validUser = {
//                 email: 'test@email.com',
//                 password: 'test'
//             };
//             component.loginForm.controls['email'].setValue(validUser.email);
//             component.loginForm.controls['password'].setValue(validUser.password);
//             const event = {
//                 preventDefault: () => {
//                     return;
//                 }
//             };
//             component.submitLogin(event);
//             expect(component._authService.loginWithEmail).toHaveBeenCalled();
//         });
//     });

//     describe('in checkLoginStatus function ,', () => {
//         it('#if you are a valid logined user, you will be redirected to the dashboard from login page', () => {
//             const mockAuthService = fixture.debugElement.injector.get(AuthService) as AuthServiceMockClass;
//             mockAuthService.bIsGetUserData = true;
//             mockAuthService.authState = {
//                 isAnonymous: false
//             };
//             component.checkLoginStatus();
//             expect((component as any)._router.navigate).toHaveBeenCalledWith(['/dashboard']);
//         });

//         it('#user should navigate to ', () => {
//             const mockAuthService = fixture.debugElement.injector.get(AuthService) as AuthServiceMockClass;
//             mockAuthService.bIsGetUserData = true;
//             mockAuthService.authState = {
//                 isAnonymous: false
//             };
//             component.checkLoginStatus();
//             expect((component as any)._router.navigate).toHaveBeenCalledWith(['/dashboard']);
//         });
//     });

// });

// class HttpServiceMockClass {
//     returnValue: any;

//     getAsObject(strUrl: string, nTake: number = 0) {
//         let returnValue = {};
//         if (strUrl.indexOf('customers/ABC123') >=  0) {
//             returnValue = {
//                 info: 'info'
//             };
//         }

//         if (strUrl.indexOf('CustomerPortals') >=  0) {
//             returnValue = {
//                 path: 'path',
//                 logo: 'logo'
//             };
//         }

//         return Observable.of(returnValue);
//     }

//     getListByOrder(strUrl: string, strOrder: string, strEqual: string, nTake: number = 0) {
//         return Observable.of(this.returnValue);
//     }
// }

// class AuthServiceMockClass {
//     loadAPI: Subject<any>;
//     bIsStaff: boolean;
//     objStaffUser: any;
//     objCustomerUser: any;
//     bIsGetUserData: boolean;
//     authState: Object;

//     constructor() {
//         this.loadAPI = new Subject();
//     }

//     setUserData(companyData: any) {
//         this.loadAPI.next({
//             status: 2
//         });
//     }

//     logout() {
//         return Promise.resolve();
//     }

//     loginWithEmail(email: string, password: string) {
//         return Promise.resolve();
//     }

//     get userData(): Object {
//         const user = this.bIsStaff ? this.objStaffUser : this.objCustomerUser;
//         return user;
//     }

//     get isCheckUser() {
//       return this.bIsGetUserData;
//     }

//     get isUserAnonymousLoggedIn(): boolean {
//         return (this.authState !== null) ? this.authState['isAnonymous'] : false;
//     }

//     get isUserEmailLoggedIn() {
//         if ((this.authState !== null) && (!this.isUserAnonymousLoggedIn) && this.bIsGetUserData) {
//             return true;
//         } else {
//             return false;
//         }
//     }

//     get isUserStaff() {
//       return this.bIsStaff;
//     }

//     get currentUserId(): string {
//         return 'ABC123';
//     }
// }
/**
 * wrote in 2018/4/9
 * update in 2018/8/10
 * */
