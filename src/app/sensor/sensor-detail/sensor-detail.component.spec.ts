/* tslint:disable:no-unused-variable */
import {
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef
} from '@angular/core';
import {
    async,
    ComponentFixture,
    TestBed,
    tick,
    fakeAsync
} from '@angular/core/testing';
import {
    Router,
    ActivatedRoute
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {
    MatDialog,
    MatSnackBar,
    MatDialogModule
} from '@angular/material';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { MockMatModule } from '../../core/spec/mock-mat/mock-mat.module';
import { Location } from '@angular/common';
import { global_variables } from '../../../environments/global_variables';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';
import { SpinnerService } from '../../components/spinner/spinner.service';
import { PurehttpService } from '../../services/purehttp.service';
import { AuthService } from '../../services/auth.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {
    AgmCoreModule
} from '@agm/core';
declare let google: any;

import { SensorDetailComponent } from './sensor-detail.component';
import { AnalyticDataFilterPipe } from '../../filters/analytic-data-filter.pipe';

// describe('SensorDetailComponent', () => {
//     let component: SensorDetailComponent;
//     let fixture: ComponentFixture<SensorDetailComponent>;
//     const NotificationMocks = {
//         createNotification: function(type: string, title: string, content: string) {
//             return true;
//         }
//     };

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 SensorDetailComponent,
//                 MockPlotlyComponent,
//                 MockCommentComponent,
//                 MockInputComponent,
//                 MockNetworkComponent,
//                 AnalyticDataFilterPipe
//             ],
//             imports: [
//                 MockMatModule,
//                 FormsModule,
//                 ReactiveFormsModule,
//                 MatDialogModule,
//                 AgmCoreModule.forRoot({
//                     apiKey: 'AIzaSyBGH1Lmb_8OPJnadWq39AUglhyULkY8HZU'
//                 })
//             ],
//             providers: [
//                 DataService,
//                 SpinnerService,
//                 MatIconRegistry,
//                 { provide: DomSanitizer, useClass: DomSanitizerMockClass },
//                 { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
//                 { provide: HttpService, useClass: HttpServiceMock },
//                 { provide: Location, useClass: MockLocation },
//                 { provide: MatDialog, useClass: MockDialogComponent },
//                 { provide: MatSnackBar, useClass: MockSnackModal },
//                 {
//                     provide: ActivatedRoute, useValue: {
//                         queryParams: Observable.of({
//                             type: 'edit'
//                         })
//                     }
//                 },
//                 { provide: NotificationService, useValue: NotificationMocks },
//                 { provide: AuthService, useClass: AuthServiceMockClass },
//                 { provide: PurehttpService, useClass: PureHttpServiceMock }
//             ]
//         })
//         .compileComponents()
//         .then(() => {
//             fixture = TestBed.createComponent(SensorDetailComponent);
//             component = fixture.componentInstance;
//             jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
//         });
//     }));

//     describe('by refreshing browser, ', () => {
//         it('#should navigate to the dashboard if there is no sensor key or sensor', async(() => {
//             spyOn(component._snackBar, 'open');
//             component.ngOnInit();
//             expect(component._snackBar.open).toHaveBeenCalled();
//             expect((component as any)._router.navigate).toHaveBeenCalled();
//         }));

//         it('#should call initData function to initialize the variables and get data from cloud', async(() => {
//             component.sensorKey = '-sensorkey';
//             component.selectedSensor = '-sensor1';
//             spyOn(component, 'initData');
//             component.ngOnInit();
//             expect(component.initData).toHaveBeenCalled();
//         }));
//     });

//     describe('by initData function, ', () => {
//         it('#if there is no user role, it should be redirected to the login page', async(() => {
//             const mockAuthService = fixture.debugElement.injector.get(AuthService) as AuthServiceMockClass;
//             mockAuthService.bIsStaff = true;
//             component.initData();
//             expect((component as any)._router.navigate).toHaveBeenCalledWith(['/login']);
//         }));

