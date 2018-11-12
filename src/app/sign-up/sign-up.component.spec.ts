import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
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
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';
import { PurehttpService } from '../services/purehttp.service';
import { NotificationService } from '../services/notification.service';
import { SpinnerService } from '../components/spinner/spinner.service';

import { SignUpComponent } from './sign-up.component';

// describe('SignUpComponent', () => {
//   let component: SignUpComponent;
//   let fixture: ComponentFixture<SignUpComponent>;
//   const NotificationMocks = {
//     createNotification: function(type: string, title: string, content: string) {
//       return true;
//     }
//   };
//   let mockRouter;

//   beforeEach(async(() => {
//     mockRouter = { navigate: jasmine.createSpy('navigate') };
//     TestBed.configureTestingModule({
//       declarations: [ SignUpComponent ],
//       imports: [
//         MatFormFieldModule,
//         MatCardModule,
//         MatCheckboxModule,
//         MatProgressBarModule,
//         MatIconModule,
//         FormsModule,
//         ReactiveFormsModule,
//         BrowserAnimationsModule
//       ],
//       providers: [
//         SpinnerService,
//         { provide: Router, useValue: mockRouter },
//         {
//           provide: ActivatedRoute, useValue: {
//             params: Observable.of({
//               customerId: 'customer1'
//             })
//           }
//         },
//         { provide: HttpService, useClass: HttpServiceMockClass },
//         { provide: AuthService, useClass: AuthServiceMockClass },
//         { provide: NotificationService, useValue: NotificationMocks },
//         { provide: PurehttpService, useClass: PureHttpServiceMockClass }
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SignUpComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('#By refreshing the browser, company information is gotten and register form is created.', () => {
//     spyOn(component, 'createRegisterForm');
//     const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMockClass;
//     spyOn(mockHttpService, 'getListByOrder').and.callThrough();
//     mockHttpService.returnValue = [{
//       logo: 'logo',
//       key: '-key'
//     }];
//     component.ngOnInit();
//     expect(component.createRegisterForm).toHaveBeenCalled();
//     expect(component.isLoadPage).toBeTruthy();
//   });

//   it('#By createRegisterForm function, register form is created.', () => {
//     component.createRegisterForm();
//     expect(component.signUpForm).toBeDefined();
//   });

//   it('#By submit function, the user is signed up.', async(() => {
//     spyOn(component, 'saveUserData');
//     component.createRegisterForm();
//     fixture.detectChanges();
//     component.signUpForm.controls['email'].setValue('ade@gmail.com');
//     component.signUpForm.controls['password'].setValue('123');
//     component.signUpForm.controls['confirmPassword'].setValue('123');
//     fixture.detectChanges();
//     component.submit();
//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       expect(component.saveUserData).toHaveBeenCalled();
//     });
//   }));

//   it('#By emailRequest function, register form is created.', () => {
//     const mockPurehttpService = fixture.debugElement.injector.get(PurehttpService) as PureHttpServiceMockClass;
//     spyOn(mockPurehttpService, 'callFirebaseFunction').and.callThrough();
//     mockPurehttpService.returnValue = {
//       status: 'success'
//     };
//     spyOn((component as any)._nofication, 'createNotification');
//     component.emailRequest('-userId');
//     fixture.detectChanges();
//     expect((component as any)._nofication.createNotification)
//       .toHaveBeenCalledWith('success', 'Email', 'Your request is successfully sent to Admin email!');
//   });

//   it('#By saveUserData function, register form is created.', () => {
//     spyOn(component, 'emailRequest');
//     spyOn(component, 'gotoLogin');
//     const mockPurehttpService = fixture.debugElement.injector.get(PurehttpService) as PureHttpServiceMockClass;
//     spyOn(mockPurehttpService, 'callFirebaseFunction').and.callThrough();
//     mockPurehttpService.returnValue = {
//       status: 'success'
//     };
//     component.saveUserData({
//       uid: '-uid'
//     });
//     fixture.detectChanges();
//     expect(component.emailRequest).toHaveBeenCalled();
//     expect(component.gotoLogin).toHaveBeenCalled();
//   });

//   it('#By gotoLogin function, register form is created.', () => {
//     const customerId = '';
//     component.customerPath = customerId;
//     component.gotoLogin();
//     fixture.detectChanges();
//     expect(mockRouter.navigate).toHaveBeenCalled();
//   });
// });

// class HttpServiceMockClass {
//   returnValue: any;

//   getAsObject(strUrl: string, nTake: number = 0) {
//     return Observable.of({
//       logo: 'logo'
//     });
//   }

//   getListByOrder(strUrl: string, strOrder: string, strEqual: string, nTake: number = 0) {
//     return Observable.of(this.returnValue);
//   }
// }

// class AuthServiceMockClass {
//   loadAPI: Subject<any>;

//   constructor() {
//     this.loadAPI = new Subject();
//   }

//   signUpWithEmail(email: string, password: string): Promise<any> {
//     return Promise.resolve();
//   }

//   logout() {
//     return Promise.resolve();
//   }
// }

// class PureHttpServiceMockClass {
//   returnValue: any;

//   callFirebaseFunction(strUrl: string, objPostData: Object) {
//     return Observable.of(this.returnValue);
//   }
// }
/**
 * Write in 2018/8/21
 */
