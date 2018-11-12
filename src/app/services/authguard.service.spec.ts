import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { global_variables } from '../../environments/global_variables';

import { AuthguardService } from './authguard.service';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { HttpService } from './http.service';
import {
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs/Subject';

// describe('AuthguardService', () => {
//     const mockSnapshot: any = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [
//                 AuthguardService,
//                 { provide: RouterStateSnapshot, useValue: mockSnapshot },
//                 {
//                     provide: Router, useValue: {
//                         navigate: jasmine.createSpy('navigate')
//                     }
//                 },
//                 { provide: DataService, useClass: DataServiceMocks },
//                 { provide: HttpService, useClass: HttpServiceMock },
//                 { provide: AuthService, useClass: AuthServiceMockClass },
//                 { provide: ActivatedRouteSnapshot, useClass: MockActivatedRouteSnapshot }
//             ],
//             imports: [
//                 RouterTestingModule
//             ]
//         });
//     });

//     it('#should not allow user to overcome the guard for whatever reasons by canActivate function',
//         inject([AuthguardService], (service: AuthguardService) => {
//         const route = TestBed.get(ActivatedRouteSnapshot);
//         spyOnProperty(route, 'data', 'get').and.returnValue({
//             roles: ['admin'],
//             types: ['staffs']
//         });
//         spyOn(service, 'checkAuthStatus');
//         service.canActivate(route, mockSnapshot);
//         expect(service.checkAuthStatus).toHaveBeenCalled();
//     }));

//     it('#should check user status for an authentication by checkAuthStatus function',
//         inject([AuthguardService], (service: AuthguardService) => {
//         const mockAuthService = TestBed.get(AuthService);
//         mockAuthService.bIsStaff = true;
//         mockAuthService.objStaffUser = {
//             action: {
//                 role: 'admin'
//             }
//         };
//         const res = service.checkAuthStatus(['admin'], [global_variables['userTypes'][0]]);
//         expect(res).toBeTruthy();
//     }));

//     it('#go to dashboard by gotoDashboard function', inject([AuthguardService], (service: AuthguardService) => {
//         const mockAuthService = TestBed.get(AuthService);
//         mockAuthService.bIsStaff = true;
//         service.gotoDashboard();
//         expect((service as any)._router.navigate).toHaveBeenCalledWith(['/dashboard']);
//     }));

//     it('#should logout and redirect to login page by logout function',
//         inject([AuthguardService], fakeAsync((service: AuthguardService) => {
//         spyOn(service, 'gotoLogin');
//         service.logout();
//         tick();
//         expect(service.gotoLogin).toHaveBeenCalled();
//     })));

//     it('#go to login by gotoLogin function', inject([AuthguardService], (service: AuthguardService) => {
//         service.gotoLogin();
//         expect((service as any)._router.navigate).toHaveBeenCalledWith(['/login']);
//     }));
// });

// class DataServiceMocks {
//     returnValue: any;
//     getString(strName: string) {
//         return this.returnValue;
//     }
// }

// class HttpServiceMock {
//     getAsObject(strUrl: string, nTake: number = 0): Observable<any> {
//         return Observable.of({
//             info: {
//                 email: 'test@gmail.com'
//             },
//             action: {
//                 status: 'approved'
//             }
//         });
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

//     logout() {
//         return Promise.resolve();
//     }

//     get userData(): Object {
//       const user = this.bIsStaff ? this.objStaffUser : this.objCustomerUser;
//       return user;
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

// class MockActivatedRouteSnapshot {
//     _data: any;

//     get data() {
//        return this._data;
//     }
// }
/**
 * wrote in  2018/3/30
 * */