//         it('#should initialize the variables with data from cloud', async(() => {
//             const mockAuthService = fixture.debugElement.injector.get(AuthService) as AuthServiceMockClass;
//             mockAuthService.bIsStaff = true;
//             mockAuthService.objStaffUser = {
//                 action: {
//                     role: 'admin'
//                 }
//             };
//             spyOn(component, 'loadGeoCoder');
//             spyOn(component, 'checkUserType');
//             spyOn((component as any)._httpService, 'updateAsObject').and.callFake(() => {
//                 return Promise.resolve();
//             });
//             const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//             spyOn(mockHttpService, 'getAsObject').and.callThrough();
//             mockHttpService.returnValue = {
//                 '$value': 1,
//                 'isInRealTime': true
//             };
//             component.sensorKey = 'sensorkey';
//             component.selectedSensor = {
//                 sensorTypeId: 'sensortypeid'
//             };
//             component.initData();
//             expect(component.loadGeoCoder).toHaveBeenCalled();
//             expect(component.checkUserType).toHaveBeenCalled();
//             expect((component as any)._httpService.updateAsObject).toHaveBeenCalled();
//         }));
//     });

//     it('#should return the signal strength calculated by calculateSingalStrength function', () => {
//         const result = component.calculateSingalStrength(72);
//         expect(result).toEqual(4);
//     });

//     describe('by controlSensorDevice function, ', () => {
//         it('If user don\'t have right permission, he can\'t handle', async(() => {
//             spyOn((component as any)._nofication, 'createNotification');
//             component.strUserRole = global_variables['userRoles'][3];
//             component.controlSensorDevice(1);
//             expect((component as any)._nofication.createNotification).toHaveBeenCalled();
//         }));

//         it('else he will handle the sensor status', async(() => {
//             spyOn(component, 'updateSensorDevice');
//             component.controlSensorDevice(1);

//             fixture.detectChanges();
//             fixture.whenStable().then(() => {
//                 expect(component.updateSensorDevice).toHaveBeenCalled();
//             });
//         }));
//     });

//     it('#should update the sensor detail page on changing the sensor data', async(() => {
//         spyOn(component, 'getSensorParamData');
//         spyOn(component, 'getRawData');
//         spyOn(component, 'getProcessedData');
//         spyOn(component, 'changeStatus');
//         spyOn(component, 'getAnalyticalData');
//         spyOn(component, 'buildProgressBar');
//         component.sensorKey = '-sfd';
//         component.selectedSensor = {
//             sensorTypeId: '9sfe'
//         };
//         component.nActionNumber = -1;
//         const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//         spyOn(mockHttpService, 'getAsObject').and.callThrough();
//         mockHttpService.returnValue = {
//             typeName: 'sensortype1'
//         };

//         component.ngOnChanges();
//         expect(component.getAnalyticalData).toHaveBeenCalled();
//         expect(component.isGetConfig).toBeTruthy();
//     }));

//     it('#should format the number to byets by formatBytes function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         const result = component.formatBytes(1024);
//         expect(result).toContain('KB');
//     }));

//     it('#should load the data for one cycle by onLoadOneCycleData function', async(() => {
//         spyOn(component, 'onLoadAnalyticalData');
//         spyOn(component, 'onLoadProcessedData');
//         component.arrObjAnalyticList = [{cycleIndex: '-32sdf'}];

//         component.onLoadOneCycleData({cycleIndex: '-32sdf'}, 1);
//         expect(component.onLoadAnalyticalData).toHaveBeenCalled();
//         expect(component.onLoadProcessedData).toHaveBeenCalled();
//     }));

//     it('#should load the analytical data and set the related variables by onLoadAnalyticalData function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'convertToDate');
//         spyOn(component, 'getAnalyticalFileData');
//         component.onLoadAnalyticalData({
//             key: '-sfae',
//             cycleIndex: '-wefe',
//             url: 'http://url.com',
//             date: '2018-1-22',
//             input: 'sfd'
//         });
//         expect(component.convertToDate).toHaveBeenCalled();
//         expect(component.getAnalyticalFileData).toHaveBeenCalled();
//         expect(component.strSelectedAnalyticKey).not.toBeNull();
//     }));

