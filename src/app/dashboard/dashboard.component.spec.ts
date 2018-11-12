/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
    Component,
    Input,
    Output,
    DebugElement,
    EventEmitter
} from '@angular/core';
import {
    Router,
    ActivatedRoute
} from '@angular/router';
import {
    MatCardModule
  } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { DataService } from '../services/data.service';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';

import { environment } from '../../environments/environment.dev';
import { global_variables } from '../../environments/global_variables';
import { DashboardComponent } from './dashboard.component';

// describe('CustomerComponent', () => {
//     let component: DashboardComponent;
//     let fixture: ComponentFixture<DashboardComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 DashboardComponent
//             ],
//             imports: [
//                 MatCardModule
//             ],
//             providers: [
//                 {
//                     provide: ActivatedRoute, useValue: {
//                         params: Observable.of({
//                             customerId: 'customer1'
//                         })
//                     }
//                 },
//                 {
//                     provide: Router, useValue: {
//                         navigate: jasmine.createSpy('navigate')
//                     }
//                 },
//                 { provide: DataService, useClass: DataServiceMocks },
//                 { provide: HttpService, useClass: HttpServiceMock },
//                 { provide: AuthService, useClass: AuthServiceMockClass }
//             ]
//         })
//         .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(DashboardComponent);
//         component = fixture.componentInstance;
//     });

//     it('#should check user authentication and get the customer portal id via browser refresh', () => {
//         spyOn(component, 'checkUserAuthentication');
//         component.ngOnInit();
//         expect(component.customerPath).toBe('customer1');
//         expect(component.checkUserAuthentication).toHaveBeenCalled();
//     });

//     describe('&in checkUserAuthentication function, ', () => {
//         it('#if you are a staff but you are in customer portal board, it should be redirect to the staff portal dashboard', () => {
//             const mockAuthService = fixture.debugElement.injector.get(AuthService) as AuthServiceMockClass;
//             mockAuthService.bIsStaff = true;
//             component.customerPath = 'customer_path';
//             component.checkUserAuthentication();
//             expect((component as any).router.navigate).toHaveBeenCalledWith(['/dashboard']);
//             expect(component.userSub).not.toBeDefined();
//         });

//         it('#should run the process to check user status', () => {
//             spyOn(component, 'setUserRole');
//             const mockAuthService = fixture.debugElement.injector.get(AuthService) as AuthServiceMockClass;
//             mockAuthService.bIsStaff = false;
//             component.customerPath = 'customer_path';
//             component.checkUserAuthentication();
//             expect(component.setUserRole).toHaveBeenCalled();
//             expect(component.bIsLoading).toBeTruthy();
//         });
//     });

//     it('#should set user role by setUserRole function', () => {
//         const adminRole = 'admin';
//         component.setUserRole({action: {role: adminRole}});
//         expect(component.strUserRole).toEqual(adminRole);
//     });
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

//     get currentUserId() {
//         return 'ABC123';
//     }
// }
/**
 * wrote in 2018/4/2
 * */
