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
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../environments/environment.dev';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';
import { SpinnerService } from '../components/spinner/spinner.service';

import { CustomerComponent } from './customer.component';

// describe('CustomerComponent', () => {
//     let component: CustomerComponent;
//     let fixture: ComponentFixture<CustomerComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 CustomerComponent,
//                 MockAppCustomerTopbarComponent,
//                 MockAppCustomerMapComponent,
//                 MockAppCustomerListComponent
//             ],
//             imports: [
//             ],
//             providers: [
//                 SpinnerService,
//                 {
//                     provide: ActivatedRoute, useValue: {
//                         queryParams: Observable.of({
//                             type: 'list',
//                             customerId: 'customerKey'
//                         })
//                     }
//                 },
//                 {
//                     provide: Router, useValue: {
//                         navigate: jasmine.createSpy('navigate')
//                     }
//                 },
//                 { provide: HttpService, useClass: HttpServiceMock },
//                 { provide: AuthService, useClass: AuthServiceMockClass }
//             ]
//         })
//         .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(CustomerComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('#should get params and data needed via browser refresh', () => {
//         component.ngOnInit();
//         expect(component.status).toEqual(1);
//         expect(component.strCustomerKey).toEqual('customerKey');
//     });

//     it('#should get params by getParams function', () => {
//         component.getParams({
//             type: 'list',
//             customerId: 'customerid',
//             zoneId: 'zoneid',
//             sensorId: 'sensorid'
//         });
//         expect(component.status).toEqual(1);
//         expect(component.strCustomerKey).toEqual('customerid');
//         expect(component.strZoneKey).toEqual('zoneid');
//         expect(component.strSensorKey).toEqual('sensorid');
//     });

//     it('#should get the data from firebase by getData function', () => {
//         spyOn(component, 'checkLoad');
//         component.getData();
//         fixture.whenStable().then(() => {
//             expect(component.bIsGettingCustomers).toBeTruthy();
//             expect(component.bIsGettingZones).toBeTruthy();
//             expect(component.bIsGettingSensors).toBeTruthy();
//             expect(component.checkLoad).toHaveBeenCalled();
//         });
//     });

//     it('#should check the staus to load the data by checkLoad function', () => {
//         spyOn(component, 'initZones');
//         spyOn(component, 'setMainHeight');
//         component.bIsGettingCustomers = true;
//         component.bIsGettingZones = true;
//         component.bIsGettingSensors = true;
//         component.checkLoad();
//         fixture.whenStable().then(() => {
//             expect(component.bIsLoading).toBeTruthy();
//             expect(component.initZones).toHaveBeenCalled();
//         });
//     });

//     it('#should split the sensors to their zone by putToZone function', () => {
//         component.zones = [{
//             key: 'zone1',
//             name: 'zone1',
//             sensors: []
//         }]
//         component.putToZone({ zoneId: 'zone1' });
//         expect(component.zones[0]['sensors'].length).toEqual(1);
//     });

//     it('#should go to the specific list view by getTabEven function', () => {
//         component.getTabEven(1);
//         expect((component as any)._router.navigate).toHaveBeenCalled();
//     });
// });

// class HttpServiceMock {
//     getAsList(strUrl: string, nTake: number = 0):Observable<any> {
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
//       let user = this.bIsStaff?this.objStaffUser:this.objCustomerUser;
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

// @Component({
//     selector: 'app-customer-topbar',
//     template: '<p>Mock app-customer-topbar Component</p>'
// })
// class MockAppCustomerTopbarComponent {
//     @Input() status: any;
//     @Output() getTabEven = new EventEmitter();
// }

// @Component({
//     selector: 'app-customer-map',
//     template: '<p>Mock app-customer-map Component</p>'
// })
// class MockAppCustomerMapComponent {
//     @Input() customers: any;
//     @Input() zones: any;
//     @Input() strCustomerKey: any;
//     @Input() strZoneKey: any;
//     @Input() strSensorKey: any;
//     @Input() nIsBorder: any;
// }

// @Component({
//     selector: 'app-customer-list',
//     template: '<p>Mock app-customer-list Component</p>'
// })
// class MockAppCustomerListComponent {
//     @Input() windowH: any;
//     @Input() customers: any;
//     @Input() zones: any;
//     @Input() strCustomerKey: any;
//     @Input() strZoneKey: any;
//     @Input() strSensorKey: any;
// }
/**
 * wrote in 2018/4/2
 * update in 2018/4/19
 */