//     it('#should load the processed data and set the related variables by onLoadProcessedData function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'loadProcessedData');
//         spyOn(component, 'convertToDate');
//         component.onLoadProcessedData({
//             cycleIndex: '-wefe'
//         });
//         expect(component.loadProcessedData).toHaveBeenCalled();
//     }));

//     it('#should load the row data and set the related variables by onLoadRawData function', async(() => {
//         spyOn(component, 'getRawData');
//         component.onLoadRawData({
//             key: '-sfae',
//             cycleIndex: '-wefe',
//             url: 'http://url.com',
//             date: '2018-1-22',
//             startTimestamp: '2018-1-22'
//         });
//         expect(component.getRawData).toHaveBeenCalled();
//     }));

//     it('#should get the analytical file and set them to the variable by getAnalyticalFileData function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         const mockPureHttpService = fixture.debugElement.injector.get(PurehttpService) as PureHttpServiceMock;
//         spyOn(mockPureHttpService, 'callFirebaseFunction').and.callThrough();
//         mockPureHttpService.returnValue = {
//             data: {}
//         };
//         component.getAnalyticalFileData('-sfe');
//         expect(component.bIsParseAnalyticData).toBeTruthy();
//         expect(component.analyticalData).not.toBeNull();
//     }));

//     it('#should get the csv file and set them to the variables by getRawData function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         const mockPureHttpService = fixture.debugElement.injector.get(PurehttpService) as PureHttpServiceMock;
//         spyOn(mockPureHttpService, 'callFirebaseFunction').and.callThrough();
//         mockPureHttpService.returnValue = {
//             data: {}
//         };
//         spyOn(component, 'checkChartElements');
//         component.getRawData('-sfe');
//         expect(component.bIsLoadRawData).toBeTruthy();
//         expect(component.checkChartElements);
//     }));

//     it('#should get the analytical data and set them to the analytical view by getAnalyticalData function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'formatBytes');
//         spyOn(component, 'convertToDate');
//         spyOn(component, 'visitAnalyticData');
//         spyOn(component, 'onLoadAnalyticalData');
//         spyOn(component, 'initAnalyticalDataTable');
//         const mockPureHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//         spyOn(mockPureHttpService, 'getAsList').and.callThrough();
//         mockPureHttpService.returnValue = [{
//             storagePath: 'http://csv.com/url',
//             storageUrl: 'http://csv.com/url',
//             timestamp: 32432,
//             key: '-ewf0ew9',
//             fileSize: 12,
//             startTimestamp: 324,
//             stepType: 'header_type',
//             isReaded: false,
//             comment: '',
//             input: ''
//         }];
//         component.bIsReadAnalytic = true;
//         component.getAnalyticalData();
//         expect(component.onLoadAnalyticalData).toHaveBeenCalled();
//         expect(component.initAnalyticalDataTable).toHaveBeenCalled();
//     }));

//     it('#should get the raw data and set them to the raw view by getAllRawData function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'formatBytes');
//         spyOn(component, 'convertToDate');
//         spyOn(component, 'visitRawData');
//         spyOn(component, 'onLoadRawData');
//         spyOn(component, 'initRawDataTable');
//         const mockPureHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//         spyOn(mockPureHttpService, 'getAsList').and.callThrough();
//         mockPureHttpService.returnValue = [{
//             storagePath: 'http://csv.com/url',
//             storageUrl: 'http://csv.com/url',
//             timestamp: 32432,
//             key: '-ewf0ew9',
//             fileSize: 12,
//             startTimestamp: 324,
//             stepType: 'header_type',
//             isReaded: false,
//             comment: '',
//             input: ''
//         }];
//         component.bIsReadRaw = true;
//         component.getAllRawData();
//         expect(component.onLoadRawData).toHaveBeenCalled();
//         expect(component.initRawDataTable).toHaveBeenCalled();
//         expect(component.bIsGetAllRawData).toBeTruthy();
//     }));

