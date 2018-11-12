import {
    Component,
    OnInit,
    ViewChild,
    Inject,
    OnDestroy
} from '@angular/core';
import {
    FormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import { PurehttpService } from '../../services/purehttp.service';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatSnackBar,
    MatPaginator,
    MatTableDataSource
} from '@angular/material';
import { database } from 'firebase/app';
import * as _ from 'lodash';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
    selector: 'app-config-modal',
    templateUrl: './config-modal.component.html',
    styleUrls: ['./config-modal.component.scss']
})
export class ConfigModalComponent implements OnInit, OnDestroy {
    configForm: FormGroup;
    numberForm: FormGroup;
    settingForm: FormGroup;

    arrStrDataTypes: string[];
    arrStrStepTypes: string[];
    arrStrStepActions: string[];
    arrStrSetupTypes: string[];
    arrStrUserTypes: string[];
    arrStrAlgorithm: string[];
    arrStrDisplayedColumns: string[];

    arrObjChromatograms: Object[];
    arrObjCalibrations: Object[];
    arrObjUploadOptions: Object[];
    arrObjUploadData: Object[];
    arrObjLoadedParam: Object[];
    arrObjChemicalCRs: Object[];
    arrObjChemicalCDs: Object[];
    arrObjChemicalPDs: Object[];
    arrObjConfigTypes: Object[];
    arrParams: Object[];
    arrConfigs: Object[];

    objTKeyTable: Object;
    objSelectedSensor: Object;
    objLoadedParam: Object;
    objConfigData: Object;
    objAssignedData: Object;
    objConfigFormErrors: Object;

    strCurrentDataType: string;
    strCurrentSetupType: string;
    strCurrentUserType: string;
    strUserId: string;
    strConfigFileName: string;
    strCurrentStepAction: string;
    strCurrentAlgorithm: string;
    strSelectedFileKey: string;
    strLoadedConfigFileName: string;
    strCurrentConfigType: string;
    strFilerText: string;
    strAssignedKey: string;
    strAssignedConfigurationName: string;
    strConfigurationAlert: string;

    bIsImportFile: boolean;
    bIsGetConfigurations: boolean;
    bIsLoadConfiguration: boolean;
    bIsConfigMessage: boolean;
    bIsAlertSuccess: boolean;
    bIsAlertError: boolean;
    bIsSaveConfiguration: boolean;
    bIsAlert: boolean;
    bIsUploadConfigurationToCloud: boolean;
    bIsGetCloudConfigs: boolean;
    bIsTryToGetCC: boolean;
    bIsOverTotalRunTime: boolean;
    bIsChemicalSaveData: boolean;
    bIsLoadForm: boolean;
    bIsMultiMRStep: boolean;
    bIsCorrectSimpleConfiguration: boolean;
    bIsGetAssignedCongiguration: boolean;
    isAssignMode: boolean;

    nCurrentStep: number;
    nStepNumber: number;
    nAlertType: number;
    nCurrentChroma: number;
    nCurrentCalib: number;
    nMinTotalRunTime: number;
    nChemicalCR: number;
    nChemicalCD: number;
    nChmicalPD: number;
    nChemicalStartTime: number;
    nChemicalTotal: number;
    nModalType: number;
    nMainStepNumber: number;
    nAssignedModalType: number;

    configFormSub: any;
    sensorDevicesSub: any;

    dataSource: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('table') table: any;


    constructor(
        public dialgoRef: MatDialogRef<ConfigModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
        public _snackBar: MatSnackBar,
        private _authService: AuthService,
        private _httpService: HttpService,
        private _purehttpService: PurehttpService,
        private _router: Router,
        private storage: AngularFireStorage
    ) {
        this.arrStrDataTypes = global_variables['DataTypes'];
        this.arrStrUserTypes = global_variables['userTypes'];
        this.arrStrStepActions = global_variables['stepActions'];
        this.arrStrAlgorithm = global_variables['algorithms'];
        this.arrStrStepTypes = global_variables['StepTypes'];
        this.arrStrSetupTypes = ['cloud', 'local', 'new'];
        this.arrStrDisplayedColumns = ['position', 'name', 'time', 'actions'];
        this.arrObjConfigTypes = [
            {
                label: 'Simple Configuration',
                value: 0
            },
            {
                label: 'Complete Configuration',
                value: 1
            }
        ];
        this.arrParams = [];
        this.arrConfigs = [];
        this.arrObjChromatograms = [];
        this.arrObjUploadData = [];
        this.arrObjCalibrations = [];
        this.arrObjUploadOptions = [];
        this.arrObjLoadedParam = [];
        this.arrObjChemicalCRs = [];
        this.arrObjChemicalCDs = [];
        this.arrObjChemicalPDs = [];

        this.objSelectedSensor = data['sensor'];
        this.objConfigData = data['configData'];
        this.isAssignMode = data['isAssignMode'] ? data['isAssignMode'] : false;
        this.strCurrentDataType = this.arrStrDataTypes[0];
        this.strCurrentAlgorithm = this.arrStrAlgorithm[0];
        this.strCurrentStepAction = this.arrStrStepActions[0];
        this.strCurrentSetupType = this.arrStrSetupTypes[0];
        this.strCurrentConfigType = this.arrObjConfigTypes[0]['value'];
        this.nCurrentStep = -1;
        this.nModalType = -1;
        this.nStepNumber = 0;
        this.nMainStepNumber = 3;

        this.bIsImportFile = false;
        this.bIsGetConfigurations = false;
        this.bIsConfigMessage = false;
        this.bIsAlertSuccess = false;
        this.bIsAlertError = false;
        this.bIsSaveConfiguration = false;
        this.bIsAlert = false;
        this.bIsUploadConfigurationToCloud = false;
        this.bIsGetCloudConfigs = false;
        this.bIsTryToGetCC = false;
        this.bIsOverTotalRunTime  = false;
        this.bIsChemicalSaveData = false;
        this.bIsLoadForm = false;
        this.bIsMultiMRStep = false;
        this.bIsCorrectSimpleConfiguration = true;
        this.bIsLoadConfiguration = false;
        this.bIsGetAssignedCongiguration = false;

        this.strSelectedFileKey = '';
        this.strLoadedConfigFileName = '';
        this.objConfigFormErrors = <any>{};

        this.getAssignedConfiguration();
    }

