/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import {
    Router
} from '@angular/router';
import {
    MatDialog,
    MatSnackBar,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule
} from '@angular/material';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { environment }           from '../../../environments/environment.dev';
import { HttpService }           from '../../services/http.service';
import { NotificationService }   from '../../services/notification.service';
import { SpinnerService }        from '../../components/spinner/spinner.service';

import { SensorTypeCategoryComponent } from './sensor-type-category.component';
import * as _ from 'lodash';

// describe('SensorTypeCategoryComponent', () => {
//     let component: SensorTypeCategoryComponent;
//     let fixture: ComponentFixture<SensorTypeCategoryComponent>;
//     let NotificationMocks = {
//         createNotification: function(type: string, title: string, content: string) {
//             return true;
//         }
//     };

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 SensorTypeCategoryComponent
//             ],
//             providers: [
//                 SpinnerService,
//                 {
//                     provide: Router, useValue: {
//                         navigate: jasmine.createSpy('navigate')
//                     }
//                 },
//                 { provide: HttpService, useClass: HttpServiceMock },
//                 { provide: MatDialog, useClass: MockDialogComponent },
//                 { provide: MatSnackBar, useClass: MockSnackModal },
//                 { provide: NotificationService, useValue: NotificationMocks }
//             ],
//             imports: [
//                 MatListModule,
//                 MatFormFieldModule,
//                 FormsModule,
//                 ReactiveFormsModule,
//                 MatSelectModule,
//                 MatIconModule,
//                 MatRadioModule
//             ]
//         })
//         .compileComponents()
//         .then(() => {
//             fixture = TestBed.createComponent(SensorTypeCategoryComponent);
//             component = fixture.componentInstance;
//         });
//     }));

//     it('#should init form and check the sensor type form via browser refresh', () => {
//         spyOn(component, 'checkTypeStatus');
//         spyOn(component, 'initModel');
//         spyOn(component, 'initFormGroup');
//         component.ngOnInit();
//         expect(component.checkTypeStatus).toHaveBeenCalled();
//         expect(component.initModel).toHaveBeenCalled();
//         expect(component.initFormGroup).toHaveBeenCalled();
//     });

//     it('#should define the forms form by initFormGroup function', () => {
//         component.headerModel = {};
//         component.rowModel = {};
//         component.initFormGroup();
//         expect(component.headerForm).toBeDefined();
//         expect(component.rowForm).toBeDefined();
//     });

//     it('#should define the models by initModel function', () => {
//         component.initModel();
//         expect(component.headerModel).toBeDefined();
//         expect(component.rowModel).toBeDefined();
//     });

//     it('#should check type status by checkTypeStatus function', () => {
//         spyOn(component, 'initModel');
//         spyOn(component, 'initFormGroup');
//         spyOn(component, 'clearShowForm');
//         spyOn(component, 'getSensors');
//         component.checkTypeStatus();
//         expect(component.initModel).toHaveBeenCalled();
//         expect(component.initFormGroup).toHaveBeenCalled();
//         expect(component.clearShowForm).toHaveBeenCalled();
//         expect(component.getSensors).toHaveBeenCalled();
//     });

//     it('#should get sensors by getSensors function', () => {
//         let mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//         spyOn(mockHttpService, 'getListByOrder').and.callThrough();
//         mockHttpService.returnValue = [{}];
//         component.getSensors();
//         expect(component.relevantSensors).toBeDefined();
//     });

//     it('#should confirm to delete the sensors by confirmSensorModal function', () => {
//         component.relevantSensors = [{}];
//         component.confirmSensorModal();
//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect((component as any)._router.navigate).toHaveBeenCalledWith(['/customer']);
//         });
//     });

//     it('#should show header parameter create form by showHeaderParam function', () => {
//         spyOn(component, 'initModel');
//         spyOn(component, 'initFormGroup');
//         spyOn(component, 'clearShowForm');
//         component.showHeaderParam();
//         expect(component.initFormGroup).toHaveBeenCalled();
//         expect(component.isCreateNewHeader).toBeTruthy();
//     });