//     it('#should get the processed data and set them to the processed view by getProcessedData function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'formatBytes');
//         spyOn(component, 'convertToDate');
//         spyOn(component, 'visitProcessedData');
//         spyOn(component, 'onLoadProcessedData');
//         spyOn(component, 'initProcessedDataTable');
//         const mockPureHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//         spyOn(mockPureHttpService, 'getAsList').and.callThrough();
//         mockPureHttpService.returnValue = [{
//             startTimeStamp: 324,
//             stepType: 'header_type',
//             isReaded: false,
//             comment: '',
//             Chromatogram: {
//                 storagePath: 'http://csv.com/url',
//                 storageUrl: 'http://csv.com/url',
//                 timestamp: 32432,
//                 key: '-ewf0ew9',
//                 fileSize: 12
//             },
//             DetectedPeaks: {
//                 storagePath: 'http://csv.com/url',
//                 storageUrl: 'http://csv.com/url',
//                 timestamp: 32432,
//                 key: '-ewf0ew9',
//                 fileSize: 12
//             }
//         }];
//         component.bIsReadProcess = true;
//         component.getProcessedData();
//         expect(component.onLoadProcessedData).toHaveBeenCalled();
//         expect(component.initProcessedDataTable).toHaveBeenCalled();
//         expect(component.bIsReadProcess).toBeTruthy();
//     }));

//     it('#should load processed data for Chromatogram or DetectedPeaks by loadProcessedData function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'parseChromatogram');
//         const processedKey = '-processedKey';
//         component.loadProcessedData({
//             key: processedKey,
//             data: [
//                 {
//                     type: global_variables['ProcessedDataTypes'][0]
//                 }
//             ]
//         });
//         expect(component.strSelectedProcessKey).toBeDefined(processedKey);
//         expect(component.parseChromatogram).toHaveBeenCalled();
//     }));

//     it('#should get the step time from config data by getStepTime function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         const time = component.getStepTime(1, 10, {
//             Mode_Config: {
//                 Step1_Config: {
//                     stepAction: global_variables['stepActions'][0],
//                     Total_Run_Time: 200
//                 }
//             }
//         });
//         expect(time).toBe(210);
//     }));

//     it('#should calculate the values and display the progress bar from config data by buildProgressBar function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'getStepTime').and.callFake((nStep: number, nWaitTime: number, configData: any) => {
//             return 10;
//         });