    /*
    *** check total sum of t1, t2 and t3
    */
    checkTotalRunTime() {
        const data = this.configForm['value'];

        this.nMinTotalRunTime = 0;
        if (this.objTKeyTable && this.objTKeyTable['rows'] && this.objTKeyTable['headers']) {
            for (let i = 0; i < this.objTKeyTable['rows'].length;  i ++) {
                let nTotal = 0;
                const row = this.objTKeyTable['rows'][i];

                for (let j = 2; j <= 4; j ++) {
                    const header = this.objTKeyTable['headers'][j];
                    const strKey = row.toLowerCase() + header.charAt(0).toUpperCase() +  header.slice(1);

                    if (data.hasOwnProperty(strKey)) {
                        nTotal += data[strKey];
                    }
                }

                if (this.nMinTotalRunTime < nTotal) {
                    this.nMinTotalRunTime = nTotal;
                }

                if (data['totalRuntime'] < this.nMinTotalRunTime) {
                    this.bIsOverTotalRunTime = true;
                } else {
                    this.bIsOverTotalRunTime = false;
                }
            }
        } else {
            this.bIsOverTotalRunTime = true;
            this._snackBar.open('Empty Form Key Table', 'Error', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center'
            });
        }
    }

    getAssignedConfiguration() {
        if (this.objSelectedSensor && this.objSelectedSensor['key']) {
            this.sensorDevicesSub = this._httpService
                .getAsObject(`${environment.APIS.SENSORDEVICES}/${this.objSelectedSensor['key']}/fileKey`).subscribe((device: Object) => {
                    if (device && device['$value']) {
                        this._httpService.getAsObject(`${environment.APIS.CONFIGURATIONS}/${device['$value']}`, 1)
                        .subscribe(
                            res  => {
                                if (res) {
                                    this.nAssignedModalType = res['modalType'];
                                    this.strAssignedConfigurationName = (res['path'] && res['path'].indexOf('/') > -1) ?
                                        res['path'].split('/').pop() : '';
                                    this.getAssignedConfigurationData(res['configUrl']);
                                }
                            }, error =>  {
                                console.error(error);
                            });
                    } else {
                        this.bIsGetAssignedCongiguration = true;
                    }
                }, error => {
                    console.log(error);
                });
        }
    }

    getAssignedConfigurationData(strLoadUrl: string) {
        const objPostData = {
            url: strLoadUrl
        };

        const strFireFunctionUrl = global_variables['FirebaseFunctionUrlCloud']; // cloud
        // let strFireFunctionUrl = environment.VARIABLES.FirebaseFunctionUrlLocal; // local

        this._purehttpService.callFirebaseFunction(`${strFireFunctionUrl}/getData`, objPostData).subscribe((res: any) => {
            const data = res.data;
            for (let i = 0; i < this.arrStrDataTypes.length; i++) {
                const strTypeKey = this.arrStrDataTypes[i];
                if (data.hasOwnProperty(strTypeKey) && data['Current_Type'] === strTypeKey) {
                    this.objAssignedData = data;
                    break;
                }
            }
            this.bIsGetAssignedCongiguration = true;
        }, error => {
            console.log('Fail to getting the file data.');
            console.log(error);
        });
    }

    /*
    *** handle modal status before clicking the previous and next step button
    */
    handleBeforeModal() {
        this.strSelectedFileKey = '';
        let configData: any;

        if (this.nCurrentStep === 0) { // Select the Configuration Type
            this.nModalType = 1;
            this.strCurrentDataType = this.arrStrDataTypes[0];
            this.bIsImportFile = false;
            this.bIsConfigMessage = false;
            this.getConfigList();
        } else if (this.nCurrentStep === (this.nMainStepNumber - 2)) { // Import data
            this.initForm();
            this.bIsImportFile = false;
            this.arrParams = [];

            let objConfigData = this.objLoadedParam;

            if (
                this.strCurrentSetupType === this.arrStrSetupTypes[2] &&
                this.objConfigData &&
                this.objConfigData.hasOwnProperty(this.nModalType)
            ) {
                objConfigData = this.objConfigData[this.nModalType];
            }

            let stepNumber = 1;
            let runNumber = 1;

            if (objConfigData && objConfigData.hasOwnProperty(this.strCurrentDataType) ) {
                configData = objConfigData[this.strCurrentDataType];
                stepNumber = configData['Num_of_Step'];
                runNumber = configData['Num_of_Cycle'];
            }

            this.numberForm.controls['stepNumber'].setValue(stepNumber);
            this.numberForm.controls['runNumber'].setValue(runNumber);

            this.clearCloudConfigList();
        } else if (this.nCurrentStep === (this.nMainStepNumber - 1)) {// select the numbers for the configuration
            const nStepNumber = parseInt(this.numberForm['value']['stepNumber'], 10);
            // the case when changing the array params
            if (configData) { // when data's step number is not same as the input value
                if (configData['Num_of_Step'] !== nStepNumber) {
                    this.arrParams = [];
                }
            } else {// when existing step number is not same as the input value
                if (this.nStepNumber !== nStepNumber) {
                    this.arrParams = [];
                }
            }

            this.nStepNumber = nStepNumber;
        } else if (
            this.nCurrentStep >= this.nMainStepNumber &&
            this.nCurrentStep < (this.nStepNumber + this.nMainStepNumber)
        ) { // steps for the configurations
            const nStep = this.nCurrentStep - this.nMainStepNumber;
            let data = <any>{};

            switch (this.strCurrentStepAction) {
                case this.arrStrStepActions[0]:
                    // Measurement Run
                    data = this.configForm['value'];

                    this.checkTotalRunTime();
                    if (this.bIsOverTotalRunTime) {
                        return;
                    }
                    break;

                case this.arrStrStepActions[1]:
                    // Data Processing
                    if (this.arrObjChromatograms.length > 0) {
                        data['algorithm'] = this.strCurrentAlgorithm;
                        data['chroma'] = this.nCurrentChroma;

                        if (this.nModalType === 0) {
                            data['calib'] = this.nCurrentCalib;
                        }
                    }
                    break;

                case this.arrStrStepActions[2]:
                    // Data Upload
                    if (this.arrObjUploadOptions.length > 0) {
                        data['uploads'] = this.arrObjUploadData;
                    }
                    break;

                case this.arrStrStepActions[3]:
                    // Chemical Recognition
                    if (this.arrObjChemicalCRs.length > 0 && this.arrObjChemicalCDs.length > 0  && this.arrObjChemicalPDs.length > 0 ) {
                        data['chroma'] = this.nChemicalCR;
                        data['processed'] = this.nChmicalPD;
                        data['start'] = this.nChemicalStartTime;
                        data['total'] = this.nChemicalTotal;
                        if (this.nModalType === 0) {
                            data['calib'] = this.nChemicalCD;
                            data['enabled'] = this.bIsChemicalSaveData;
                        }
                    }
                    break;
            }

            data['stepAction'] = this.strCurrentStepAction;

            this.arrParams[nStep] = data;
            this.bIsUploadConfigurationToCloud = false;
            this.bIsAlert = false;
            this.bIsSaveConfiguration = false;
        }

        return true;
    }

    /*
    *** handle modal status after clicking next and previous button
    */
    handleAfterModal() {
        this.bIsCorrectSimpleConfiguration = true;

        if (this.nCurrentStep === 2 && this.strCurrentSetupType === this.arrStrSetupTypes[0]) {
            this.getConfigList();
        }

        if (this.nCurrentStep === (this.nMainStepNumber - 1)) { // set the configurations for params form
            let objLoadedParam: Object;
            this.bIsMultiMRStep = false;

            if (this.strCurrentSetupType !== this.arrStrSetupTypes[0]) {
                this.strLoadedConfigFileName = '';
            }

            if ((this.strCurrentSetupType !== this.arrStrSetupTypes[2]) &&
                this.objLoadedParam &&
                (this.strCurrentDataType === this.objLoadedParam['Current_Type'])) {
                objLoadedParam = this.objLoadedParam[this.strCurrentDataType];
            }

            if (this.objConfigData &&
                this.objConfigData.hasOwnProperty(this.nModalType) &&
                this.objConfigData[this.nModalType].hasOwnProperty(this.strCurrentDataType)
            ) {
                if (this.strCurrentSetupType === this.arrStrSetupTypes[2]) {
                    objLoadedParam = this.objConfigData[this.nModalType][this.strCurrentDataType];
                }

                const configData = this.objConfigData[this.nModalType][this.strCurrentDataType];

                if (configData['Mode_Config']['Step2_Config'] &&
                configData['Mode_Config']['Step2_Config']['stepAction'] === this.arrStrStepActions[0]) {
                    this.bIsMultiMRStep = true;
                }
            }

            this.arrObjLoadedParam = [];

            if (
                objLoadedParam &&
                (objLoadedParam as any)['Num_of_Step'] === this.numberForm['value']['stepNumber'] &&
                objLoadedParam.hasOwnProperty('Mode_Config')
            ) {
                for (let i = 1; i <= objLoadedParam['Num_of_Step']; i ++) {
                    const keyName = `Step${i}_Config`;

                    if ((objLoadedParam as any)['Mode_Config'].hasOwnProperty(keyName)) {
                        this.arrObjLoadedParam.push((objLoadedParam as any)['Mode_Config'][keyName]);
                    }
                }
            }
        }

        const nParamStep = this.nCurrentStep - this.nMainStepNumber; // current param configuration step

        if (nParamStep >= 0) {
            this.generateStepsAvailable(nParamStep);

            // if arrParams is already existed, otherwise this step is not first time
            if (this.arrParams[nParamStep]) {
                this.setParam(this.arrParams[nParamStep], true);
            } else if (this.arrObjLoadedParam[nParamStep]) {
                this.setParam(this.arrObjLoadedParam[nParamStep], false);
            } else {
                this.initForm(false);
            }
        }

        if (
            this.nCurrentStep >= this.nMainStepNumber &&
            this.nCurrentStep < (this.nStepNumber + this.nMainStepNumber)
        ) {
            this.checkTotalRunTime();
        }
    }

    /*
    *** set the param to init the step form
    - params: params to init
    - bIsTracked: check if the param is from this.arrParams variable
    */
    setParam(params: Object, bIsTracked: boolean) {
        this.strCurrentStepAction = (params && params['stepAction']) ? params['stepAction'] : this.arrStrStepActions[0];
        this.arrObjUploadData = [];

        if (this.arrObjChromatograms.length > 0) {
            this.nCurrentChroma = this.arrObjChromatograms[0]['value'];
            if (this.nModalType === 0) {
                this.nCurrentCalib = this.arrObjChromatograms[0]['value'];
            }
            this.nCurrentChroma = this.arrObjChromatograms[0]['value'];
        }

        if (this.arrObjUploadOptions.length > 0) {
            this.arrObjUploadData.push({ step: this.arrObjUploadOptions[0]['value'] });
        }

        switch (this.strCurrentStepAction) {
            case this.arrStrStepActions[0]:
                // Measurement Run
                if (params) {
                    if (bIsTracked) {
                        this.setFormParam(params);
                    } else {
                        this.initForm(false, params);
                    }
                }
                break;
            case this.arrStrStepActions[1]:
                this.strCurrentAlgorithm = (params && params['algorithm']) ? params['algorithm'] : this.arrStrAlgorithm[0];
                this.nCurrentChroma = (params && params['chroma']) ? params['chroma'] : this.arrObjChromatograms[0]['value'];
                if (this.nModalType === 0) {
                    this.nCurrentCalib = (params && params['calib']) ? params['calib'] : this.arrObjChromatograms[0]['value'];
                }
                break;

            case this.arrStrStepActions[2]:
                this.arrObjUploadData = [];
                this.arrObjUploadData = (params && params['uploads']) ? params['uploads'] :
                    this.arrObjUploadData.push({ step: this.arrObjUploadOptions[0]['value'] });
                break;

            case this.arrStrStepActions[3]:
                this.nChemicalCR = (params as any)['chroma'] ? (params as any)['chroma'] : this.arrObjChemicalCRs[0];
                this.nChmicalPD = (params as any)['processed'] ? (params as any)['processed'] : this.arrObjChemicalPDs[0];
                this.nChemicalStartTime = (params as any)['start'] ? (params as any)['start'] : 12;
                this.nChemicalTotal = (params as any)['total'] ? (params as any)['total'] : 0;
                if (this.nModalType === 0) {
                    this.nChemicalCD = (params as any)['calib'] ? (params as any)['calib'] : this.arrObjChemicalCDs[0];
                    this.bIsChemicalSaveData = params['enabled'];
                }
                break;
        }

        if (this.arrObjChemicalCRs.length > 0 && !this.nChemicalCR) {
            this.nChemicalCR = this.arrObjChemicalCRs[0]['value'];
        }

        if (this.arrObjChemicalCDs.length > 0 && !this.nChemicalCD) {
            this.nChemicalCD = this.arrObjChemicalCDs[0]['value'];
        }

        if (this.arrObjChemicalPDs.length > 0 && !this.nChmicalPD) {
            this.nChmicalPD = this.arrObjChemicalPDs[0]['value'];
        }

        if (!this.nChemicalStartTime) {
            this.nChemicalStartTime  = 12;
        }

        if (!this.nChemicalTotal) {
            this.nChemicalTotal = 0;
        }

        if (!this.bIsChemicalSaveData) {
            this.bIsChemicalSaveData = false;
        }
    }

    /**
     * Check category existance in Data processing and upload action step
     * @param nStep: this.arrParams's step number
     * @param strCategory : category name in this.arrStrStepTypes
     */
    checkCategoryExistance(nStep: number, strCategory: string) {
        if (nStep < 0) {
            return false;
        }

        if (this.arrParams[nStep]['stepAction'] !== this.arrStrStepActions[0]) { // if it is no Measurement Run
            return false;
        }

        if (this.arrParams[nStep]['stepType'] === strCategory) {
            return true;
        } else {
            return false;
        }
    }


    /*
    *** get all steps available for a reference
    */
    generateStepsAvailable(nParamStep: number) {
        this.arrObjChromatograms = [];
        this.arrObjUploadOptions = [];
        this.arrObjChemicalCRs = [];
        this.arrObjChemicalCDs = [];
        this.arrObjChemicalPDs = [];

        if (nParamStep > 0) {
           for (let i = 0; i < nParamStep; i++) {
                if (this.arrParams[i] && this.arrParams[i]['stepAction']) {
                    if (this.arrParams[i]['stepAction'] === this.arrStrStepActions[0]) {
                        this.arrObjChromatograms.push({
                           value: i + 1,
                           label: `Step${i + 1} ${this.arrParams[i]['stepType']}`
                        });

                        if (this.arrParams[i]['saveData']) {
                            this.arrObjUploadOptions.push({
                               value: i + 1,
                               label: `Step${i + 1} ${this.arrParams[i]['stepType']}`
                            });
                        }

                        if (this.arrParams[i]['stepType'] === this.arrStrStepTypes[3]) { // Separation Category
                            this.arrObjChemicalCRs.push({
                               value: i + 1,
                               label: `Step${i + 1} ${this.arrParams[i]['stepType']}`
                            });
                        }

                        if (this.arrParams[i]['stepType'] === this.arrStrStepTypes[5]) { // Calibrate Flow Category
                            this.arrObjChemicalCDs.push({
                               value: i + 1,
                               label: `Step${i + 1} ${this.arrParams[i]['stepType']}`
                            });
                        }
                    }

                    if (this.arrParams[i]['stepAction'] === this.arrStrStepActions[1]) {// Data process step action
                        this.arrObjUploadOptions.push({
                            value: i + 1,
                            label: `Step${i + 1} ${this.arrParams[i]['stepAction']}`
                        });

                        this.arrObjChemicalPDs.push({
                            value: i + 1,
                            label: `Step${i + 1} ${this.arrParams[i]['stepAction']}`
                        });

                        if (this.checkCategoryExistance(this.arrParams[i]['chroma'] - 1, this.arrStrStepTypes[3]) ||
                            this.checkCategoryExistance(
                                this.arrParams[i].hasOwnProperty('calib') ? (this.arrParams[i]['calib'] - 1) : -1,
                                this.arrStrStepTypes[3])
                            ) { // Check Separation Category
                            this.arrObjChemicalCRs.push({
                                value: i + 1,
                                label: `Step${i + 1} ${this.arrParams[i]['stepAction']}`
                            });
                        }

                        if (this.checkCategoryExistance(this.arrParams[i]['chroma'] - 1, this.arrStrStepTypes[5]) ||
                            this.checkCategoryExistance(
                                this.arrParams[i].hasOwnProperty('calib') ? (this.arrParams[i]['calib'] - 1) : -1,
                                this.arrStrStepTypes[5])
                            ) { // Check Calibrate Flow Category
                            this.arrObjChemicalCDs.push({
                                value: i + 1,
                                label: `Step${i + 1} ${this.arrParams[i]['stepAction']}`
                            });
                        }
                    }

                    if (this.arrParams[i]['stepAction'] === this.arrStrStepActions[2]) {// Data Upload step action
                        if (this.arrParams[i]['uploads'].length > 0) {
                            for (let j = 0; j < this.arrParams[i]['uploads'].length; j ++) {
                                if (this.checkCategoryExistance(
                                    this.arrParams[i]['uploads'][j]['step'] - 1,
                                    this.arrStrStepTypes[3])
                                ) { // Check Separation Category
                                    this.arrObjChemicalCRs.push({
                                        value: i + 1,
                                        label: `Step${i + 1} ${this.arrParams[i]['stepAction']}`
                                    });
                                }

                                if (this.checkCategoryExistance(
                                    this.arrParams[i]['uploads'][j]['step'] - 1,
                                    this.arrStrStepTypes[5])
                                ) { // Check Calibrate Flow Category
                                    this.arrObjChemicalCDs.push({
                                        value: i + 1,
                                        label: `Step${i + 1} ${this.arrParams[i]['stepAction']}`
                                    });
                                }
                            }
                        }
                    }

                    if (this.arrParams[i]['stepAction'] === this.arrStrStepActions[3]) {// Chemical recognition step action
                        this.arrObjUploadOptions.push({
                            value: i + 1,
                            label: `Step${i + 1} ${this.arrParams[i]['stepAction']}`
                        });
                    }
                }
           }
        }

        this.arrObjCalibrations = _.cloneDeep(this.arrObjChromatograms);
        this.arrObjCalibrations.push({
            value: -1,
            label: 'N/A'
        });
        this.arrObjChemicalCDs.push({
            value: -1,
            label: 'N/A'
        });
        this.arrObjChemicalPDs.push({
            value: -1,
            label: 'N/A'
        });
    }

    nextStep() {
        this.handleBeforeModal();
        const bIsGo = this.checkGoAvailability();

        if (bIsGo) {
            this.nCurrentStep ++;
            this.handleAfterModal();
        }
    }

    previousStep() {
        this.handleBeforeModal();
        const bIsGo = this.checkGoAvailability();

        if (bIsGo) {
            this.nCurrentStep --;
            this.handleAfterModal();
        }
    }

    refactorSimpleConfiguration() {
        if (this.objLoadedParam &&
            this.objLoadedParam['Current_Type'] &&
            this.strCurrentConfigType === this.arrObjConfigTypes[0]['value']
        ) {
            const currentType = this.objLoadedParam['Current_Type'];
            this.objLoadedParam[currentType]['Num_of_Cycle'] = this.settingForm['value']['runNumber'];
            this.objLoadedParam[currentType]['Sampling_Time'] = this.settingForm['value']['samplingTime'];
            this.objLoadedParam[currentType]['Idle_Time'] = this.settingForm['value']['idleTime'];
            const samplingTimeSeconds = this.settingForm['value']['samplingTime'] * 3600;
            const samplingStepTotalTime = samplingTimeSeconds + 200;
            const idelTime = this.settingForm['value']['idleTime'];
            let isHaveSamplingStep = false;
            let isHaveIdleStep = false;
            const configData = this.objLoadedParam[currentType]['Mode_Config'];
            this.bIsCorrectSimpleConfiguration = true;

            if (configData) {
                for (const key in configData) {
                    if (configData[key] && configData[key]['stepAction'] === this.arrStrStepActions[0]) { // measurement run case

                        if (configData[key]['Step_Type'] === global_variables['StepTypes'][2]) { // sampling step case
                            isHaveSamplingStep = true;
                            this.objLoadedParam[currentType]['Mode_Config'][key]['Total_Run_Time'] = samplingStepTotalTime;
                            this.objLoadedParam[currentType]['Mode_Config'][key]['KP1']['t3'] = samplingTimeSeconds;
                        }

                        if (configData[key]['Step_Type'] === global_variables['StepTypes'][4]) { // idle step case
                            isHaveIdleStep = true;
                            this.objLoadedParam[currentType]['Mode_Config'][key]['Total_Run_Time'] = idelTime;
                        }
                    } else if (configData[key] && configData[key]['stepAction'] === this.arrStrStepActions[3]) { // chemical recognition
                        this.objLoadedParam[currentType]['Mode_Config'][key]['total'] = this.settingForm['value']['samplingTime'];
                    }
                }
            }

            if (!isHaveSamplingStep || !isHaveIdleStep) {
                this.bIsCorrectSimpleConfiguration = false;
            }
        }
    }

    submitStep() {
        if (this.strCurrentConfigType === this.arrObjConfigTypes[0]['value']) { // Simple Configuration
            this.objLoadedParam = this.objAssignedData;
            this.nModalType = this.nAssignedModalType;
            this.bIsConfigMessage = true;
            this.refactorSimpleConfiguration();
            this.alertMessage(true, 'This configuration must have a sampling and a idle step.');
            this.strLoadedConfigFileName = this.strAssignedConfigurationName ? this.strAssignedConfigurationName : '';
        }

        if (!this.objLoadedParam) {
            this.alertMessage(false, 'You first need to assign a configurtion file.');
            return;
        }

        if (!this.bIsCorrectSimpleConfiguration) {
            return;
        }

        const currentType = this.objLoadedParam['Current_Type'];
        this.objLoadedParam[currentType]['Sampling_Time'] = (this.strCurrentConfigType === this.arrObjConfigTypes[0]['value']) ?
            this.settingForm['value']['samplingTime'] : 0;
        this.objLoadedParam[currentType]['Idle_Time'] = (this.strCurrentConfigType === this.arrObjConfigTypes[0]['value']) ?
            this.settingForm['value']['idleTime'] : 0;

        this.dialgoRef.close({
            modalType: this.nModalType,
            data: this.objLoadedParam,
            fileName: this.strLoadedConfigFileName,
            fileKey: this.strSelectedFileKey
        });
    }

    checkGoAvailability() {
        let bIsGo = false;

        if (this.nCurrentStep < this.nMainStepNumber
            || this.nCurrentStep >= (this.nStepNumber + this.nMainStepNumber)) {
            bIsGo = true;
        } else {
            switch (this.strCurrentStepAction) {
                case this.arrStrStepActions[0]:
                    // Measurement Run
                    if (!this.bIsOverTotalRunTime) {
                        bIsGo = true;
                    }
                    break;

                case this.arrStrStepActions[1]:
                    // Data Processing
                    bIsGo = true;
                    break;

                case this.arrStrStepActions[2]:
                    // Data Upload
                    bIsGo = true;
                    break;

                case this.arrStrStepActions[3]:
                    // Chemical Recognition
                    bIsGo = true;
                    break;
            }
        }

        return bIsGo;
    }

    /*
    *** check if the time is zero
    */
    checkZero(data: string) {
        if (data.length === 1) {
            data = '0' + data;
        }
        return data;
    }

    /*
    *** convert the firebase timestamp to local date
    */
    convertToDate(timestamp: any) {
        const date = new Date(timestamp);
        let day = date.getDate() + '';
        let month = (date.getMonth() + 1) + '';
        let year = date.getFullYear() + '';
        let hour = date.getHours() + '';
        let minutes = date.getMinutes() + '';
        let seconds = date.getSeconds() + '';

        day     = this.checkZero(day);
        month   = this.checkZero(month);
        year    = this.checkZero(year);
        hour    = this.checkZero(hour);
        minutes = this.checkZero(minutes);
        seconds = this.checkZero(seconds);
        return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
    }

    /**
     * update the configuration files by changing the modal and model type selections
     */
    onChangeSetting() {
        this.getConfigList();
    }

    /*
    *** clear the configuration list from a cloud
    */
    clearCloudConfigList() {
        this.bIsTryToGetCC = false;
        this.bIsConfigMessage = false;
        this.arrConfigs = [];
        if (this.strCurrentSetupType === this.arrStrSetupTypes[0]) {
            this.getConfigList();
        }
    }

    /*
    *** load the configuration data from the firebase
    */
    getConfigList() {
        this.bIsGetCloudConfigs = false;
        this.bIsTryToGetCC = true;

        this._httpService.getListByOrder(
            `${environment.APIS.CONFIGURATIONS}`,
            'mode',
            this.strCurrentDataType,
            1
        ).subscribe((configs) => {
            this.arrConfigs = [];
            let pos = 0;

            this.arrConfigs = configs.filter((item) => {
                return item.modalType === this.nModalType;
            })
            .sort((a, b) => {
                return parseFloat(b.timestamp) - parseFloat(a.timestamp);
            })
            .map((item) => {
                pos ++;

                return {
                    position: pos,
                    name: item['path'].split('/').pop(),
                    url: item['configUrl'],
                    path: item['path'],
                    time: this.convertToDate(item['timestamp']),
                    key: item['key']
                };
            });

            this.bIsGetConfigurations = false;
            this.bIsGetCloudConfigs = true;
            this.initDataTable();
        },
        error => {
            console.log(error);
            this.arrConfigs = [];
            this.bIsGetConfigurations = false;
            this.bIsGetCloudConfigs = true;
        });
    }

    initDataTable(nCount: number = 0) {
        if (nCount > 50) {
            console.log('Timeout to create the datatable');
        } else if (!this.table || !this.paginator) {
            setTimeout(() => this.initDataTable(nCount), 50);
        } else {
            this.dataSource = new MatTableDataSource(this.arrConfigs);
            this.dataSource.paginator = this.paginator;
        }
    }

    buildParams() {
        const submitData = {
            Mode_Type: this.strCurrentDataType,
            Num_of_Step: this.numberForm['value']['stepNumber'],
            Num_of_Cycle: this.numberForm['value']['runNumber'],
            Sampling_Time: (this.strCurrentConfigType === this.arrObjConfigTypes[0]['value']) ?
                this.settingForm['value']['samplingTime'] : 0,
            Idle_Time: (this.strCurrentConfigType === this.arrObjConfigTypes[0]['value']) ? this.settingForm['value']['idleTime'] : 0,
            Mode_Config: null
        };

        const paramData: any = {};
        for (let i = 0; i < this.nStepNumber; i++) {
            const strKeyLabel = `Step${i + 1}_Config`;
            const data = this.arrParams[i];

            switch (data['stepAction']) {
                case this.arrStrStepActions[0]:
                    paramData[strKeyLabel] = {};

                    for (const row of this.objTKeyTable['rows']) {
                        paramData[strKeyLabel][row] = {};

                        for (const header of this.objTKeyTable['headers']) {
                            const fieldName = row.toLowerCase() + header.charAt(0).toUpperCase() +  header.slice(1);
                            paramData[strKeyLabel][row][header] = (data[fieldName] || data[fieldName] === 0) ? data[fieldName] : null;
                        }
                    }

                    paramData[strKeyLabel]['Save_Data'] = data['saveData'];
                    paramData[strKeyLabel]['Amp_Enable'] = data['ampEnable'];
                    paramData[strKeyLabel]['Total_Run_Time'] = data['totalRuntime'];
                    paramData[strKeyLabel]['Step_Type'] = data['stepType'];

                    if (this.nModalType === 1) { // omni-2000
                        paramData[strKeyLabel]['Target_Board_Temp'] = data['targetBoardTemp'];
                        paramData[strKeyLabel]['Board_Temp_Control'] = data['boardTempControl'];
                        paramData[strKeyLabel]['Fan_Control'] = data['fanControl'];
                    }

                    break;
                case this.arrStrStepActions[1]:
                    paramData[strKeyLabel] = {
                        algorithm: (data as any)['algorithm'],
                        chroma: (data as any)['chroma']
                    };
                    if (this.nModalType === 0) {
                        paramData[strKeyLabel]['calib'] = data['calib'];
                    }
                    break;

                case this.arrStrStepActions[2]:
                    paramData[strKeyLabel] = {
                        uploads: (data as any)['uploads']
                    };
                    break;

                case this.arrStrStepActions[3]:
                    paramData[strKeyLabel] = {
                        chroma: (data as any)['chroma'],
                        processed: (data as any)['processed'],
                        start: (data as any)['start'],
                        total: (data as any)['total']
                    };
                    if (this.nModalType === 0) {
                        paramData[strKeyLabel]['calib'] = data['calib'];
                        paramData[strKeyLabel]['enabled'] = data['enabled'] ? data['enabled'] : false;
                    }
                    break;
            }

            paramData[strKeyLabel]['stepAction'] = data['stepAction'];
        }

        submitData['Mode_Config'] = paramData;
        const configData = <any>{};
        configData[this.strCurrentDataType] = submitData;
        configData['Current_Type'] = this.strCurrentDataType;

        return configData;
    }

    submitParams() {
        const configData = this.buildParams();
        this.dialgoRef.close({
            modalType: this.nModalType,
            data: configData,
            fileName: (this.strLoadedConfigFileName &&
                (JSON.stringify(configData) === JSON.stringify(this.objLoadedParam))) ? this.strLoadedConfigFileName : ''
        });
    }

    initForm(isCreate: boolean = true, params: Object = null) {
        const group: any = {};
        this.objTKeyTable = <any>{};

        switch (this.strCurrentDataType) {
            case this.arrStrDataTypes[0]: // Frac Delta
                this.objTKeyTable = {
                    headers: ['tIdle', 'tTarget', 't1', 't2', 't3'],
                    rows: ['KP1', 'KP3', 'PCF', 'Injector', 'Column1', 'Column2', 'Column3']
                };
                break;
            case this.arrStrDataTypes[1]: // Absolute
                this.objTKeyTable = {
                    headers: ['tIdle', 'tTarget', 't1', 't2', 't3'],
                    rows: ['KP1', 'KP2', 'KP3', 'KP4', 'PCF', 'Injector', 'Column1', 'Column2', 'Column3']
                };
                break;
            case this.arrStrDataTypes[2]: // Delta
                this.objTKeyTable = {
                    headers: ['tIdle', 'tTarget', 't1', 't2', 't3'],
                    rows: ['KP1', 'KP3', 'PCF', 'Injector', 'Column1', 'Column2', 'Column3']
                };
                break;
        }

        if (isCreate) {
            for (const row of this.objTKeyTable['rows']) {
                let min = 0;
                let max = 0;
                let isDisabled = false;

                if (row === 'PCF') {
                    max = 300;
                } else if (row.indexOf('KP') === 0) {
                    max = 90;
                } else {
                    max = 50;
                }

                if (row === 'Injector' || row ===  'KP3') {
                    isDisabled = true;
                }

                for (const header of this.objTKeyTable['headers']) {
                    const ts = ['t1', 't2', 't3'];

                    if (ts.indexOf(header) >= 0) {
                        min = 0;
                        max = 14400;
                    } else if (row === 'KP1') {
                        min = -40;
                        max = 40;
                    }

                    const fieldName = row.toLowerCase() + header.charAt(0).toUpperCase() +  header.slice(1);
                    group[fieldName] = new FormControl(1, [
                        <any>Validators.required,
                        Validators.min(min),
                        Validators.max(max)
                    ]);

                    if (isDisabled) {
                        group[fieldName].disable();
                    }
                }
            }

            group['saveData'] = new FormControl(false, [
                <any>Validators.required
            ]);
            group['ampEnable'] = new FormControl(false, [
                <any>Validators.required
            ]);
            group['totalRuntime'] = new FormControl(0, [
                <any>Validators.required
            ]);
            group['stepType'] = new FormControl(this.arrStrStepTypes[0], [
                <any>Validators.required
            ]);

            if (this.nModalType === 1) { // omni-2000
                group['targetBoardTemp'] = new FormControl(0, [
                    <any>Validators.required
                ]);
                group['boardTempControl'] = new FormControl(0, [
                    <any>Validators.required
                ]);
                group['fanControl'] = new FormControl(0, [
                    <any>Validators.required
                ]);
            }

            this.configForm = new FormGroup(group);
            this.objConfigFormErrors = <any>{};

            for (const key in group) {
                if (group.hasOwnProperty(key)) {
                    this.objConfigFormErrors[key] = '';
                }
            }

            if (this.configFormSub) {
                this.configFormSub.unsubscribe();
            }

            this.configFormSub = this.configForm.valueChanges.subscribe(data => this.onValueChanged(data));

            this.numberForm = new FormGroup({
                stepNumber: new FormControl(1, [
                    <any>Validators.required,
                    Validators.min(1),
                    Validators.max(100)
                ]),
                runNumber: new FormControl(1, [
                    <any>Validators.required,
                    Validators.min(1),
                    Validators.max(100)
                ])
            });

            this.bIsLoadForm = true;
        } else {
            for (const row of this.objTKeyTable['rows']) {
                for (const header of this.objTKeyTable['headers']) {
                    const fieldName = row.toLowerCase() + header.charAt(0).toUpperCase() +  header.slice(1);
                    if (params && params[row]) {
                        this.configForm.controls[fieldName].setValue(params[row][header]);
                    } else {
                        this.configForm.controls[fieldName].setValue(1);
                    }
                }
            }

            if (params) {
                this.configForm.controls['saveData'].setValue(params['Save_Data']);
                this.configForm.controls['ampEnable'].setValue(params['Amp_Enable']);
                this.configForm.controls['totalRuntime'].setValue(params['Total_Run_Time']);
                this.configForm.controls['stepType'].setValue(params['Step_Type']);
            } else {
                this.configForm.controls['saveData'].setValue(false);
                this.configForm.controls['ampEnable'].setValue(false);
                this.configForm.controls['totalRuntime'].setValue(0);
                this.configForm.controls['stepType'].setValue(this.arrStrStepTypes[0]);
            }

            if (this.nModalType === 1) { // omni-2000
                if (params) {
                    this.configForm.controls['targetBoardTemp'].setValue(params['Target_Board_Temp']);
                    this.configForm.controls['boardTempControl'].setValue(params['Board_Temp_Control']);
                    this.configForm.controls['fanControl'].setValue(params['Fan_Control']);
                } else {
                    this.configForm.controls['targetBoardTemp'].setValue(0);
                    this.configForm.controls['boardTempControl'].setValue(0);
                    this.configForm.controls['fanControl'].setValue(0);
                }
            }
        }
    }

    checkConfigFormFields() {
        if (!this.configForm) { return; }

        const form = this.configForm;
        for (const field in this.objConfigFormErrors) {
            if (this.objConfigFormErrors.hasOwnProperty(field)) {
                this.objConfigFormErrors[field] = '';
                const control = form.get(field);

                if (control.hasError('required')) {
                    this.objConfigFormErrors[field] = 'Required field';
                    this.configForm.controls[field].markAsTouched();
                } else if (control.hasError('min') || control.hasError('max')) {
                    this.objConfigFormErrors[field] = 'Out of range';
                    this.configForm.controls[field].markAsTouched();
                }
            }
        }
    }

    onValueChanged(data?: any) {
        if (this.bIsLoadForm) {
            this.checkTotalRunTime();
        }

        this.checkConfigFormFields();
    }

    setFormParam(params: Object) {
        for (const key in this.configForm.controls) {
            if (this.configForm.controls.hasOwnProperty(key)) {
                this.configForm.controls[key].setValue(params[key]);
            }
        }
    }

    ngOnInit() {
        this.nCurrentStep = 0;

        if (this.isAssignMode) {
            this.strCurrentConfigType = this.arrObjConfigTypes[1]['value'];
            this.nextStep();
        }

        this.nModalType = 1;
        this.initSettingForm();

        if (this._authService.isUserEmailLoggedIn && this._authService.currentUserId) {
            this.strUserId = this._authService.currentUserId;
            if (this._authService.isUserStaff) { // staff
                this.strCurrentUserType = this.arrStrUserTypes[0];
            } else { // customer
                this.strCurrentUserType = this.arrStrUserTypes[1];

                if (!this.isAssignMode) {
                    this.strCurrentConfigType = this.arrObjConfigTypes[0]['value'];
                    this.nextStep();
                }

            }
        } else {
            this._snackBar.open('You need to login with proper permission.', 'Notification', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center'
            });
            this._router.navigate(['/dashboard']);
        }
    }

    ngOnDestroy() {
        if (this.configFormSub) {
            this.configFormSub.unsubscribe();
        }

        if (this.sensorDevicesSub) {
            this.sensorDevicesSub.unsubscribe();
        }
    }

    initSettingForm() {
        this.nModalType = 1;
        this.strCurrentDataType = this.arrStrDataTypes[0];

        this.settingForm = new FormGroup({
            runNumber: new FormControl(1, [
                Validators.required,
                Validators.min(1),
                Validators.max(100)
            ]),
            samplingTime: new FormControl(1, [
                Validators.required,
                Validators.min(0.5),
                Validators.max(4)
            ]),
            idleTime: new FormControl(300, [
                Validators.required,
                Validators.min(0)
            ])
        });
    }

    close() {
        this.dialgoRef.close();
    }

    downloadParam() {
        this.bIsAlert = false;

        if (!this.strConfigFileName) {
            this.bIsAlert = true;
            this.bIsSaveConfiguration = false;
            this.nAlertType = 2;
        } else {
            const configData = this.buildParams();
            const theJSON = JSON.stringify(configData);
            // this.downloadLink = this._sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
            const downloadHandler = document.createElement('a');
            downloadHandler.href = 'data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON);
            downloadHandler.download = `${this.strConfigFileName}.json`;
            downloadHandler.click();
        }
    }

    updateCustomerPortal(strUrl: string, path: string) {
        if (this.strUserId) {
            const postValue = {
                configUrl: strUrl,
                mode: this.strCurrentDataType,
                path: path,
                timestamp: database.ServerValue.TIMESTAMP,
                modalType: this.nModalType
            };

            this._httpService.createAsList(`${environment.APIS.CONFIGURATIONS}`, postValue)
            .then(() => {
                this.bIsSaveConfiguration = false;
                this.bIsAlert = true;
                this.nAlertType = 0;
                this.bIsUploadConfigurationToCloud = true;
            },
            error =>  {
                this.bIsSaveConfiguration = false;
                console.error(error);
                this.bIsAlert = true;
                this.nAlertType = 1;
            });
        } else {
            console.log('User uid is not existed');
        }
    }

    uploadParamsToCloud() {
        this.bIsAlert = false;
        if (!this.strConfigFileName) {
            this.bIsAlert = true;
            this.bIsSaveConfiguration = false;
            this.nAlertType = 2;
        } else {
            this.bIsSaveConfiguration = true;
            const configData = this.buildParams();
            const theJSON = JSON.stringify(configData);
            const blob = new Blob([theJSON], {type: 'application/json'});

            const fileFolder = environment.Upload.SENSORCOMFIGS;
            const timestamp = new Date().getTime().toString();
            const filename =  `${this.strConfigFileName}_${timestamp}`;
            const path = `/${fileFolder}/${this.objSelectedSensor['customerId']}/${this.objSelectedSensor['zoneId']}/${filename}`;

            const task = this.storage.upload(path, blob);
            console.log('Uploaded a blob or file! Now storing the reference at', path);
            task.downloadURL().take(1).subscribe(url => {
                this.updateCustomerPortal(url, path);
            });
        }
    }

    onImport(event) {
        const file = event.target.files[0];

        if (file) {
            this.bIsGetConfigurations = true;
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            const that = this;

            reader.onload = (evt) => {
                that.objLoadedParam = JSON.parse(evt.target['result']);
                if (that.objLoadedParam.hasOwnProperty(that.strCurrentDataType)) {
                    that.bIsImportFile = true;
                    that.bIsConfigMessage = true;
                    that.alertMessage(true, 'This configuration must have a sampling and a idle step.');
                } else {
                    that.bIsConfigMessage = true;
                    that.alertMessage(false, 'This configuration must have a sampling and a idle step.');
                }

                that.bIsGetConfigurations = false;
            };

            reader.onerror = (evt) => {
                console.log('error reading file');
            };
        }
    }

    downloadJSONAction(data: any, strName: string) {
        const blob = new Blob([JSON.stringify(data)], { type: 'text/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', strName);
        link.click();
        return link;
    }

    onDownloadJSONFile(strUri: string, strName: string) {
        const strFireFunctionUrl = global_variables['FirebaseFunctionUrlCloud']; // cloud
        // let strFireFunctionUrl = environment.VARIABLES.FirebaseFunctionUrlLocal; // local

        const objPostData = {
            url: strUri
        };

        this._purehttpService.callFirebaseFunction(`${strFireFunctionUrl}/getData`, objPostData).subscribe((res: any) => {
            const data = res.data;
            if (strName.split('.').pop() !== 'json' || strName === 'json') {
                strName += '.json';
            }

            this.downloadJSONAction(data, strName);
        }, error => {
            console.log('Fail to get the data to download.');
            console.log(error);
        });
    }

    /*
    *** load the configuration file from the firebase
    */
    onDeleteConfig(strConfigUrl: string, strKey: string) {
        this.bIsGetConfigurations = true;
        this.storage.ref(strConfigUrl).delete().take(1).subscribe(() => {
            // File deleted successfully
            console.log('Deleted the csv file Successfully.');
        }, err => {
            // Uh-oh, an error occurred!
            console.log('Deleting csv error: ');
            console.log(err);
        });

        const strConfigDBUrl = `${environment.APIS.CONFIGURATIONS}/${strKey}`;

        this._httpService.deleteAsObject(strConfigDBUrl)
            .then(()  => {
                console.log('Delete successfully: ' + strConfigDBUrl);
                this.strSelectedFileKey = '';
                this.getConfigList();
            }, error =>  {
                console.error(error);
            });
    }

    alertMessage(isSuccess: boolean, alert = '') {
        if (isSuccess) {
            this.bIsAlertSuccess = true;
            this.bIsAlertError = false;
        } else {
            this.bIsAlertSuccess = false;
            this.bIsAlertError = true;
        }

        this.strConfigurationAlert = alert;
    }

    /*
    *** load the configuration file from the firebase
    */
    onLoadConfig(objData: Object) {
        const strLoadUrl = objData['url'];
        this.bIsConfigMessage = false;
        this.strLoadedConfigFileName = objData['name'];
        this.strSelectedFileKey = objData['key'];

        if (strLoadUrl) {
            this.bIsLoadConfiguration = true;
            const objPostData = {
                url: strLoadUrl
            };

            const strFireFunctionUrl = global_variables['FirebaseFunctionUrlCloud']; // cloud
            // let strFireFunctionUrl = environment.VARIABLES.FirebaseFunctionUrlLocal; // local

            this._purehttpService.callFirebaseFunction(`${strFireFunctionUrl}/getData`, objPostData).subscribe((res: any) => {
                const data = res.data;

                for (let i = 0; i < this.arrStrDataTypes.length; i++) {
                    const strTypeKey = this.arrStrDataTypes[i];
                    if (data.hasOwnProperty(strTypeKey) && data['Current_Type'] === strTypeKey) {
                        this.objLoadedParam = data;
                        this.bIsLoadConfiguration = false;
                        this.bIsConfigMessage = true;
                        this.bIsImportFile = true;
                        this.refactorSimpleConfiguration();
                        this.alertMessage(true, 'This configuration must have a sampling and a idle step.');
                        this.initDataTable();
                        break;
                    }
                }
            }, error => {
                console.log('Fail to getting the file data.');
                console.log(error);
            });
        } else {
            console.log('The Url is not defined');
        }
    }

    onChangeConfigType() {
        this.bIsImportFile = false;
        this.clearCloudConfigList();
    }

    onAddUploadData() {
        if (this.arrObjUploadOptions.length > 0) {
            this.arrObjUploadData.push({
               step: this.arrObjUploadOptions[0]['value']
            });
        }
    }

    onAddStep() {
        if (this.nCurrentStep >= this.nMainStepNumber) {
            if ((this.configForm && !this.configForm.valid) ||
            (this.bIsOverTotalRunTime && this.strCurrentStepAction === this.arrStrStepActions[0])) {
                this._snackBar.open('At a moment, you are in invalid form', 'Error', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'center'
                });
                return;
            }
            const data = <any>{};

            for (const row of this.objTKeyTable['rows']) {
                data[row] = <any>{};

                for (const header of this.objTKeyTable['headers']) {
                    data[row][header] = 1;
                }
            }

            data['Save_Data'] = false;
            data['Amp_Enable'] = false;
            data['Total_Run_Time'] = 0;
            data['Step_Type'] = this.arrStrStepTypes[0];

            if (this.nModalType === 1) { // omni-2000
                data['Target_Board_Temp'] = 0;
                data['Target_Board_Temp_Range'] = 0;
                data['Control_Cycle_Period'] = 0;
                data['Board_Temp_Control'] = this.arrStrStepTypes[0];
                data['Fan_Control'] = this.arrStrStepTypes[0];
            }

            data['stepAction'] = this.arrStrStepActions[0];
            this.nStepNumber ++;
            this.numberForm.controls['stepNumber'].setValue(this.nStepNumber);
            this.handleBeforeModal();
            this.nCurrentStep ++;
            const nParamStep = this.nCurrentStep - this.nMainStepNumber;
            this.arrParams.splice(nParamStep, 0, null);
            this.arrObjLoadedParam.splice(nParamStep, 0, null);
            this.strCurrentStepAction = this.arrStrStepActions[0];
            this.handleAfterModal();
            this.arrObjLoadedParam[nParamStep] = data;
        }
    }

    onDeleteStep() {
        if ( this.nCurrentStep >= this.nMainStepNumber ) {
            const nParamStep = this.nCurrentStep - this.nMainStepNumber;
            if (this.arrParams[1]) {
                this.arrParams.splice(nParamStep, 1);
            }

            if (this.arrObjLoadedParam[1]) {
                this.arrObjLoadedParam.splice(nParamStep, 1);
            }

            if (this.nCurrentStep !== this.nMainStepNumber) {
                this.nStepNumber --;
                this.numberForm.controls['stepNumber'].setValue(this.nStepNumber);
                this.nCurrentStep --;
            } else if (this.nCurrentStep === this.nMainStepNumber) {
                this.nStepNumber --;
                this.numberForm.controls['stepNumber'].setValue(this.nStepNumber);
            }

            this.handleAfterModal();
        }
    }

    onChangeTotalRunTime(event: number) {
        if (!event) {
           this.bIsOverTotalRunTime = false;
        }

        if (this.bIsOverTotalRunTime && event >= this.nMinTotalRunTime) {
            this.bIsOverTotalRunTime = false;
        }

        if (event < this.nMinTotalRunTime) {
            this.bIsOverTotalRunTime = true;
        }
    }

    onUpdateFilter(event: any) {
        let filterValue = event.target.value.toLowerCase();
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }
}
