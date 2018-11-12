import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import {
    MatToolbarModule,
    MatMenuModule,
    MatIconModule
} from '@angular/material';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { EventService } from '../services/event.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { TopBarComponent } from './top-bar.component';

// describe('TopBarComponent', () => {
//     let component: TopBarComponent;
//     let fixture: ComponentFixture<TopBarComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 TopBarComponent
//             ],
//             providers: [
//                 EventService,
//                 { provide: Router, useValue: {
//                     navigate: jasmine.createSpy('navigate'),
//                     events: new Subject().asObservable()
//                 } },
//                 { provide: DataService, useClass: DataServiceMocks },
//                 { provide: AuthService, useClass: AuthServiceMockClass },
//                 { provide: Location, useValue: { back: function() { return true; }} }
//             ],
//             imports: [
//                 MatToolbarModule,
//                 MatMenuModule,
//                 MatIconModule
//             ]
//         })
//         .compileComponents()
//         .then(() => {
//             fixture = TestBed.createComponent(TopBarComponent);
//             component = fixture.componentInstance;
//         });
//     }));

//     it('#init the login variable by init function', async(() => {
//         const mockAuthService = fixture.debugElement.injector.get(AuthService) as AuthServiceMockClass;
//         mockAuthService.bIsStaff = true;
//         mockAuthService.objCompanyData = {
//             logo: 'https://logo.com/logo.png'
//         };
//         component.init();
//         expect(component.bIsLogin).toBeTruthy();
//     }));

//     it('#check the user auth status by checkAuth function', async(() => {
//         spyOn(component, 'init');
//         component.checkAuth();
//         fixture.whenStable().then(() => {
//             expect(component.init).toHaveBeenCalled();
//         });
//     }));
// });

// class DataServiceMocks {
//     returnValue: any;
//     getString(strName: string) {
//         return this.returnValue;
//     }
// }

// class AuthServiceMockClass {
//     loadAPI: Subject<any>;
//     bIsStaff: boolean;
//     objStaffUser: any;
//     objCustomerUser: any;
//     objCompanyData: any;

//     constructor() {
//         this.loadAPI = new Subject();
//     }

//     setUserData(companyData: any) {
//         this.loadAPI.next({
//             status: 2
//         });
//     }

//     get companyData(): Object {
//         return this.objCompanyData;
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
/**
 * wrote in 2018/4/12
 * */
