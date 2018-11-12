/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
    Router
} from '@angular/router';
import {
    MatDialog,
    MatSnackBar,
    MatListModule,
    MatFormFieldModule,
    MatIconModule
} from '@angular/material';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { SpinnerService } from '../../components/spinner/spinner.service';

import { SensorTypeDetailComponent } from './sensor-type-detail.component';
import * as _ from 'lodash';

// describe('SensorTypeDetailComponent', () => {
//     let component: SensorTypeDetailComponent;
//     let fixture: ComponentFixture<SensorTypeDetailComponent>;
//     const NotificationMocks = {
//         createNotification: function(type: string, title: string, content: string) {
//             return true;
//         }
//     };

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 SensorTypeDetailComponent,
//                 MockSensorTypeCategoryComponent
//             ],
//             providers: [
//                 SpinnerService,
//                 {
//                     provide: Router, useValue: {
//                         navigate: jasmine.createSpy('navigate')
//                     }
//                 },
//                 { provide: DataService, useClass: DataServiceMocks },
//                 { provide: HttpService, useClass: HttpServiceMock },
//                 { provide: MatDialog, useClass: MockDialogComponent },
//                 { provide: MatSnackBar, useClass: MockSnackModal },
//                 { provide: NotificationService, useValue: NotificationMocks },
//                 { provide: AuthService, useClass: AuthServiceMockClass }
//             ],
//             imports: [
//                 MatListModule,
//                 MatFormFieldModule,
//                 FormsModule,
//                 ReactiveFormsModule,
//                 MatIconModule
//             ]
//         })
//         .compileComponents()
//         .then(() => {
//             fixture = TestBed.createComponent(SensorTypeDetailComponent);
//             component = fixture.componentInstance;

//             const mockDataService = fixture.debugElement.injector.get(DataService) as DataServiceMocks;
//             spyOn(mockDataService, 'getString').and.callThrough();
//             mockDataService.returnValue = 'role';
//         });
//     }));

//     it('#should call initTypeForm and getUserData functions to create the form and get user data via browser refresh', () => {
//         spyOn(component, 'initTypeForm');
//         spyOn(component, 'getUserData');
//         component.ngOnInit();
//         expect(component.initTypeForm).toHaveBeenCalled();
//         expect(component.getUserData).toHaveBeenCalled();
//     });

//     it('#should create the form by initTypeForm function', () => {
//         component.initTypeForm('');
//         expect(component.stForm).toBeDefined();
//     });

//     it('#should get user role and type by getUserData function', () => {
//         const mockAuthService = fixture.debugElement.injector.get(AuthService) as AuthServiceMockClass;
//         mockAuthService.bIsStaff = true;
//         mockAuthService.objStaffUser = {
//             action: {
//                 role: 'admin'
//             }
//         };
//         component.getUserData();
//         expect(component.strUserRole).toEqual('admin');
//         expect(component.strUserType).toEqual(global_variables['userTypes'][0]);
//     });

//     it('#should get the sensor types and check by loadData function', () => {
//         spyOn(component, 'goTargetNavigation');
//         const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//         spyOn(mockHttpService, 'getAsList').and.callThrough();
//         mockHttpService.returnValue = [{ key: '-key'}];
//         component.loadData();
//         expect(component.isPageLoading).toBeTruthy();
//         expect(component.goTargetNavigation).toHaveBeenCalled();
//     });

//     it('#should select sensor type by selectSensorType function', () => {
//         spyOn(component, 'goTargetNavigation');
//         component.selectSensorType(0);
//         expect(component.goTargetNavigation).toHaveBeenCalledWith(0);
//     });

//     it('#should select sensor type by editSensorType function', () => {
//         spyOn(component, 'initTypeForm');
//         component.editSensorType({
//             typeName: 'sensortype1'
//         });
//         expect(component.initTypeForm).toHaveBeenCalled();
//     });

//     it('#should select sensor type by onDeleteSensorType function', () => {
//         const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//         spyOn(mockHttpService, 'getListByOrder').and.callThrough();
//         mockHttpService.returnValue = [];

//         spyOn(component, 'deleteSensorType');
//         component.onDeleteSensorType('-key');
//         fixture.whenStable().then(() => {
//             expect(component.deleteSensorType).toHaveBeenCalled();
//         });
//     });

//     it('#should delete sensor type by deleteSensorType function', () => {
//         spyOn(component, 'clearSensorTypeForm');
//         component.deleteSensorType('-typekey');
//         fixture.whenStable().then(() => {
//             expect(component.clearSensorTypeForm).toHaveBeenCalled();
//         });
//     });

//     it('#should clear sensor type form by clearSensorTypeForm function', () => {
//         component.clearSensorTypeForm();
//         expect(component.sensorTypeName).toBe('');
//         expect(component.isCreateSensorType).toBeFalsy();
//     });

//     it('#should submit the sensor type form data by submitSensorType function', () => {
//         spyOn(component, 'clearSensorTypeForm');
//         component.isCreateSensorType = true;
//         component.initTypeForm('');
//         component.stForm.controls['name'].setValue('name');
//         component.submitSensorType();
//         fixture.whenStable().then(() => {
//             expect(component.clearSensorTypeForm).toHaveBeenCalled();
//         });
//     });

