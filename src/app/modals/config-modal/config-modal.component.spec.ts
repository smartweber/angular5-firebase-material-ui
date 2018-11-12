import {
    async,
    ComponentFixture,
    TestBed,
    inject
} from '@angular/core/testing';

import { ConfigModalComponent } from './config-modal.component';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import {
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import {
    MatSnackBar,
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogModule,
    MatDialogRef,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { global_variables } from '../../../environments/global_variables';
import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { PurehttpService } from '../../services/purehttp.service';
import { Observable } from 'rxjs/Observable';
import {
    Router
} from '@angular/router';

// describe('ConfigModalComponent', () => {
//     let component: ConfigModalComponent;
//     let dialog: MatDialog;
//     let fixture: ComponentFixture<ConfigModalComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [ ConfigModalComponent ],
//             providers: [
//                 { provide: MatDialogRef, useValue: { close: (() => {})} },
//                 { provide: MAT_DIALOG_DATA, useValue: [] },
//                 { provide: HttpService, useClass: HttpServiceMockClass },
//                 { provide: DataService, useClass: DataServiceMockClass },
//                 { provide: AuthService, useClass: AuthServiceMockClass },
//                 { provide: PurehttpService, useClass: PureHttpServiceMockClass },
//                 { provide: MatSnackBar, useClass: SnackModalMockClass },
//                 { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
//             ],
//             imports: [
//                 BrowserDynamicTestingModule,
//                 NoopAnimationsModule,
//                 MatDialogModule,
//                 MatFormFieldModule,
//                 MatSelectModule,
//                 MatProgressSpinnerModule,
//                 MatCheckboxModule,
//                 MatIconModule,
//                 MatTableModule,
//                 MatPaginatorModule,
//                 FormsModule,
//                 ReactiveFormsModule
//             ]
//         });

//         TestBed.overrideModule(BrowserDynamicTestingModule, {
//             set: {
//                 entryComponents: [ConfigModalComponent]
//             }
//         });

//         TestBed.compileComponents();
//     }));

//     beforeEach(inject([MatDialog],
//         (d: MatDialog) => {
//             dialog = d;
//             fixture = TestBed.createComponent(ConfigModalComponent);
//             component = fixture.componentInstance;
//         })
//     );

//     it('#should open the user dialog and set the variables', () => {
//         const dialogRef = dialog.open(ConfigModalComponent, {
//             width: '250px',
//             data: {
//                 strComment: 'comment',
//                 bIsEdit: false
//             }
//         });

//         expect(dialogRef.componentInstance instanceof ConfigModalComponent).toBe(true);
//     });

//     describe('via refreshing browser, ', () => {
//         it('#if user is un-authorized, it should be redirected to the dashboard', async(() => {
//             spyOn(component._snackBar, 'open');
//             const mockAuthService = fixture.debugElement.injector.get(AuthService) as AuthServiceMockClass;
//             spyOn(mockAuthService, 'isUserEmailLoggedIn').and.callThrough();
//             mockAuthService.authState = null;
//             component.ngOnInit();
//             expect(component._snackBar.open).toHaveBeenCalled();
//             expect((component as any)._router.navigate).toHaveBeenCalledWith(['/dashboard']);
//         }));

//         it('#if user is authorized, it is able to get the user information', async(() => {
//             const mockAuthService = fixture.debugElement.injector.get(AuthService) as AuthServiceMockClass;
//             mockAuthService.bIsStaff = true;
//             spyOn(mockAuthService, 'isUserEmailLoggedIn').and.callThrough();
//             mockAuthService.authState = 'data';
//             component.ngOnInit();
//             expect(component.strCurrentUserType).toBeDefined();
//         }));
//     });

//     it('#should check total run time by checkTotalRunTime function', () => {
//         component.initForm();

//         fixture.whenStable().then(() => {
//             component.checkTotalRunTime();
//             expect(component.nMinTotalRunTime).not.toBe(0);
//         });
//     });

//     describe('should handle the initial variables by handleBeforeModal function, ', () => {
//         it('#in Configuration Type Selection', (done) => {
//             spyOn(component, 'getConfigList');
//             component.nCurrentStep = 0;
//             component.handleBeforeModal();
//             expect(component.getConfigList).toHaveBeenCalled();
//             done();
//         });

//         it('#in Import data mode', (done) => {
//             spyOn(component, 'clearCloudConfigList');
//             component.nCurrentStep = 1;
//             component.handleBeforeModal();
//             expect(component.clearCloudConfigList).toHaveBeenCalled();
//             done();
//         });

//         it('#in configuration cycle numbers selection step', (done) => {
//             const nStepNumber = 2;
//             component.numberForm = new FormGroup({
//                 stepNumber: new FormControl(nStepNumber, [
//                     <any>Validators.required,
//                     Validators.min(1),
//                     Validators.max(100)
//                 ]),
//                 runNumber: new FormControl(1, [
//                     <any>Validators.required,
//                     Validators.min(1),
//                     Validators.max(100)
//                 ])
//             });
//             component.nCurrentStep = 2;
//             component.handleBeforeModal();
//             expect(component.nStepNumber).toBe(nStepNumber);
//             done();
//         });

//         it('#in step configuration case', (done) => {
//             component.nCurrentStep = 3;
//             component.nStepNumber = 2;
//             component.strCurrentStepAction = component.arrStrStepActions[0];
//             component.configForm = new FormGroup({
//             });
//             component.handleBeforeModal();
//             expect(component.arrParams).toBeDefined();
//             done();
//         });
//     });

//     describe('should handle the initial variables by handleAfterModal function, ', () => {
//         it('#in selecting import type case', (done) => {
//             spyOn(component, 'getConfigList');
//             component.nCurrentStep = 2;
//             component.strCurrentSetupType = component.arrStrSetupTypes[0];
//             component.handleAfterModal();
//             expect(component.getConfigList).toHaveBeenCalled();
//             done();
//         });

//         it('#in configuration cycle numbers selection case', (done) => {
//             component.nCurrentStep = 2;
//             fixture.detectChanges();
//             component.numberForm = new FormGroup({
//                 stepNumber: new FormControl(1, [
//                     <any>Validators.required,
//                     Validators.min(1),
//                     Validators.max(100)
//                 ]),
//                 runNumber: new FormControl(1, [
//                     <any>Validators.required,
//                     Validators.min(1),
//                     Validators.max(100)
//                 ])
//             });
//             component.nModalType = 0;
//             component.strCurrentDataType = global_variables['DataTypes'][0];
//             component.objConfigData = {
//                 0: {
//                     'Frac_Delta': {
//                         'Mode_config': {
//                             'Step1_Config': ''
//                         },
//                         'Num_of_Step': 1
//                     }
//                 }
//             };
//             component.handleAfterModal();
//             expect(component.arrObjLoadedParam).toBeDefined();
//             done();
//         });

//         it('#in step configuration case', (done) => {
//             spyOn(component, 'generateStepsAvailable');
//             spyOn(component, 'initForm');
//             component.nCurrentStep = 3;
//             component.handleAfterModal();
//             expect(component.generateStepsAvailable).toBeDefined();
//             expect(component.initForm).toHaveBeenCalledWith(false);
//             done();
//         });
//     });

//     it('#should set the initial configuration paramters by setParam function', () => {
//         spyOn(component, 'initForm');
//         component.strCurrentStepAction = component.arrStrStepActions[0];
//         component.setParam({param: 'param'}, false);
//         expect(component.initForm).toHaveBeenCalled();
//     });

//     it('#should make default options for the dropdowns by generateStepsAvailable function', () => {
//         component.generateStepsAvailable(1);
//         expect(component.arrObjChemicalCDs).toBeDefined();
//     });

//     it('#should go to next step by nextStep function', () => {
//         spyOn(component, 'handleBeforeModal');
//         spyOn(component, 'checkGoAvailability');
//         component.nextStep();
//         expect(component.handleBeforeModal).toHaveBeenCalled();
//         expect(component.checkGoAvailability).toHaveBeenCalled();
//     });

//     it('#should go to next step by previousStep function', () => {
//         spyOn(component, 'handleBeforeModal');
//         spyOn(component, 'checkGoAvailability');
//         component.previousStep();
//         expect(component.handleBeforeModal).toHaveBeenCalled();
//         expect(component.checkGoAvailability).toHaveBeenCalled();
//     });

//     it('#should check the availability to go or back to the next step by checkGoAvailability function', () => {
//         component.nCurrentStep = 4;
//         component.nStepNumber = 3;
//         const result = component.checkGoAvailability();
//         expect(result).toBeTruthy();
//     });

//     it('#should clear cloud configuration variables by clearCloudConfigList function', () => {
//         spyOn(component, 'getConfigList');
//         component.strCurrentSetupType = component.arrStrSetupTypes[0];
//         component.clearCloudConfigList();
//         expect(component.bIsTryToGetCC).toBeFalsy();
//         expect(component.bIsConfigMessage).toBeFalsy();
//         expect(component.getConfigList).toHaveBeenCalled();
//     });

//     it('#should get configuration file list by getConfigList function', () => {
//         spyOn(component, 'initDataTable');
//         component.getConfigList();
//         expect(component.bIsGetCloudConfigs).toBeTruthy();
//         expect(component.initDataTable).toHaveBeenCalled();
//     });

//     it('#should make configuration by buildParams function', () => {
//         component.numberForm = new FormGroup({
//             stepNumber: new FormControl(1, [
//                 <any>Validators.required,
//                 Validators.min(1),
//                 Validators.max(100)
//             ]),
//             runNumber: new FormControl(1, [
//                 <any>Validators.required,
//                 Validators.min(1),
//                 Validators.max(100)
//             ])
//         });
//         component.settingForm = new FormGroup({
//             samplingTime: new FormControl(1, [
//                 <any>Validators.required,
//                 Validators.min(1),
//                 Validators.max(100)
//             ]),
//             idleTime: new FormControl(1, [
//                 <any>Validators.required,
//                 Validators.min(1),
//                 Validators.max(100)
//             ])
//         });
//         const configs = component.buildParams();
//         expect(configs).toBeDefined();
//     });

//     it('#should submit the configurations by submitParams function', () => {
//         spyOn(component, 'buildParams');
//         spyOn(component.dialgoRef, 'close');
//         component.submitParams();
//         expect(component.buildParams).toHaveBeenCalled();
//         expect(component.dialgoRef.close).toHaveBeenCalled();
//     });

//     it('#should init the form by initForm function', () => {
//         component.initForm();
//         expect(component.configForm).toBeDefined();
//         expect(component.numberForm).toBeDefined();
//         expect(component.bIsLoadForm).toBeTruthy();
//     });

//     it('#should download the configuration data by downloadParam function', () => {
//         spyOn(component, 'buildParams');
//         component.strConfigFileName = 'file';
//         component.downloadParam();
//         expect(component.bIsAlert).toBeFalsy();
//         expect(component.buildParams).toHaveBeenCalled();
//     });

//     it('#should download the configuration data by updateCustomerPortal function', () => {
//         component.strUserId = 'userid';
//         component.updateCustomerPortal('userurl', 'path');
//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect(component.bIsUploadConfigurationToCloud).toBeTruthy();
//         });
//     });

//     it('#should load the configuration data from firebase by onLoadConfig function', () => {
//         const mockPurehttpService = fixture.debugElement.injector.get(PurehttpService) as PureHttpServiceMockClass;
//         spyOn(mockPurehttpService, 'callFirebaseFunction').and.callThrough();
//         mockPurehttpService.returnValue = {
//             data: {
//                 Frac_Delta: {},
//                 Current_Type: global_variables['DataTypes'][0]
//             }
//         };

//         spyOn(component, 'alertMessage');
//         spyOn(component, 'refactorSimpleConfiguration');
//         component.numberForm = new FormGroup({
//             stepNumber: new FormControl(1, [
//                 <any>Validators.required,
//                 Validators.min(1),
//                 Validators.max(100)
//             ]),
//             runNumber: new FormControl(1, [
//                 <any>Validators.required,
//                 Validators.min(1),
//                 Validators.max(100)
//             ])
//         });
//         component.onLoadConfig({
//             url: 'url',
//             key: 'key'
//         });
//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect(component.bIsLoadConfiguration).toBeTruthy();
//             expect(component.alertMessage).toHaveBeenCalled();
//             expect(component.refactorSimpleConfiguration).toHaveBeenCalled();
//         });
//     });

//     it('#should add new step by onAddStep function', () => {
//         spyOn(component, 'handleBeforeModal');
//         spyOn(component, 'handleAfterModal');
//         component.nCurrentStep = 4;
//         component.bIsOverTotalRunTime = false;
//         component.initForm();
//         component.onAddStep();
//         expect(component.handleBeforeModal).toHaveBeenCalled();
//         expect(component.handleAfterModal).toHaveBeenCalled();
//     });

//     it('#should delete one step by onDeleteStep function', () => {
//         spyOn(component, 'handleAfterModal');
//         component.nCurrentStep = 5;
//         component.initForm();
//         component.onDeleteStep();
//         expect(component.handleAfterModal).toHaveBeenCalled();
//     });

//     it('#should check the total run time by onChangeTotalRunTime function', () => {
//         component.nMinTotalRunTime = 7;
//         component.onChangeTotalRunTime(5);
//         expect(component.bIsOverTotalRunTime).toBeTruthy();
//     });

//     describe('by onDownloadJSONFile function, ', () => {
//         let mockPurehttpService: PureHttpServiceMockClass;

//         beforeEach(() => {
//                 spyOn(component, 'downloadJSONAction');
//                 mockPurehttpService = fixture.debugElement.injector.get(PurehttpService) as PureHttpServiceMockClass;
//                 mockPurehttpService.returnValue = {
//                     data: 'data'
//                 };
//             }
//         );

//         it('#should get the file data and call downloadJSONAction function', () => {
//             const strFileUri = 'firebase.com';
//             const strFileName = 'data.json';
//             component.onDownloadJSONFile(strFileUri, strFileName);
//             fixture.detectChanges();
//             expect(component.downloadJSONAction).toHaveBeenCalledWith(mockPurehttpService.returnValue.data, strFileName);
//         });

//         it('#should add json extension if there is no extension', () => {
//             const strFileUri = 'firebase.com';
//             const strFileName = 'data';
//             component.onDownloadJSONFile(strFileUri, strFileName);
//             fixture.detectChanges();
//             expect(component.downloadJSONAction).toHaveBeenCalledWith(mockPurehttpService.returnValue.data, strFileName + '.json');
//         });
//     });

//     it('#should download file by downloadJSONAction function', () => {
//         const data = { data: 'data' };
//         const fileName = 'data.json';
//         const link = component.downloadJSONAction(data, fileName);
//         expect(link.hasAttribute('download')).toBeTruthy();
//     });
// });

// class HttpServiceMockClass {
//     updateAsObject(strUrl: string, value: any): Promise<any> {
//         return Promise.resolve(true);
//     }

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

//     getListByOrder(strUrl: string, orderBy: string, orderEqual: string) {
//         return Observable.of([
//             {
//                 modalType: 0
//             }
//         ]);
//     }

//     createAsList(strUrl: string, value: any) {
//         return Promise.resolve(true);
//     }
// }

// class SnackModalMockClass {
//     open(des: string, title: string, config: Object) {
//         return true;
//     }
// }

// class DataServiceMockClass {
//     returnValue: any;
//     getString(strName: string) {
//         return this.returnValue;
//     }
// }

// class PureHttpServiceMockClass {
//     returnValue: any;

//     callFirebaseFunction(strUrl: string, objPostData: Object) {
//         return Observable.of(this.returnValue);
//     }
// }

// class AuthServiceMockClass {
//     authState: any;
//     bIsStaff: boolean;

//     get isUserStaff() {
//         return this.bIsStaff;
//       }

//     get isUserEmailLoggedIn(): boolean {
//         if (this.authState !== null) {
//             return true;
//         } else {
//             return false;
//         }
//     }

//     get currentUserId(): string {
//         return 'ABC123';
//     }
// }
/**
 * wrote in 2018/4/9
 * update in 2018/8/16
 * */