//         component.configData = {
//             'Current_Type' : 'Frac_Delta',
//             'Frac_Delta' : {
//                 'Mode_Config' : {
//                     'Step1_Config' : {
//                         'Amp_Enable' : false,
//                         'Board_Temp_Control' : 0,
//                         'Column1' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Column2' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Column3' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Fan_Control' : 1,
//                         'Injector' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'KP1' : {
//                             't1' : 120,
//                             't2' : 3,
//                             't3' : 180,
//                             'tIdle' : 0,
//                             'tTarget' : -25
//                         },
//                         'KP3' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'PCF' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Save_Data' : false,
//                         'Step_Type' : 'Forward Purge',
//                         'Target_Board_Temp' : 0,
//                         'Total_Run_Time' : 360,
//                         'stepAction' : 'Measurement Run'
//                     },
//                     'Step2_Config' : {
//                         'Amp_Enable' : false,
//                         'Board_Temp_Control' : 0,
//                         'Column1' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Column2' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Column3' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Fan_Control' : 1,
//                         'Injector' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'KP1' : {
//                             't1' : 10,
//                             't2' : 5,
//                             't3' : 60,
//                             'tIdle' : 1,
//                             'tTarget' : 20
//                         },
//                         'KP3' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'PCF' : {
//                             't1' : 12,
//                             't2' : 3,
//                             't3' : 17,
//                             'tIdle' : 0,
//                             'tTarget' : 220
//                         },
//                         'Save_Data' : false,
//                         'Step_Type' : 'Backward Purge',
//                         'Target_Board_Temp' : 0,
//                         'Total_Run_Time' : 180,
//                         'stepAction' : 'Measurement Run'
//                     },
//                     'Step3_Config' : {
//                         'Amp_Enable' : false,
//                         'Board_Temp_Control' : 1,
//                         'Column1' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Column2' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Column3' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Fan_Control' : 1,
//                             'Injector' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'KP1' : {
//                             't1' : 10,
//                             't2' : 5,
//                             't3' : 3600,
//                             'tIdle' : 1,
//                             'tTarget' : 20
//                         },
//                         'KP3' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'PCF' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Save_Data' : false,
//                         'Step_Type' : 'Sampling',
//                         'Target_Board_Temp' : 0,
//                         'Total_Run_Time' : 3800,
//                         'stepAction' : 'Measurement Run'
//                     },
//                     'Step4_Config' : {
//                         'Amp_Enable' : true,
//                         'Board_Temp_Control' : 0,
//                         'Column1' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Column2' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Column3' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Fan_Control' : 1,
//                         'Injector' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'KP1' : {
//                             't1' : 12,
//                             't2' : 3,
//                             't3' : 250,
//                             'tIdle' : 0,
//                             'tTarget' : -25
//                         },
//                         'KP3' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'PCF' : {
//                             't1' : 12,
//                             't2' : 3,
//                             't3' : 7,
//                             'tIdle' : 0,
//                             'tTarget' : 200
//                         },
//                         'Save_Data' : true,
//                         'Step_Type' : 'Separation',
//                         'Target_Board_Temp' : 0,
//                         'Total_Run_Time' : 300,
//                         'stepAction' : 'Measurement Run'
//                     },
//                     'Step5_Config' : {
//                         'stepAction' : 'Data Upload',
//                         'uploads' : [ {
//                             'step' : 4
//                         } ]
//                     },
//                     'Step6_Config' : {
//                         'Amp_Enable' : false,
//                         'Board_Temp_Control' : 0,
//                         'Column1' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Column2' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Column3' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Fan_Control' : 1,
//                         'Injector' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'KP1' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'KP3' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'PCF' : {
//                             't1' : 1,
//                             't2' : 1,
//                             't3' : 1,
//                             'tIdle' : 0,
//                             'tTarget' : 0
//                         },
//                         'Save_Data' : false,
//                         'Step_Type' : 'Idle',
//                         'Target_Board_Temp' : 0,
//                         'Total_Run_Time' : 120,
//                         'stepAction' : 'Measurement Run'
//                     }
//                 },
//                 'Mode_Type' : 'Frac_Delta',
//                 'Num_of_Cycle' : 2,
//                 'Num_of_Step' : 6
//             },
//             'isFinished' : false,
//             'runNumber' : 1,
//             'stepNumber' : 4,
//             'updateNumber' : 144,
//             'updateTime' : 30,
//             'waitTime' : 1
//         };
//         component.buildProgressBar();
//         expect(component['runProgress']['runNumber']).toEqual(1);
//         expect(component.nRunPercent).toBeGreaterThanOrEqual(0);
//         expect(component.nRunRemainTime).toBeGreaterThanOrEqual(0);
//         expect(component.nRunTotalTime).toBeGreaterThanOrEqual(component.nRunRemainTime);
//         expect(component['runProgress']['stepNumber']).toEqual(4);
//         expect(component.nStepPercent).toBeGreaterThanOrEqual(0);
//         expect(component.nStepRemainTime).toBeGreaterThanOrEqual(0);
//         expect(component.nStepTotalTime).toBeGreaterThanOrEqual(component.nStepRemainTime);
//     }));

//     it('#should format the date by formatDate function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         const formatedString = component.formatDate('3');
//         expect(formatedString).toContain('0');
//     }));

//     it('#should convert timestamp to Date by convertToDate function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         const date = component.convertToDate(1512279934035);
//         expect(date).not.toBe('N/A');
//     }));

//     it('#should check the chart element and build the chart by checkChartElements function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'buildCdcChart');
//         component.cdcTabElement = '<div></div>';
//         component.chartBodyElement = new ElementRef('<div></div>');
//         component.checkChartElements(0);
//         expect(component.buildCdcChart).toHaveBeenCalled();
//     }));

//     it('#should build the Templature chart by buildAdcChart function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         component.buildAdcChart([], [], [], [], [], [], [], [], [], []);
//         expect(component.plotlyADCData.length).not.toBe(0);
//         expect(component.isAdcCalled).toBeTruthy();
//     }));