//     it('#should go to the specific tab form by goTargetNavigation function', () => {
//         component.arrSensorTypes = [
//             {
//                 typeName: 'name',
//                 status: ''
//             }
//         ];
//         component.selectedSensorTypeId = 0;
//         component.goTargetNavigation(0);
//         expect(component.focusCategory).toBeDefined();
//     });

//     it('#should update the table type form by updateTableTypeEmit function', () => {
//         spyOn(component._snackBar, 'open');
//         component.arrSensorTypes = [
//             {
//                 key: '-key'
//             }
//         ];
//         component.updateTableTypeEmit('name');
//         fixture.whenStable().then(() => {
//             expect(component._snackBar.open).toHaveBeenCalled();
//         });
//     });

//     it('#should check the name field exist by checkExistedName function', () => {
//         const res = component.checkExistedName(
//             {
//                 name: 'name'
//             },
//             [
//                 {
//                     name: 'name'
//                 }
//             ]
//         );
//         expect(res).toBeTruthy();
//     });

//     it('#should create new row by createRowParamEmit function', () => {
//         spyOn(component._snackBar, 'open');
//         component.selectedSensorTypeId = 0;
//         component.type = 0;
//         component.arrSensorTypes = [
//             {
//                 status: {
//                     rows: []
//                 }
//             }
//         ];
//         component.createRowParamEmit('name');
//         fixture.whenStable().then(() => {
//             expect(component._snackBar.open).toHaveBeenCalled();
//         });
//     });

//     it('#should update the row parameter by updateRowParamEmit function', () => {
//         spyOn(component._snackBar, 'open');
//         component.selectedSensorTypeId = 0;
//         component.arrSensorTypes = [
//             {}
//         ];
//         component.updateRowParamEmit({
//             isDelete: false,
//             data: []
//         });
//         fixture.whenStable().then(() => {
//             expect(component._snackBar.open).toHaveBeenCalled();
//         });
//     });

//     it('#should create header parameter by createHeaderParamEmit function', () => {
//         spyOn(component._snackBar, 'open');
//         component.selectedSensorTypeId = 0;
//         component.type = 0;
//         component.arrSensorTypes = [
//             {
//                 status: {
//                     heads: []
//                 }
//             }
//         ];
//         component.updateRowParamEmit({
//             isDelete: false,
//             data: []
//         });
//         fixture.whenStable().then(() => {
//             expect(component._snackBar.open).toHaveBeenCalled();
//         });
//     });

//     it('#should update the header parameter by updateHeaderParamEmit function', () => {
//         spyOn(component._snackBar, 'open');
//         component.selectedSensorTypeId = 0;
//         component.arrSensorTypes = [
//             {
//                 key: '-key'
//             }
//         ];
//         component.updateHeaderParamEmit({
//             isDelete: false,
//             data: []
//         });
//         fixture.whenStable().then(() => {
//             expect(component._snackBar.open).toHaveBeenCalled();
//         });
//     });

//     it('#should go to the sensor type information page by gotoSensorTypeInfoEmit function', () => {
//         component.selectedSensorTypeId = 0;
//         component.arrSensorTypes = [
//             {
//                 key: '-key'
//             }
//         ];
//         component.gotoSensorTypeInfoEmit();
//         expect((component as any)._router.navigate).toHaveBeenCalled();
//     });
// });

// class DataServiceMocks {
//     returnValue: any;
//     getString(strName: string) {
//         return this.returnValue;
//     }
// }

// class HttpServiceMock {
//     returnValue: any;

//     getListByOrder(strUrl: string, strOrder: string, strEqual: string, nTake: number = 0): Observable<any> {
//         return Observable.of(this.returnValue);
//     }

//     getAsList(strUrl: string, nTake: number = 0): Observable<any> {
//         return Observable.of(this.returnValue);
//     }

//     deleteAsObject(strUrl: string): Promise<any>  {
//         return Promise.resolve(true);
//     }

//     createAsList(strUrl: string, value: any): Promise<any> {
//         return Promise.resolve(true);
//     }

//     updateAsObject(strUrl: string, objValue: any): Promise<any> {
//         return Promise.resolve(true);
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

// class MockDialogComponent {
//     open(component: any, config: any) {
//         return {
//             afterClosed: function() {
//                 return Observable.of(true);
//             }
//         };
//     }
// }

// class MockSnackModal {
//     open(des: string, title: string, config: Object) {
//         return true;
//     }
// }

// @Component({
//     selector: 'app-sensor-type-category',
//     template: '<p>sensor type category component</p>'
// })
// class MockSensorTypeCategoryComponent {
//     @Input() sensorType: any;
//     @Input() categoryType: any;
//     @Input() isCreatable: any;
//     @Input() sensorTypeName: any;
//     @Input() selectedSensorTypeKey: any;
//     @Output() updateTableTypeEmit = new EventEmitter();
//     @Output() createRowParamEmit = new EventEmitter();
//     @Output() createHeaderParamEmit = new EventEmitter();
//     @Output() updateRowParamEmit = new EventEmitter();
//     @Output() updateHeaderParamEmit = new EventEmitter();
//     @Output() gotoSensorTypeInfoEmit = new EventEmitter();
// }
/**
 * wrote in 2018/4/11
 * */
