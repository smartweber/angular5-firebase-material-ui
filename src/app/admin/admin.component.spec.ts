import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import {
    MatDialog,
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
import { Subject } from 'rxjs/Subject';
import { MockMatModule } from '../core/spec/mock-mat/mock-mat.module';
import { HttpService } from '../services/http.service';
import { EventService } from '../services/event.service';
import { PurehttpService } from '../services/purehttp.service';
import { AuthService } from '../services/auth.service';
import { SpinnerService } from '../components/spinner/spinner.service';
import { global_variables } from '../../environments/global_variables';
import { dialogMock } from '../core/spec/test-mock.spec';

import { AdminComponent } from './admin.component';

// describe('AdminComponent', () => {
//     let component: AdminComponent;
//     let fixture: ComponentFixture<AdminComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 AdminComponent
//             ],
//             imports: [
//                 MockMatModule,
//                 FormsModule,
//                 ReactiveFormsModule
//             ],
//             providers: [
//                 EventService,
//                 SpinnerService,
//                 { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
//                 { provide: HttpService, useClass: HttpServiceMock },
//                 { provide: PurehttpService, useClass: PureHttpServiceMockClass },
//                 { provide: AuthService, useClass: AuthServiceMockClass },
//                 { provide: MatDialog, useClass: MockDialogComponent },
//                 { provide: MatSnackBar, useClass: MockSnackModal },
//                 {
//                     provide: ActivatedRoute,
//                     useValue: {
//                         queryParams: Observable.of({
//                             approval: btoa(JSON.stringify({
//                                 userType: global_variables['userTypes'][0],
//                                 userId: '-user_id'
//                             }))
//                         })
//                     }
//                 },
//             ]
//         })
//         .compileComponents()
//         .then(() => {
//             fixture = TestBed.createComponent(AdminComponent);
//             component = fixture.componentInstance;
//         });
//     }));

//     it('#should check windows width, open staff dialog and get the customer list via refreshing browser', () => {
//         spyOn(component, 'checkWindows');
//         spyOn(component, 'onSelectStaff');
//         spyOn(component, 'onEditUser');
//         spyOn(component, 'getCustomerList');
//         const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//         spyOn(mockHttpService, 'getAsObject').and.callThrough();
//         mockHttpService.returnValue = {
//             key: '-key',
//             info: {
//                 email: 'test@gmail.com'
//             },
//             action: {
//                 role: 'admin',
//                 status: 'Pending'
//             }
//         };

//         component.ngOnInit();
//         fixture.whenStable().then(() => {
//             fixture.detectChanges();
//             expect(component.checkWindows).toHaveBeenCalled();
//             expect(component.onSelectStaff).toHaveBeenCalled();
//             expect(component.onEditUser).toHaveBeenCalled();
//             expect(component.getCustomerList).toHaveBeenCalled();
//         });
//     });

//     it('#should send a invitation by onInvite function', () => {
//         spyOn(component, 'sendInviation');
//         component.nUserType = 0;
//         component.onInvite({
//             preventDefault: () => {
//                 return;
//             }
//         });

//         fixture.whenStable().then(() => {
//             expect(component.sendInviation).toHaveBeenCalled();
//         });
//     });

//     it('#should call invitation cloud function by sendInviation function', () => {
//         spyOn((component as any)._spinner, 'start');
//         spyOn((component as any)._spinner, 'stop');
//         spyOn(component._snackBar, 'open');
//         const mockPurehttpService = fixture.debugElement.injector.get(PurehttpService) as PureHttpServiceMockClass;
//         spyOn(mockPurehttpService, 'callFirebaseFunction').and.callThrough();
//         mockPurehttpService.returnValue = {
//             status: 'success'
//         };

//         component.sendInviation('test@gmail.com', 'admin');
//         expect((component as any)._spinner.start).toHaveBeenCalled();

//         fixture.whenStable().then(() => {
//             expect((component as any)._spinner.stop).toHaveBeenCalled();
//             expect(component._snackBar.open).toHaveBeenCalled();
//         });
//     });

//     it('#should get customers\' information by getCustomerList function', () => {
//         const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//         spyOn(mockHttpService, 'getAsList').and.callThrough();
//         mockHttpService.returnValue = [{
//             name: 'customer',
//             key: 'customerKey'
//         }];
//         const mockAuthService = fixture.debugElement.injector.get(AuthService) as AuthServiceMockClass;
//         mockAuthService.bIsStaff = true;
//         component.getCustomerList();
//         expect(component.bIsStaffUser).toBeTruthy();
//         expect(component.arrObjCustomerList).toBeDefined();
//     });

//     it('#should check the windows by checkWindows function', () => {
//         component.checkWindows(700);
//         expect(component.bIsNavBarController).toBeFalsy();
//         expect(component.bIsNavBar).toBeTruthy();
//     });

//     it('#\'s variables should be initialized by init function', () => {
//         component.init();
//         expect(component.strSearchText).toEqual('');
//         expect(component.bIsPageLaoded).toBeFalsy();
//     });

//     it('#should get omniscent users details by onSelectStaff function', () => {
//         const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//         spyOn(mockHttpService, 'getAsList').and.callThrough();
//         mockHttpService.returnValue = [];
//         spyOn(component, 'initDataTable');
//         component.onSelectStaff();
//         expect(component.initDataTable).toHaveBeenCalled();
//         expect(component.nUserType).toEqual(0);
//     });

//     it('#should get customer users details and set strSelectedCustomerKey variable by onSelectCustomer function', () => {
//         const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//         spyOn(mockHttpService, 'getAsList').and.callThrough();
//         mockHttpService.returnValue = [];
//         spyOn(component, 'initDataTable');
//         const strCustomerKey = '-sdfe';
//         component.onSelectCustomer(strCustomerKey);
//         expect(component.strSelectedCustomerKey).toEqual(strCustomerKey);
//         expect(component.initDataTable).toHaveBeenCalled();
//         expect(component.nUserType).toEqual(1);
//     });

//     it('#should open the edit modal by onEditUser function with the user data included the key', () => {
//         spyOn(component.dialog, 'open');
//         component.onEditUser({key: '-sefds'});
//         expect(component.dialog.open).toHaveBeenCalled();
//     });

//     it('#should open the delete modal by onDeleteUser function with the user data included the key', () => {
//         spyOn(component.dialog, 'open').and.callFake(() => {
//             return {
//                 afterClosed: function() {
//                     return Observable.of(true);
//                 }
//             };
//         });
//         component.onDeleteUser({key: '-sefds'});
//         expect(component.dialog.open).toHaveBeenCalled();
//     });

//     it('#should delete the user by deleteUserAction function', () => {
//         spyOn((component as any)._spinner, 'start');
//         spyOn(component._snackBar, 'open');
//         component.deleteUserAction('-sefds');
//         expect((component as any)._spinner.start).toHaveBeenCalled();
//         expect(component._snackBar.open).toHaveBeenCalled();
//     });
// });

// class HttpServiceMock {
//     returnValue: any;

//     getAsObject(strUrl: string, nTake: number = 0): Observable<any> {
//         return Observable.of(this.returnValue);
//     }

//     getListByOrder(strUrl: string, strOrder: string, strEqual: string, nTake: number = 0) {
//         return Observable.of(this.returnValue);
//     }

//     getAsList(strUrl: string, nTake: number = 0) {
//         return Observable.of(this.returnValue);
//     }

//     deleteAsObject(strUrl: string) {
//         return Promise.resolve(true);
//     }
// }

// class PureHttpServiceMockClass {
//     returnValue: any;

//     callFirebaseFunction(strUrl: string, objPostData: Object) {
//         return Observable.of(this.returnValue);
//     }
// }

// class AuthServiceMockClass {
//     loadAPI: Subject<any>;
//     bIsStaff: boolean;
//     objStaffUser: any;
//     objCustomerUser: any;

//     constructor() {
//         this.loadAPI = new Subject();
//     }

//     setUserData(companyData: any) {
//         this.loadAPI.next({
//             status: 2
//         });
//     }

//     get userData(): Object {
//         const user = this.bIsStaff ? this.objStaffUser : this.objCustomerUser;
//         return user;
//     }

//     get isCheckUser() {
//       return true;
//     }

//     get isUserEmailLoggedIn() {
//       return true;
//     }

//     get isUserStaff() {
//       return this.bIsStaff;
//     }
// }

// class MockDialogComponent {

//     open(component: any, config: any) {
//         return {
//             afterClosed: () => {
//                 return Observable.of(dialogMock.auth.user);
//             }
//         };
//     }
// }

// class MockSnackModal {
//     open(des: string, title: string, config: Object) {
//         return true;
//     }
// }
/**
 * wrote in 2018/6/22
 * update in 2018/8/6
 */