//     it('#should build the Capacitance chart by buildCdcChart function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         component.buildCdcChart([], [], []);
//         expect(component.plotlyCDCData.length).not.toBe(0);
//         expect(component.isCdcCalled).toBeTruthy();
//     }));

//     it('#should build the Flow rate chart by buildFlowChart function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         component.buildFlowChart([], [], [], []);
//         expect(component.plotlyFlowData.length).not.toBe(0);
//         expect(component.isFlowCalled).toBeTruthy();
//     }));

//     it('#should build the Flow rate chart by getSensorParamData function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         component.arrParams = [{}];
//         component.sensorType = <any>{};
//         component.selectedSensor = {
//             key: '-key'
//         };
//         component.sensorType[global_variables['Categories'][0]] = {
//             tableType: global_variables['tableTypes'][0]
//         };

//         const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//         spyOn(mockHttpService, 'getAsObject').and.callThrough();
//         mockHttpService.returnValue = {
//             value: ''
//         };

//         component.getSensorParamData(global_variables['Categories'][0],  0);
//         expect(component.arrParams[0]['isRowHeader']).toBeTruthy();
//         expect(component.arrParams[0]['isSet']).toBeTruthy();
//     }));

//     it('#should change the chemical recognition paramters by onChangeChemicalParam function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn((component as any)._httpService, 'updateAsObject').and.callFake(() => {
//             return Promise.resolve();
//         });
//         component.selectedSensor = {
//             key: '-key'
//         };
//         component.onChangeChemicalParam('param', 'rowId', 'headId');
//         expect((component as any)._httpService.updateAsObject).toHaveBeenCalled();
//     }));

//     it('#should get all analytical data to display analytical view by visitAnalyticData function', fakeAsync(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'getAnalyticalData');
//         component.arrObjNewAnalyticalData = [{key: '-key'}];
//         component.visitAnalyticData();
//         tick();
//         expect(component.getAnalyticalData).toHaveBeenCalled();
//         expect(component.bIsReadAnalytic).toBeTruthy();
//     }));

//     it('#should get all raw data to display raw view by visitRawData function', fakeAsync(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'getAllRawData');
//         component.arrObjNewRawData = [{key: '-key'}];
//         component.visitRawData();
//         tick();
//         expect(component.getAllRawData).toHaveBeenCalled();
//         expect(component.bIsReadRaw).toBeTruthy();
//     }));

//     it('#should get all processed data to display processed view by visitProcessedData function', fakeAsync(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'getProcessedData');
//         component.arrObjNewProcessedData = [{key: '-key'}];
//         component.visitProcessedData();
//         tick();
//         expect(component.getProcessedData).toHaveBeenCalled();
//         expect(component.bIsReadProcess).toBeTruthy();
//     }));

//     it('#should change the navigation page by changeStatus function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'visitAnalyticData');
//         spyOn(component, 'initAnalyticalDataTable');
//         component.changeStatus(1);
//         expect(component.nActionNumber).toBe(1);
//         expect(component.visitAnalyticData).toHaveBeenCalled();
//         expect(component.initAnalyticalDataTable).toHaveBeenCalled();
//     }));

//     it('#\'s geo location parameters should be editable by onEditValue function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         const paramIndex = 1;
//         component.selectedSensor = {
//             name: 'name'
//         };
//         component.onEditValue(paramIndex);
//         expect(component.nStatus).toBe(paramIndex);
//     }));

//     it('#should update the geo location parameters by onUpdate function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         component.paramValue = 'param';
//         component.nStatus = 2;
//         spyOn(component, 'getLatitudeLongitude');
//         component.onUpdate();
//         expect(component.getLatitudeLongitude).toHaveBeenCalled();
//     }));

//     it('#should update the geo location parameters by showResult function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         component.selectedSensor = {
//             key: 'sensorKey'
//         };

//         spyOn(component, 'clearEdit');