//     it('#should get the header parameters edited by editHeaderParams function', () => {
//         spyOn(component, 'showHeaderParam');
//         spyOn(component, 'initFormGroup');
//         component.sensorType = {
//             heads: [
//                 {
//                     name: 'name',
//                     id: 'id'
//                 }
//             ]
//         };
//         component.editHeaderParams(0);
//         expect(component.showHeaderParam).toHaveBeenCalled();
//         expect(component.isCreateStatus).toBeFalsy();
//     });

//     it('#should get the header parameters edited by submitHeaderParam function', () => {
//         component.sensorType = {};
//         spyOn(component.createHeaderParamEmit, 'emit');
//         component.initFormGroup();
//         component.headerForm.controls['name'].setValue('new customer');
//         component.isCreateStatus = true;
//         component.submitHeaderParam();
//         expect(component.createHeaderParamEmit.emit).toHaveBeenCalled();
//     });

//     it('#should show row parameter create form by showRowParam function', () => {
//         spyOn(component, 'initModel');
//         spyOn(component, 'initFormGroup');
//         spyOn(component, 'clearShowForm');
//         component.showRowParam();
//         expect(component.initFormGroup).toHaveBeenCalled();
//         expect(component.isCreateNewRow).toBeTruthy();
//     });

//     it('#should get the row parameters edited by editRowParams function', () => {
//         spyOn(component, 'showRowParam');
//         spyOn(component, 'initFormGroup');
//         component.sensorType = {
//             rows: [
//                 {
//                     name: 'name',
//                     id: 'id'
//                 }
//             ]
//         };
//         component.editRowParams(0);
//         expect(component.initFormGroup).toHaveBeenCalled();
//     });

//     it('#should get the row parameters edited by submitRowParam function', () => {
//         component.sensorType = {};
//         spyOn(component.createRowParamEmit, 'emit');
//         component.initFormGroup();
//         component.rowForm.controls['name'].setValue('new customer');
//         component.rowForm.controls['unit'].setValue('new unit');
//         component.rowForm.controls['type'].setValue('new type');
//         component.isCreateStatus = true;
//         component.submitRowParam();
//         expect(component.createRowParamEmit.emit).toHaveBeenCalled();
//     });

//     it('#should select row sensor type parameter by selectRowSensorType function', () => {
//         component.selectRowSensorType(1);
//         expect(component.nSelectedHeadParamId).toBe(-1);
//         expect(component.nSelectedRowParamId).toBe(1);
//     });

//     it('#should select header sensor type parameter by selectHeadSensorType function', () => {
//         component.selectHeadSensorType(1);
//         expect(component.nSelectedHeadParamId).toBe(1);
//         expect(component.nSelectedRowParamId).toBe(-1);
//     });
// });
/** wrote in 2018/4/11 */

class HttpServiceMock {
    returnValue: any;

    getListByOrder(strUrl: string, strOrder: string, strEqual: string, nTake: number = 0):Observable<any> {
        return Observable.of(this.returnValue);
    }

    getAsList(strUrl: string, nTake: number = 0):Observable<any> {
        return Observable.of(this.returnValue);
    }

    deleteAsObject(strUrl: string):Promise<any>  {
        return Promise.resolve(true);
    }

    createAsList(strUrl: string, value: any):Promise<any> {
        return Promise.resolve(true);
    }

    updateAsObject(strUrl: string, objValue: any):Promise<any> {
        return Promise.resolve(true);
    }
}

class MockDialogComponent {
    open(component: any, config: any) {
        return {
            afterClosed: function() {
                return Observable.of(true);
            }
        };
    }
}

class MockSnackModal {
    open(des: string, title: string, config: Object) {
        return true;
    }
}

