/* tslint:disable:no-unused-variable */
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import {
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {
  Component,
  Input,
  ViewContainerRef
} from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';
import { NotificationService } from '../../services/notification.service';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../components/spinner/spinner.service';

import { CustomerListComponent } from './customer-list.component';
import {
  MatCardModule,
  MatIconModule,
  MatDialog
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

// describe('CustomerListComponent', () => {
//   let component: CustomerListComponent;
//   let fixture: ComponentFixture<CustomerListComponent>;
//   const NotificationMocks = {
//     createNotification: function(type: string, title: string, content: string) {
//       return true;
//     }
//   };
//   const objMockModalData = {
//     result: Promise.resolve('agree')
//   };

//   beforeEach(async(() => {
//     const routerStub = {
//       navigate: jasmine.createSpy('navigate'),
//       routerState: {}
//     };

//     TestBed.configureTestingModule({
//       declarations: [
//         CustomerListComponent,
//         MockSensorDetailComponent,
//         RoutingComponent,
//         MockCustomerDetailComponent,
//         MockZoneDetailComponent,
//         AppDetailViewer
//       ],
//       providers: [
//         SpinnerService,
//         { provide: HttpService, useClass: HttpServiceMock },
//         { provide: NotificationService, useValue: NotificationMocks },
//         { provide: Router, useValue: routerStub },
//         { provide: MatDialog, useClass: MockDialogComponent },
//         { provide: AuthService, useClass: AuthServiceMockClass }
//       ],
//       imports: [
//         MatCardModule,
//         MatIconModule,
//         RouterTestingModule.withRoutes([
//           { path: 'customer_detail/:id', component: MockCustomerDetailComponent },
//           { path: 'zone_detail/:id', component: MockZoneDetailComponent },
//           { path: 'sensor/:id', component: MockSensorDetailComponent }
//         ]),
//       ]
//     })
//     .compileComponents()
//     .then(() => {
//       fixture = TestBed.createComponent(CustomerListComponent);
//       component = fixture.componentInstance;
//     });
//   }));

//   it('#should check the user role via refreshing browser', () => {
//     spyOn(component, 'checkUserRole');
//     component.ngOnInit();
//     expect(component.checkUserRole).toHaveBeenCalled();
//   });

//   it('#should the user role by checkUserRole function', () => {
//     component.checkUserRole();
//     expect(component.bIsEditable).toBeTruthy();
//   });

//   it('#should call preload function by changing the input values', () => {
//     spyOn(component, 'preLoad');
//     component.ngOnChanges();
//     expect(component.preLoad).toHaveBeenCalled();
//   });

//   it('#should go to the suitable page by preLoad function', () => {
//     spyOn(component, 'getIndexFromArray').and.callFake(function(type: string, key: string) {
//       return 1;
//     });
//     spyOn(component, 'gotoCustomer');
//     spyOn(component, 'gotoZone');
//     spyOn(component, 'gotoSensor');
//     component.preLoad();
//     expect(component.gotoCustomer).toHaveBeenCalled();
//     expect(component.gotoZone).toHaveBeenCalled();
//     expect(component.gotoSensor).toHaveBeenCalled();
//   });

//   it('#should check the key availability by getIndexFromArray function', () => {
//     component.customers = [{key: 'key'}];
//     const response = component.getIndexFromArray('customer', 'key');
//     expect(response).not.toEqual(-1);
//   });

//   it('#should go to the customer page by gotoCustomer function', () => {
//     spyOn(component, 'clearZone');
//     component.customers = [{key: 'key'}];
//     component.zones = [{customerId: 'key'}];
//     component.gotoCustomer(0);
//     expect(component.selectedCustomId).toEqual(0);
//     expect(component.clearZone).toHaveBeenCalled();
//     expect(component.focusZones.length).toEqual(1);
//   });

//   it('#delete the item by deleteAction function', () => {
//     component.customers = [{key: 'key'}];
//     const response = component.deleteAction('customer', 'key');
//     expect(response).toBeDefined();
//   });

//   it('#should delete the customer by deleteCustomer function', fakeAsync(() => {
//     spyOn(component, 'clearZone');
//     spyOn(component, 'deleteAction');
//     component.focusZones = [];
//     component.deleteCustomer('key');
//     tick();
//     expect(component.clearZone).toHaveBeenCalled();
//     expect(component.deleteAction).toHaveBeenCalled();
//   }));

//   it('#should deelte the zone by deleteZone function', fakeAsync(() => {
//     spyOn(component, 'clearSensor');
//     component.selectedZone = {sensors: []};
//     component.deleteZone('key');
//     tick();
//     expect(component.clearSensor).toHaveBeenCalled();
//   }));

//   it('#should deelte the sensor by deleteSensor function', fakeAsync(() => {
//     spyOn((component as any)._nofication, 'createNotification');
//     component.selectedZone = {sensors: []};
//     component.deleteSensor('key');
//     tick();
//     expect((component as any)._nofication.createNotification).toHaveBeenCalled();
//     expect(component.bIsSelectedSensor).toBeFalsy();
//   }));

//   it('#go to the create customer form by createCustomer function', () => {
//     component.createCustomer();
//     expect((component as any)._router.navigate).toHaveBeenCalledWith(['create/newCustomer']);
//   });

//   it('#go to the create zone form by createZone function', () => {
//     component.selectedCustom = { key: 'key' };
//     component.createZone();
//     expect((component as any)._router.navigate).toHaveBeenCalledWith( ['create/newZone'], {
//       queryParams: {
//         create: 'customer',
//         customerId: (component.selectedCustom as any).key
//       }
//     } );
//   });

//   it('#go to the sensor  zone form by createSensor function', () => {
//     component.selectedCustom = { key: 'custom-key' };
//     component.selectedZone = { key: 'zone-key' };
//     component.createSensor();
//     expect((component as any)._router.navigate).toHaveBeenCalledWith(['create/newSensor'], {
//       queryParams: {
//         create: 'customer',
//         customerId: (component.selectedCustom as any).key,
//         zoneId: (component.selectedZone as any).key
//       }
//     });
//   });
// });

// class AuthServiceMockClass {
//   get userData(): Object {
//     return {
//       action: {
//         role: global_variables['userRoles'][0]
//       }
//     };
//   }
// }

// class HttpServiceMock {
//   deleteAsObject(strUrl: string) {
//     return Promise.resolve(true);
//   }
// }

// @Component({
//   selector: 'app-sensor-detail',
//   template: '<p>sensor detail</p>'
// })
// class MockSensorDetailComponent {
//   @Input() selectedSensor: string;
//   @Input() sensorKey: string;
// }

// @Component({
//   selector: 'component-customer-detail',
//   template: '<p>customer detail</p>'
// })
// class MockCustomerDetailComponent {
// }

// @Component({
//   selector: 'component-zone-detail',
//   template: '<p>zone detail</p>'
// })
// class MockZoneDetailComponent {
// }

// @Component({
//   selector: 'app-detail-viewer',
//   template: ''
// })
// class AppDetailViewer {
//   @Input() strName: string;
//   @Input() strDescription: string;
// }

// @Component({
//   template: `
//     <router-outlet></router-outlet>
//   `
// })
// class RoutingComponent { }

// class MockDialogComponent {
//   open(component: any, config: any) {
//     return {
//       afterClosed: function() {
//         return Observable.of(true);
//       }
//     };
//   }
// }
/**
 * wrote 2018/4/2
 * update 2018/8/10
 */