//         component.showResult(
//             {
//                 geometry: {
//                     location: {
//                         lat: function() {
//                             return 32;
//                         },
//                         lng: function() {
//                             return 12;
//                         }
//                     }
//                 }
//             },
//             'united state',
//             component
//         );
//         fixture.whenStable().then(() => {
//             expect(component.clearEdit).toHaveBeenCalled();
//         });
//     }));

//     it('#load the google map api by loadGeoCoder function', () => {
//         component.loadGeoCoder();
//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             component._mapApiLoader.load().then(() => {
//                 expect(google).toBeDefined();
//             });
//         });
//     });

//     it('#should return latitude and longtitude by getLatitudeLongitude function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'showResult');
//         component.getLatitudeLongitude(component.showResult, 'United State', component);
//         fixture.detectChanges();

//         fixture.whenStable().then(() => {
//             if (component.geocoder) {
//                 expect(component.showResult).toHaveBeenCalled();
//             }
//         });
//     }));

//     it('#should update the sensor status by updateSensorDevice function', async(() => {
//         spyOn(component, 'checkSensorDeviceResponse');
//         spyOn(component, 'loadGeoCoder');
//         component.updateSensorDevice(1);

//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect(component.checkSensorDeviceResponse).toHaveBeenCalled();
//         });
//     }));

//     it('#should check sensor response by checkSensorDeviceResponse function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//         spyOn(mockHttpService, 'getAsObject').and.callThrough();
//         mockHttpService.returnValue = {
//             '$value': 'value'
//         };
//         component.checkSensorDeviceResponse(1);

//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect(component.responseValue).toBeDefined();
//         });
//     }));

//     it('#should watch the sensor device response by watchSensorDeviceResponse function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn((component as any)._spinner, 'stop');
//         component.watchSensorDeviceResponse();

//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect((component as any)._spinner.stop).toHaveBeenCalled();
//         });
//     }));

//     it('#should build processed data chart by buildProcessChart function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         component.buildProcessChart([], []);
//         expect(component.arrPlotyChromatogramData).toEqual([]);
//     }));

//     it('#should parse chromatogram by parseChromatogram function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'buildProcessChart');
//         const mockPureHttpService = fixture.debugElement.injector.get(PurehttpService) as PureHttpServiceMock;
//         spyOn(mockPureHttpService, 'callFirebaseFunction').and.callThrough();
//         mockPureHttpService.returnValue = {
//             data: [
//                 [0, 1, 2]
//             ]
//         };
//         component.parseChromatogram('url', '2018-1-26');
//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect(component.buildProcessChart).toHaveBeenCalled();
//         });
//     }));

//     it('#should parse detected peaks by parsePeaks function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         const mockPureHttpService = fixture.debugElement.injector.get(PurehttpService) as PureHttpServiceMock;
//         spyOn(mockPureHttpService, 'callFirebaseFunction').and.callThrough();
//         mockPureHttpService.returnValue = {
//             data: [
//                 [
//                     [1],
//                     [2]
//                 ],
//                 [
//                     [3],
//                     [4]
//                 ]
//             ]
//         };
//         component.parsePeaks('url', '2018-1-26');
//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect(component.arrStrPeakValues.length).not.toEqual(0);
//             expect(component.bIsPeakLoad).toBeTruthy();
//         });
//     }));

//     it('#should delete the Chromatogram or DetectedPeaks of the processed data by deleteProcessedData function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'deleteStorageFile');
//         component.deleteProcessedData({
//             key: 'key',
//             data: [{storageUrl: 'https://storage.com/processed'}]
//         });
//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect(component.deleteStorageFile).toHaveBeenCalled();
//             expect(component.strSelectedProcessKey).toBe('');
//         });
//     }));

//     it('#should call the deleteProcessedData function after confirm by onDeleteProcessedData function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'deleteProcessedData');
//         component.onDeleteProcessedData({
//             key: 'key',
//             data: [{storageUrl: 'https://storage.com/processed'}]
//         });
//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect(component.deleteProcessedData).toHaveBeenCalled();
//         });
//     }));

