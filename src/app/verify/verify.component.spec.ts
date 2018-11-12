import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { VerifyComponent } from './verify.component';
import {
    MatFormFieldModule,
    MatCardModule,
    MatProgressBarModule,
    MatSnackBar
} from '@angular/material';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import {
    Router,
    ActivatedRoute
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { PurehttpService } from '../services/purehttp.service';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';
import { SpinnerService } from '../components/spinner/spinner.service';
import { NotificationService } from '../services/notification.service';

// describe('VerifyComponent', () => {
//     let component: VerifyComponent;
//     let fixture: ComponentFixture<VerifyComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [ VerifyComponent ],
//             imports: [
//                 MatFormFieldModule,
//                 MatCardModule,
//                 MatProgressBarModule,
//                 FormsModule,
//                 ReactiveFormsModule
//             ],
//             providers: [
//                 SpinnerService,
//                 { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
//                 { provide: ActivatedRoute, useClass: MockActivatedRouteClass },
//                 { provide: HttpService, useClass: HttpServiceMockClass },
//                 { provide: PurehttpService, useClass: PureHttpServiceMockClass },
//                 { provide: AuthService, useClass: AuthServiceMockClass },
//                 { provide: MatSnackBar, useClass: MockSnackModalClass },
//                 { provide: NotificationService, useClass: MockNotificationServiceClass }
//             ]
//         })
//         .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(VerifyComponent);
//         component = fixture.componentInstance;
//     });

//     it('#define the specific form for a verication via refreshing browser', () => {
//         spyOn(component, 'createForgotPasswordForm');
//         const mockActivedRoute = fixture.debugElement.injector.get(ActivatedRoute) as MockActivatedRouteClass;
//         mockActivedRoute.params = Observable.of({
//             type: 'forgot_password'
//         });
//         mockActivedRoute.queryParams = Observable.of({
//             data: ''
//         });
//         component.ngOnInit();
//         expect(component.createForgotPasswordForm).toHaveBeenCalled();
//     });

//     it('#submit the sign up form by onSubmitSignUp function', fakeAsync(() => {
//         component.createSignupForm();
//         tick();
//         component.signUpForm.controls['password'].setValue('new customer');
//         component.signUpForm.controls['confirmPassword'].setValue('new customer');
//         component.accountInfo = {
//             email: 'test@gmail.com'
//         };
//         tick();
//         component.onSubmitSignUp();
//         expect(component.isSend).toBeTruthy();
//     }));

//     it('#save the user to cloud by saveUser function', fakeAsync(() => {
//         spyOn((component as any)._nofication, 'createNotification');
//         const user = {
//             email: 'test@gmail.com',
//             uid: '-ei0ewf'
//         };
//         component.accountInfo = {
//             role: 'admin',
//             userType: 0,
//             customerKey: '-ksiffe'
//         };
//         component.saveUser(user);
//         tick();
//         expect((component as any)._nofication.createNotification).toHaveBeenCalled();
//     }));

//     it('#define the sign up form by createSignupForm function', () => {
//         component.createSignupForm();
//         expect(component.signUpForm).toBeDefined();
//     });

//     it('#define the forgot password form by createForgotPasswordForm function', () => {
//         component.createForgotPasswordForm();
//         expect(component.forgotPasswordForm).toBeDefined();
//     });
// });

// class MockActivatedRouteClass {
//     params: Object;
//     queryParams: Object;
// }

// class HttpServiceMockClass {
//     returnValue: any;

//     postAsObject(strUrl: string, value: any): Promise<any> {
//         return Promise.resolve(this.returnValue);
//     }
// }

// class PureHttpServiceMockClass {
//     returnValue: any;

//     callFirebaseFunction(strUrl: string, objPostData: Object) {
//         return Observable.of(this.returnValue);
//     }
// }

// class AuthServiceMockClass {
//     signUpWithEmail(email: string, password: string): Promise<any> {
//         return Promise.resolve({});
//     }

//     resetPassword(email: string): Promise<any> {
//         return Promise.resolve();
//     }
// }

// class MockSnackModalClass {
//     open(des: string, title: string, config: Object) {
//         return true;
//     }
// }

// class MockNotificationServiceClass {
//     createNotification(type: string, title: string, content: string) {
//         return true;
//     }
// }
/**
 * Wrote in 2018/4/12
 * */
