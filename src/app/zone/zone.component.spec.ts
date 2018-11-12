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
    MatSnackBar
} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../environments/environment.dev';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';
import { SpinnerService } from '../components/spinner/spinner.service';

import { ZoneComponent } from './zone.component';

// describe('ZoneComponent', () => {
//     let component: ZoneComponent;
//     let fixture: ComponentFixture<ZoneComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 ZoneComponent,
//                 MockAppZoneTopbarComponent,
//                 MockAppZoneMapComponent,
//                 MockAppZoneListComponent
//             ],
//             imports: [
//             ],
//             providers: [
//                 SpinnerService,
//                 {
//                     provide: ActivatedRoute, useValue: {
//                         queryParams: Observable.of({
//                             type: 'list',
//                             zoneId: 'zoneId'
//                         }),
//                         params: Observable.of({
//                         })
//                     }
//                 },
//                 {
//                     provide: Router, useValue: {
//                         navigate: jasmine.createSpy('navigate')
//                     }
//                 },
//                 { provide: HttpService, useClass: HttpServiceMockClass },
//                 { provide: MatSnackBar, useClass: MockSnackModalClass },
//                 { provide: AuthService, useClass: AuthServiceMockClass }
//             ]
//         })
//         .compileComponents()
//         .then(() => {
//             fixture = TestBed.createComponent(ZoneComponent);
//             component = fixture.componentInstance;
//         });
//     }));
//     it('#should init data via browser refresh', () => {
//         spyOn(component, 'getData');
//         component.ngOnInit();
//         expect(component.status).toEqual(1);
//         expect(component.strZoneKey).toEqual('zoneId');
//         expect(component.getData).toHaveBeenCalled();
//     });

//     describe('by getData function, ', () => {
//         it('#user data doesn\'t have enough, it is redirected to the login page', async(() => {
//             component.getData();
//             expect((component as any)._router.navigate).toHaveBeenCalledWith(['/login']);
//         }));

//         it('#else, portal should get the data from a cloud', async(() => {
//             const mockAuthService = fixture.debugElement.injector.get(AuthService) as AuthServiceMockClass;
//             mockAuthService.bIsStaff = true;
//             mockAuthService.objStaffUser = {
//                 info: {
//                     customerId: '-customerid'
//                 }
//             };
//             spyOn(component, 'checkLoad');
//             component.getData();
//             fixture.whenStable().then(() => {
//                 expect(component.bIsGettingZones).toBeTruthy();
//                 expect(component.checkLoad).toHaveBeenCalled();
//             });
//         }));
//     });

//     it('#should check the staus to load the data by checkLoad function', () => {
//         spyOn(component, 'makeZoneList');
//         spyOn(component, 'setMainHeight');
//         component.bIsGettingZones = true;
//         component.bIsGettingSensors = true;
//         component.zones = [];
//         component.checkLoad();
//         fixture.whenStable().then(() => {
//             expect(component.bIsLoading).toBeTruthy();
//             expect(component.makeZoneList).toHaveBeenCalled();
//         });
//     });

//     it('#should caculate the sensor total number and offline one by setZoneCount function', () => {
//         const zone = {
//             key: 'zone1',
//             name: 'zone1',
//             sensors: [
//                 {
//                     availability: 'off'
//                 }
//             ],
//             total: 0,
//             offTotal: 0
//         };
//         component.setZoneCount(zone);
//         expect(zone['offTotal']).toEqual(1);
//     });

//     it('#should go to the specific list view by getTabEven function', () => {
//         component.getTabEven(1);
//         expect((component as any)._router.navigate).toHaveBeenCalled();
//     });
// });

// class HttpServiceMockClass {
//     getAsList(strUrl: string, nTake: number = 0): Observable<any> {
//         return Observable.of([]);
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

// class MockSnackModalClass {
//     open(des: string, title: string, config: Object) {
//         return true;
//     }
// }

// @Component({
//     selector: 'app-zone-topbar',
//     template: '<p>Mock app-zone-topbar Component</p>'
// })
// class MockAppZoneTopbarComponent {
//     @Input() status: any;
//     @Output() getTabEven = new EventEmitter();
// }

// @Component({
//     selector: 'app-zone-map',
//     template: '<p>Mock app-zone-map Component</p>'
// })
// class MockAppZoneMapComponent {
//     @Input() customerId: any;
//     @Input() strSensorKey: any;
//     @Input() strZoneKey: any;
//     @Input() zoneObjects: any;
// }

// @Component({
//     selector: 'app-zone-list',
//     template: '<p>Mock app-zone-list Component</p>'
// })
// class MockAppZoneListComponent {
//     @Input() zones: any;
//     @Input() customerId: any;
//     @Input() strZoneKey: any;
//     @Input() strSensorKey: any;
//     @Output() loadPage = new EventEmitter();
// }
/**
 * update in 2018/4/13
 * */
