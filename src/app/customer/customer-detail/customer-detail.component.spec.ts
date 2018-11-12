import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatRadioModule,
  MatInputModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatDialogModule
} from '@angular/material';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  ColorPickerModule
} from 'ngx-color-picker';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment.dev';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { CustomerDetailComponent } from './customer-detail.component';

// describe('CustomerDetailComponent', () => {
//   let component: CustomerDetailComponent;
//   let fixture: ComponentFixture<CustomerDetailComponent>;
//   const NotificationMocks = {
//     createNotification: function(type: string, title: string, content: string) {
//       return true;
//     }
//   };

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ CustomerDetailComponent ],
//       imports: [
//         MatRadioModule,
//         MatFormFieldModule,
//         MatSelectModule,
//         MatCardModule,
//         FormsModule,
//         ReactiveFormsModule,
//         ColorPickerModule,
//         MatIconModule,
//         MatProgressSpinnerModule,
//         MatDialogModule
//       ],
//       providers: [
//         { provide: Location, useValue: { back: function() { return true; }} },
//         { provide: AuthService, useClass: AuthServiceMockClass },
//         {
//           provide: ActivatedRoute, useValue: {
//             params: Observable.of({ sensorKey: '-sensorKey' })
//           }
//         },
//         { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
//         { provide: HttpService, useClass: HttpServiceMock },
//         { provide: NotificationService, useValue: NotificationMocks }
//       ],
//     })
//     .compileComponents()
//     .then(() => {
//       fixture = TestBed.createComponent(CustomerDetailComponent);
//       component = fixture.componentInstance;
//     });
//   }));

//   it('#should get the customer data via refreshing browser', async(() => {
//     spyOn(component, 'checkUserRole');
//     const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//     spyOn(mockHttpService, 'getAsObject').and.callThrough();
//     mockHttpService.returnValue = {
//       '$value': 1
//     };
//     component.ngOnInit();
//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       expect(component.bIsPageLoading).toBeTruthy();
//       expect(component.bIsPortalLoading).toBeTruthy();
//       expect(component.checkUserRole).toHaveBeenCalled();
//     });
//   }));

//   it('#should check user role by checkUserRole function', async(() => {
//     const mockAuthService = fixture.debugElement.injector.get(AuthService) as AuthServiceMockClass;
//     mockAuthService.bIsStaff = true;
//     mockAuthService.objStaffUser = {
//       action: {
//         role: 'admin'
//       }
//     };
//     component.checkUserRole();
//     expect(component.bIsEditable).toBeTruthy();
//   }));

//   it('#should be ready for a edit by editValue function', async(() => {
//     const industry = 'industry';
//     component.currentCustomer = {
//       industry: industry
//     };
//     component.editValue(2);
//     expect(component.paramValue).toEqual(industry);
//   }));

//   it('#should update the specific field by update function', async(() => {
//     component.currentCustomer = { key: '-key' };
//     spyOn(component, 'clearEdit');
//     spyOn((component as any)._nofication, 'createNotification');
//     component.status = 2;
//     component.update();
//     fixture.whenStable().then(() => {
//       expect(component.clearEdit).toHaveBeenCalled();
//       expect((component as any)._nofication.createNotification).toHaveBeenCalled();
//     });
//   }));

//   it('#should update the specific customer portal data by updateCustomerPortal function', async(() => {
//     component.currentCustomer = { key: '-key' };
//     spyOn(component, 'updateCustomerPortalItem');
//     spyOn((component as any)._nofication, 'createNotification');
//     component.updateCustomerPortal(2);
//     fixture.whenStable().then(() => {
//       expect(component.updateCustomerPortalItem).toHaveBeenCalled();
//     });
//   }));

//   it('#should update the firebase database by updateCustomerPortalItem function', async(() => {
//     component.currentCustomer = { key: '-key' };
//     spyOn(component, 'clearEdit');
//     component.updateCustomerPortalItem({});
//     fixture.whenStable().then(() => {
//       expect(component.clearEdit).toHaveBeenCalled();
//     });
//   }));
// });

// class AuthServiceMockClass {
//   loadAPI: Subject<any>;
//   bIsStaff: boolean;
//   objStaffUser: any;
//   objCustomerUser: any;

//   constructor() {
//     this.loadAPI = new Subject();
//   }

//   setUserData(companyData: any) {
//     this.loadAPI.next({
//       status: 2
//     });
//   }

//   get userData(): Object {
//     const user = this.bIsStaff ? this.objStaffUser : this.objCustomerUser;
//     return user;
//   }

//   get isCheckUser() {
//     return true;
//   }

//   get isUserEmailLoggedIn() {
//     return true;
//   }

//   get isUserStaff() {
//     return this.bIsStaff;
//   }
// }

// class HttpServiceMock {
//   returnValue: any;

//   getAsObject(strUrl: string, nTake: number = 0): Observable<any> {
//     return Observable.of(this.returnValue);
//   }

//   updateAsObject(strUrl: string, value: any): Promise<any> {
//     return Promise.resolve();
//   }

//   getListByOrder(strUrl: string, strOrder: string, strEqual: string, nTake: number = 0): Observable<any> {
//     return Observable.of([
//     ]);
//   }
// }
/**
 * Wrote in 2018/3/28
 * Update in 2018/8/10
 */