//     it('#should call the downloadFile function with the file data by onDownloadFile function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component, 'downloadFile');
//         const mockPureHttpService = fixture.debugElement.injector.get(PurehttpService) as PureHttpServiceMock;
//         spyOn(mockPureHttpService, 'callFirebaseFunction').and.callThrough();
//         mockPureHttpService.returnValue = {
//             data: {}
//         };
//         component.onDownloadFile('/download', 'fileName.pdf');
//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect(component.downloadFile).toHaveBeenCalled();
//         });
//     }));

//     it('#should update the analytical comment by onUpdateAnalyticComment function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component._snackBar, 'open');
//         component.onUpdateAnalyticComment({
//             comment: 'comment',
//             key: '-key'
//         });
//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect(component._snackBar.open).toHaveBeenCalled();
//         });
//     }));

//     it('#should update the raw comment by onUpdateRawComment function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component._snackBar, 'open');
//         component.onUpdateRawComment({
//             comment: 'comment',
//             key: '-key'
//         });
//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect(component._snackBar.open).toHaveBeenCalled();
//         });
//     }));

//     it('#should update the processed data comment by onUpdateProcessComment function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn(component._snackBar, 'open');
//         component.onUpdateProcessComment({
//             comment: 'comment',
//             key: '-key'
//         });
//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect(component._snackBar.open).toHaveBeenCalled();
//         });
//     }));

//     it('#should update analytical input by onUpdateAnalyticInput function', async(() => {
//         spyOn(component, 'loadGeoCoder');
//         spyOn((component as any)._httpService, 'updateAsObject').and.callFake((strUrl: string, value: any) => {
//             return Promise.resolve();
//         });
//         component.arrAnalyticalInputs = [];
//         component.onUpdateAnalyticInput({
//             key: '-key',
//             comment: 'comment'
//         }, 0);
//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect((component as any)._httpService.updateAsObject).toHaveBeenCalled();
//         });
//     }));
// });

// class HttpServiceMock {
//     returnValue: any;

//     getAsObject(strUrl: string, nTake: number = 0): Observable<any> {
//         return Observable.of(this.returnValue);
//     }

//     updateAsObject(strUrl: string, value: any): Promise<any> {
//         return Promise.resolve();
//     }

//     getAsList(strUrl: string, nTake: number = 0) {
//         return Observable.of(this.returnValue);
//     }

//     getListByOrder(strUrl: string, strOrder: string, strEqual: string, nTake: number = 0) {
//         return Observable.of(this.returnValue);
//     }

//     postAsObject(strUrl: string, value: any): Promise<any> {
//         return Promise.resolve();
//     }

//     deleteAsObject(strUrl: string) {
//         return Promise.resolve(true);
//     }
// }

// class PureHttpServiceMock {
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

// class MockSnackModal {
//     open(des: string, title: string, config: Object) {
//         return true;
//     }
// }

// class MockLocation {
//     back() {
//         return true;
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

// class DomSanitizerMockClass {
//     bypassSecurityTrustResourceUrl(url: string) {
//         return 'url';
//     }
// }

// @Component({
//     selector: 'app-plotly',
//     template: '<p>Mock Plotly Component</p>'
// })
// class MockPlotlyComponent {
//     @Input() data: any;
//     @Input() layout: any;
//     @Input() options: any;
//     @Input() style: any;
// }

// @Component({
//     selector: 'app-comment',
//     template: '<p>Mock Comment Component</p>'
// })
// class MockCommentComponent {
//     @Input() strComment: string;
//     @Input() key: string;
//     @Output() updateComment = new EventEmitter();
// }

// @Component({
//     selector: 'app-input',
//     template: '<p>Mock input Component</p>'
// })
// class MockInputComponent {
//     @Input() strInputType: string;
//     @Input() strValue: string;
//     @Input() arrStrOptions: string[];
//     @Output() doneEdit = new EventEmitter();
// }
// @Component({
//     selector: 'app-network-power',
//     template: ''
// })
// class MockNetworkComponent {
//     @Input() powerCount: number;
// }
/**
 * wrote in 2018/4/18
 * update in 2018/8/30
 * */
