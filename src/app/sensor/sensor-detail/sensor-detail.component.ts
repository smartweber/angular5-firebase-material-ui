import {
Component,
  OnInit,
  Input,
  ElementRef,
  OnDestroy,
  OnChanges,
  ViewChild
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  MatDialog,
  MatSnackBar,
  MatPaginator,
  MatTableDataSource
} from '@angular/material';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';
import { HttpService } from '../../services/http.service';
import { NotificationService } from '../../services/notification.service';
import { PurehttpService } from '../../services/purehttp.service';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../components/spinner/spinner.service';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';
import { ConfigModalComponent } from '../../modals/config-modal/config-modal.component';
import { MapsAPILoader } from '@agm/core';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireStorage } from 'angularfire2/storage';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
declare let google: any;

@Component({
  selector: 'app-sensor-detail',
  templateUrl: './sensor-detail.component.html',
  styleUrls: ['./sensor-detail.component.scss']
})
export class SensorDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Input() selectedSensor: any;
  @Input() sensorKey: string;
  @ViewChild('chartBodyElement') chartBodyElement: ElementRef;
  @ViewChild('adcTabElement') adcTabElement: any;
  @ViewChild('cdcTabElement') cdcTabElement: any;
  @ViewChild('flowTabElement') flowTabElement: any;
  @ViewChild('analyticalPaginator') analyticalPaginator: MatPaginator;
  @ViewChild('rawPaginator') rawPaginator: MatPaginator;
  @ViewChild('processedPaginator') processedPaginator: MatPaginator;

  queryParamSub: Subscription;
  arrCategorySub: Subscription[];
  sensorTypeSub: Subscription;
  sensorActionSub: Subscription;
  configurationSub: Subscription;
  rawAllSub: Subscription;
  processedDataSub: Subscription;
  analyticalDataSub: Subscription;
  analyticalData: any;
  rawData: any;

  plotlyADCData: any;
  plotlyADCLayout: Object;
  plotlyADCStyle: Object;

  plotlyCDCData: any;
  plotlyCDCLayout: Object;
  plotlyCDCStyle: Object;

  plotlyFlowData: any;
  plotlyFlowLayout: Object;
  plotlyFlowStyle: Object;

  arrPlotyChromatogramData: Object[];
  plotlyProcessLayout: Object;
  plotlyProcessStyle: Object;

  adcOptions: Object;
  adcData: any;
  cdcOptions: Object;
  cdcData: any;
  flowOptions: Object;
  flowData: any;
  configData: any;
  orginConfigData: any;

  strSensorTypeName: string;
  paramValue: string;
  error: string;
  strUserRole: string;
  arrStrUserRoles: string[];
  arrStrUserTypes: string[];
  arrStrStepActions: string[];
  arrStrProcessedDataTypes: string[];
  arrStrAnalyticalInputs: string[];
  arrStrDisplayedColumns: string[];
  arrStrDebugDisplayedColumns: string[];
  arrStrTableTypes: string[];
  responseValue: string;
  strChromatogramTime: string;
  strPeakTime: string;
  strChartCSVUrl: string;
  strLCDChartDate: string;
  strUserType: string;
  strSelectedProcessKey: string;
  strFireFunctionUrl: string;
  strSelectedRawKey: string;
  strSelectedRawCycle: string;
  strSelectedAnalyticKey: string;
  strSelectedAnalyticCycle: string;
  strAnalyticalDate: string;
  strAnalyticalStartTime: string;
  strProcessStartTime: string;
  strRawStartTime: string;
  strSensorTypeId: string;
  strWifiIP: string;
  strCellularIP: string;

  processData: any[];

  nActionNumber: number;
  nStatus: number;
  nSelectedChartInd: number;
  nActionStatus: number;
  nDeleteProcessTotal: number;
  nRunPercent: number;
  nRunRemainTime: number;
  nStepPercent: number;
  nStepRemainTime: number;
  nRunTotalTime: number;
  nStepTotalTime: number;
  nWifiSignal: number;
  nCellularSignal: number;
  nCurrentModalType: number;

  isTypeLoading: boolean;
  isRowHeader: boolean;
  isEditStatus: boolean;
  bIsLoadRawData: boolean;
  isAdcCalled: boolean;
  isCdcCalled: boolean;
  isFlowCalled: boolean;
  isGetConfig: boolean;
  isOnlineDevice: boolean;
  bIsGetAllRawData: boolean;
  bIsProcessedData: boolean;
  bIsChromatogram: boolean;
  bIsPeakLoad: boolean;
  bIsStuff: boolean;
  bIsProgressBar: boolean;
  bIsDoneProgress: boolean;
  bIsReadRaw: boolean;
  bIsReadProcess: boolean;
  bIsReadAnalytic: boolean;
  bIsProgressDes: boolean;
  bIsAnalyticalData: boolean;
  bIsParseAnalyticData: boolean;
  bIsShowRententionProperties: boolean;
  bIsSensorTypeEdit: boolean;
  bIsDebugData: boolean;

  isStatus: boolean;
  isVocAnalytics: boolean;
  isVocAnalyticsEditable: boolean;
  isDebugEditable: boolean;

  sensorType: Object;
  runProgress: Object;
  arrObjRawFiles: Object[]; // raw data files
  arrObjProcessedFiles: Object[]; // processed data files
  arrObjAnalyticList: Object[]; // analytical data files
  arrObjDebugFiles: Object[];
  arrAnalyticalCycles: Object[];
  arrObjRawCycles: Object[];
  arrRunProgress: Object[];
  arrStepProgress: Object[];
  arrStrPeakValues: any[];
  arrValueTypes: string[];
  arrStrPeakHeaders: string[];
  arrStrRetentionProperties: string[];
  arrParams: Object[];
  arrObjNewRawData: Object[];
  arrObjNewProcessedData: Object[];
  arrObjNewAnalyticalData: Object[];
  arrObjSensorTypes: Object[];
  arrAnalyticalInputs: any[];

  PARATYPE = ['option'];
  SENSOR_MAP = [
    'name',
    'address',
    'availability',
    'lat',
    'lng',
    'description',
    'serialNumber'
  ];
  arrStrAvailabilites: string[];

  nProcessedDataCounter = 0;
  nRawDataCounter = 0;
  analyticalDataSource: any;
  processedDataSource: any;
  debugDataSource: any;
  rawDataSource: any;
  geocoder: any;
  sensorTypesSub: any;
  debugDataSub: any;

  constructor(
    private _httpService: HttpService,
    private _spinner: SpinnerService,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _nofication: NotificationService,
    public _mapApiLoader: MapsAPILoader,
    private _purehttpService: PurehttpService,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    private _location: Location,
    private _authService: AuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private storage: AngularFireStorage
  ) {
    this.nActionNumber = -1; /* 0: status, 1:voc analytics, 2:voc raw, 3:processed data, 4:debug */
    this.nStatus = -1; // 0: none, 1>=: edit status
    this.nActionStatus = -1;
    this.nSelectedChartInd = 0;
    this.nRunPercent = 0;
    this.nRunRemainTime = 0;
    this.nStepPercent = 0;
    this.nStepRemainTime = 0;
    this.nRunTotalTime = 0;
    this.nStepTotalTime = 0;
    this.nWifiSignal = 0;
    this.nCellularSignal = 0;
    this.nCurrentModalType = -1;

    this.isTypeLoading = false;
    this.bIsProgressDes = false;

    this.isRowHeader = false;
    this.isEditStatus = false;
    this.isStatus = false;
    this.isVocAnalytics = false;
    this.isVocAnalyticsEditable = false;
    this.isDebugEditable = false;
    this.isGetConfig = false;
    this.isOnlineDevice = false;
    this.bIsGetAllRawData = false;
    this.bIsProcessedData = false;
    this.bIsChromatogram = false;
    this.bIsPeakLoad = false;
    this.bIsProgressBar = false;
    this.bIsDoneProgress = false;
    this.bIsReadRaw = true;
    this.bIsReadProcess = true;
    this.bIsReadAnalytic = true;
    this.bIsAnalyticalData = true;
    this.bIsParseAnalyticData = false;
    this.bIsShowRententionProperties = false;
    this.bIsSensorTypeEdit = false;
    this.bIsDebugData = false;

    this.arrObjRawFiles = [];
    this.arrObjProcessedFiles = [];
    this.processData = [];
    this.arrStrPeakValues = [];
    this.arrStrPeakHeaders = [];
    this.arrRunProgress = [];
    this.arrStepProgress = [];
    this.arrPlotyChromatogramData  = [];
    this.arrObjNewRawData = [];
    this.arrObjNewProcessedData = [];
    this.arrObjAnalyticList = [];
    this.arrObjNewAnalyticalData = [];
    this.arrAnalyticalCycles = [];
    this.arrObjRawCycles = [];
    this.arrObjSensorTypes = [];
    this.arrObjDebugFiles = [];

    this.strSelectedProcessKey = '';
    this.strSelectedRawKey = '';
    this.strSelectedRawCycle = '';
    this.strSelectedAnalyticKey = '';
    this.strSelectedAnalyticCycle = '';
    this.strAnalyticalStartTime = '';
    this.strProcessStartTime = '';
    this.strRawStartTime = '';
    this.strWifiIP = '';
    this.strCellularIP = '';

    this.matIconRegistry.addSvgIcon(
      'startIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/start.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'stopIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/stop.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'exitIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/exit.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'rebootIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/reboot.svg')
    );

    // for sensor types
    this.arrCategorySub = [];
    this.arrParams = [];
    for (let i = 0; i < global_variables['Categories'].length; i++) {
      this.arrParams[i] = {
        types: <any>{},
        values: [],
        isRowHeader: false,
        isHeaderShow: false,
        isRowShow: false,
        isSet: false
      };
    }

    this.arrStrDisplayedColumns = ['position', 'startTimestamp', 'type', 'name', 'date', 'size', 'actions', 'comment'];
    this.arrStrDebugDisplayedColumns = ['position', 'name', 'date', 'size'];
    this.arrStrUserRoles = global_variables['userRoles'];
    this.arrStrUserTypes = global_variables['userTypes'];
    this.arrStrAvailabilites = global_variables['deviceStatus'];
    this.arrStrStepActions = global_variables['stepActions'];
    this.arrStrProcessedDataTypes = global_variables['ProcessedDataTypes'];
    this.arrValueTypes = global_variables['ValueTypes'];
    this.arrStrRetentionProperties = global_variables['RententionProperties'];
    this.arrStrAnalyticalInputs = global_variables['AnalyticalInputs'];
    this.arrStrTableTypes = global_variables['tableTypes'];
    this.strFireFunctionUrl = global_variables['FirebaseFunctionUrlCloud']; // cloud
    // this.strFireFunctionUrl = global_variables.FirebaseFunctionUrlLocal; // local
  }

  ngOnInit() {
    if (!this.sensorKey) {
      this._snackBar.open('The sensor key can\'t be empty', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });

      this._router.navigate(['/dashboard']);
      return;
    }

    if (!this.selectedSensor) {
      this._snackBar.open('The sensor can\'t be empty', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });

      this._router.navigate(['/dashboard']);
      return;
    }

    if (this._authService.isCheckUser && this._authService.isUserEmailLoggedIn) {
      this.initData();
    }
  }

  initData() {
    this.strUserRole = this._authService.userData['action']['role'];
    this.strSensorTypeId = this.selectedSensor.sensorTypeId;

    this.loadGeoCoder();
    this.checkUserType();

    this.queryParamSub = this._activeRoute.queryParams.subscribe(params => {
      if (params['type'] === 'edit') {
        this.isEditStatus = true;
      } else {
        this.isEditStatus = false;
      }
    });

    const sensorDeviceUrl = environment.APIS.SENSORDEVICES;
    this.sensorActionSub = this._httpService.getAsObject(`${sensorDeviceUrl}/${this.sensorKey}`).subscribe((device) => {
      if (device) {
        if (device['actionStatus'] || device['actionStatus'] === 0) {
          this.nActionStatus = device['actionStatus'];
        }

        this.strWifiIP = device['wifiIP'] ? device['wifiIP'] : 'N/A';
        this.strCellularIP = device['cellularIP'] ? device['cellularIP'] : 'N/A';
        this.nWifiSignal = this.calculateSingalStrength(device['wifiSignal']);
        this.nCellularSignal = this.calculateSingalStrength(device['cellularSignal']);
      }
    }, error => {
      console.log(error);
    });

    this._httpService.getAsObject(`${sensorDeviceUrl}/${this.sensorKey}`, 1).subscribe((device) => {
      if (device) {
        if (!device.hasOwnProperty('resVal')) {
          const updateResValue = <any>{};
          updateResValue['resVal'] = '';

          this._httpService.updateAsObject(`${sensorDeviceUrl}/${this.sensorKey}`, updateResValue)
            .then(
              ()  => {
                console.log('Sensor device resVal field is set to default status');
              },
              error =>  console.error(error));
        }
      }
    });

    this.sensorTypesSub = this._httpService.getAsList(`${environment.APIS.SENSORTYPES}`).subscribe((sensorTypes) => {
      if (sensorTypes && sensorTypes.length > 0) {
        this.arrObjSensorTypes = sensorTypes.map((type) => {
          return {
            key: type['key'],
            name: type['typeName']
          };
        });
      }
    });

    this.debugDataSub = this._httpService.getAsList(`${environment.APIS.DEBUGDATA}/${this.sensorKey}`).subscribe((debgData) => {
      this.arrObjDebugFiles = [];

      if (debgData && debgData.length > 0) {

        let position = 0;

        this.arrObjDebugFiles = debgData.filter((item) => {
          return item['timestamp'] && item['storagePath'];
        }).sort((a, b) => {
          return parseFloat(b['timestamp']) - parseFloat(a['timestamp']);
        }).map((item) => {
          position ++;

          return {
            position: position,
            name: (item['storagePath'] && item['storagePath'].indexOf('/') > -1) ? item['storagePath'].split('/').pop() : '',
            url: item['storageUrl'] ? item['storageUrl'] : '',
            date: item['timestamp'] ? this.convertToDate(item['timestamp']) : 'N/A',
            size: this.formatBytes(item['fileSize'])
          };
        });

      }

      this.bIsDebugData = true;
      this.debugDataSource = new MatTableDataSource(this.arrObjDebugFiles);
    });
  }

  calculateSingalStrength(nSingalStrengthPercent: number) {
    if (!nSingalStrengthPercent) {
      return 0;
    }

    if (nSingalStrengthPercent >= 90) {
      return 5;
    } else if (nSingalStrengthPercent >= 70) {
      return 4;
    } else if (nSingalStrengthPercent >= 50) {
      return 3;
    } else if (nSingalStrengthPercent >= 30) {
      return 2;
    } else if (nSingalStrengthPercent >= 10) {
      return 1;
    }

    return 0;
  }

  loadGeoCoder() {
    this._mapApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  checkUserType() {

    if (this._authService.isUserStaff) { // staff
      this.strUserType = this.arrStrUserTypes[0];
    } else { // customer
      this.strUserType = this.arrStrUserTypes[1];
    }

  }

  formatBytes(bytes) {
    bytes = parseInt(bytes, 10);

    if (isNaN(bytes)) {
      return 'Unknown';
    } else {
      if (bytes < 1024) {
        return bytes + ' Bytes';
      } else if (bytes < 1048576) {
        return(bytes / 1024).toFixed(3) + ' KB';
      } else if (bytes < 1073741824) {
        return(bytes / 1048576).toFixed(3) + ' MB';
      } else {
        return(bytes / 1073741824).toFixed(3) + ' GB';
      }
    }
  }

  /**
   * load one cycle data for analytical, processed and raw data
   * @objData: one row
   * @nType: 0 - analytic, 1 - processed, 2 - raw
   */
  onLoadOneCycleData(objData: Object, nType: number) {
    // load analytic data
    if (nType === 0) {
      this.onLoadAnalyticalData(objData);
    } else {
      const arrObjAnalyticData = this.arrObjAnalyticList.filter(function( objItem ) {
        return objItem['cycleIndex'] === objData['cycleIndex'];
      });

      if (arrObjAnalyticData.length > 0) {
        this.onLoadAnalyticalData(arrObjAnalyticData[0]);
      }
    }

    // load processed data
    if (nType === 1) {
      this.onLoadProcessedData(objData);
    } else {
      const arrObjProcessedData = this.arrObjProcessedFiles.filter(function( objItem ) {
        return objItem['cycleIndex'] === objData['cycleIndex'];
      });

      if (arrObjProcessedData.length > 0) {
        this.onLoadProcessedData(arrObjProcessedData[0]);
      }
    }

    // load raw data
    if (nType === 2) {
      this.onLoadRawData(objData);
    } else {
      if (this.arrObjRawFiles) {
        const arrObjRawData = this.arrObjRawFiles.filter(function( objItem ) {
          return objItem['cycleIndex'] === objData['cycleIndex'];
        });
        if (arrObjRawData.length > 0) {
          if (arrObjRawData.length > 1) {
            const arrObjSeparationData = arrObjRawData.filter(function( obj ) {
              return obj['type'] === global_variables['StepTypes'][3]; // separation step
            });

            if (arrObjSeparationData.length > 0) {
              this.onLoadRawData(arrObjSeparationData[0]);
            } else {
              this.onLoadRawData(arrObjRawData[0]);
            }
          } else {
            this.onLoadRawData(arrObjRawData[0]);
          }
        }
      }
    }
  }

  /**
   * Load analytic data
   * @param objAnalyticData
   */
  onLoadAnalyticalData(objAnalyticData: Object) {
    this.strSelectedAnalyticKey = objAnalyticData['key'];
    this.strSelectedAnalyticCycle = objAnalyticData['cycleIndex'];
    this.getAnalyticalFileData(objAnalyticData['url']);
    this.strAnalyticalDate = objAnalyticData['date'];
    this.arrAnalyticalInputs = objAnalyticData['input'];
    this.strAnalyticalStartTime = this.convertToDate(objAnalyticData['cycleIndex']);
  }

  /**
   * load processed data
   * @param objProcessedData
   */
  onLoadProcessedData(objProcessedData: Object) {
    this.loadProcessedData(objProcessedData);
    this.strProcessStartTime = this.convertToDate(objProcessedData['cycleIndex']);
  }

  /**
   * load raw data
   * @param objRawData
   */
  onLoadRawData(objRawData: Object) {
    this.isCdcCalled = false;
    this.isAdcCalled = false;
    this.isFlowCalled = false;
    this.strSelectedRawKey = objRawData['key'];
    this.strSelectedRawCycle = objRawData['cycleIndex'];
    this.getRawData(objRawData['url']);
    this.strLCDChartDate = objRawData['date'];
    this.strRawStartTime = objRawData['startTimestamp'];
  }

  /**
   * get analytical data through node api
   */
  getAnalyticalFileData(strAnalyticalUrl: string) {
    this.bIsParseAnalyticData = false;
    const objPostData = {
      url: strAnalyticalUrl,
      isHeader: 'yes'
    };

    this._purehttpService.callFirebaseFunction(`${this.strFireFunctionUrl}/getCSVData`, objPostData).subscribe((res: any) => {
      this.analyticalData = res['data'];
      this.bIsParseAnalyticData = true;
      }, error => {
        console.log('Fail to getting the analytic file data.');
        console.log(error);
      });
  }

  /**
   * get raw data
   * @param strCSVUrl
   */
  getRawData(strCSVUrl: string) {
    this.bIsLoadRawData = false;
    const objPostData = {
      url: strCSVUrl,
      isHeader: 'yes'
    };

    this._purehttpService.callFirebaseFunction(`${this.strFireFunctionUrl}/getCSVData`, objPostData).subscribe((res: any) => {
      this.nSelectedChartInd = 0;
      this.rawData = res.data;
      this.bIsLoadRawData = true;
      this.checkChartElements(this.nSelectedChartInd);
    }, error => {
      this.bIsLoadRawData = true;
      console.log('Fail to getting the csv file data.');
      console.log(error);
    });
  }

  /**
   * get analytical data files
   */
  getAnalyticalData() {
    if (this.analyticalDataSub) {
      this.analyticalDataSub.unsubscribe();
    }

    // analytical data files
    this.analyticalDataSub = this._httpService
    .getAsList( `${environment['APIS']['ANAYLYTICALDATA']}/${this.sensorKey}`).subscribe((csvs) => {
      this.arrObjAnalyticList = [];
      this.arrAnalyticalCycles = [];
      this.analyticalData = [];

      if (csvs.length) {
        if (this.bIsReadAnalytic) { // readable
          this.arrObjAnalyticList = csvs.filter((item) => {
            return item['timestamp'] && item['startTimestamp'] && item['storagePath'];
          }).map((item) => {
            return {
              name: (item['storagePath'] && item['storagePath'].indexOf('/') > -1) ? item['storagePath'].split('/').pop() : '',
              url: item['storageUrl'] ? item['storageUrl'] : '',
              storageUrl: item['storagePath'] ? item['storagePath'] : '',
              date: item['timestamp'] ? this.convertToDate(item['timestamp']) : 'N/A',
              timestamp: item['timestamp'],
              key: item['key'],
              size: this.formatBytes(item['fileSize']),
              startTimestamp: this.convertToDate(item['startTimestamp']),
              cycleIndex: item['startTimestamp'],
              type: item['stepType'] ? item['stepType'] : 'N/A',
              isReaded: item['isReaded'] ? item['isReaded'] : false,
              comment: item['comment'],
              input: item['input'] ? item['input'] : []
            };
          }).sort((a, b) => {
            return parseFloat(b['timestamp']) - parseFloat(a['timestamp']);
          }).sort((a, b) => {
            return parseFloat(b['cycleIndex']) - parseFloat(a['cycleIndex']);
          });

          this.arrObjNewAnalyticalData = [];
          let nCount = 0;

          for (let i = 0; i < this.arrObjAnalyticList.length; i++) {
            if ( i === 0 || (i > 0 && this.arrObjAnalyticList[i - 1]['cycleIndex'] !== this.arrObjAnalyticList[i]['cycleIndex']) ) {
              this.arrAnalyticalCycles.push({
                cycleIndex: this.arrObjAnalyticList[i]['cycleIndex'],
                startTimestamp: this.arrObjAnalyticList[i]['startTimestamp'],
                data: [
                  this.arrObjAnalyticList[i]
                ],
                position: nCount
              });
              nCount ++;
            } else {
              this.arrAnalyticalCycles[nCount - 1]['data'].push(this.arrObjAnalyticList[i]);
            }

            if (!this.arrObjAnalyticList[i]['isReaded']) {
              this.arrObjNewAnalyticalData.push(this.arrObjAnalyticList[i]);
            }
          }

          if (this.nActionNumber === 1 && this.arrObjNewAnalyticalData.length > 0) { // check if current tab is raw data one
            this.visitAnalyticData();
          }

          if (this.arrObjAnalyticList.length > 0) {
            if (!this.strSelectedAnalyticKey) {
              this.onLoadAnalyticalData(this.arrObjAnalyticList[0]);
            } else {
              const that = this;
              const arrObjSelected = this.arrObjAnalyticList.filter(function( objItem ) {
                return objItem['key'] === that.strSelectedAnalyticKey;
              });

              if (arrObjSelected.length > 0) {
                this.onLoadAnalyticalData(arrObjSelected[0]);
              }
            }
          } else {
            this.strSelectedAnalyticKey = '';
            this.bIsParseAnalyticData = true;
          }
        }
      } else {
        this.bIsParseAnalyticData = true;
      }

      this.bIsAnalyticalData = true;
      this.initAnalyticalDataTable();
    },
    error => {
      console.log(error);
    });
  }

  initAnalyticalDataTable(nCount: number = 0) {
    if (this.nActionNumber === 1) {
      if (nCount > 50) {
        console.log('Timeout to init the analytical table, Try again.');
      } else if (!this.analyticalPaginator) {
        nCount ++;
        setTimeout(() => this.initAnalyticalDataTable(nCount), 50);
      } else {
        this.analyticalDataSource = new MatTableDataSource(this.arrAnalyticalCycles);
        this.analyticalDataSource.paginator = this.analyticalPaginator;
      }
    }
  }

  /**
   * get all data in RawData table
   */
  getAllRawData() {
    if (this.rawAllSub) {
      this.rawAllSub.unsubscribe();
    }

    // raw data files
    this.rawAllSub = this._httpService.getAsList(`${environment.APIS.RAWDATA}/${this.sensorKey}`).subscribe((csvs) => {
      this.arrObjRawFiles = [];
      this.arrObjRawCycles = [];
      this.bIsLoadRawData = false;
      this.strSelectedRawKey = '';
      this.strSelectedRawCycle = '';

      if (csvs && csvs.length) {
        if (this.bIsReadRaw) { // readable
          this.arrObjRawFiles = csvs.filter((item) => {
            return item['timestamp'] && item['startTimestamp'] && item['storagePath'];
          }).map((item) => {
            return {
              name: (item['storagePath'] && item['storagePath'].indexOf('/') > -1) ? item['storagePath'].split('/').pop() : '',
              url: item['storageUrl'] ? item['storageUrl'] : '',
              storageUrl: item['storagePath'] ? item['storagePath'] : '',
              date: item['timestamp'] ? this.convertToDate(item['timestamp']) : 'N/A',
              timestamp: item['timestamp'],
              key: item['key'],
              size: this.formatBytes(item['fileSize']),
              startTimestamp: this.convertToDate(item['startTimestamp']),
              cycleIndex: item['startTimestamp'],
              type: item['stepType'] ? item['stepType'] : 'N/A',
              isReaded: item['isReaded'] ? item['isReaded'] : false,
              comment: item['comment']
            };
          }).sort((a, b) => {
            return parseFloat(b['timestamp']) - parseFloat(a['timestamp']);
          }).sort((a, b) => {
            return parseFloat(b['cycleIndex']) - parseFloat(a['cycleIndex']);
          });

          this.arrObjNewRawData = [];
          let nCount = 0;

          for (let i = 0; i < this.arrObjRawFiles.length; i++) {
            if ( i === 0 || (i > 0 && this.arrObjRawFiles[i - 1]['cycleIndex'] !== this.arrObjRawFiles[i]['cycleIndex']) ) {
              this.arrObjRawCycles.push({
                cycleIndex: this.arrObjRawFiles[i]['cycleIndex'],
                startTimestamp: this.arrObjRawFiles[i]['startTimestamp'],
                data: [
                  this.arrObjRawFiles[i]
                ],
                position: nCount
              });
              nCount ++;
            } else {
              this.arrObjRawCycles[nCount - 1]['data'].push(this.arrObjRawFiles[i]);
            }

            if (!this.arrObjRawFiles[i]['isReaded']) {
              this.arrObjNewRawData.push(this.arrObjRawFiles[i]);
            }
          }

          if (this.nActionNumber === 2 && this.arrObjNewRawData.length > 0) { // check if current tab is raw data one
            this.visitRawData();
          }

          if (this.arrObjRawFiles.length > 0) {
            if (!this.strSelectedRawKey) {
              this.onLoadRawData(this.arrObjRawFiles[0]);
            } else {
              const that = this;
              const arrObjSelected = this.arrObjRawFiles.filter(function( objItem ) {
                return objItem['key'] === that.strSelectedRawKey;
              });

              if (arrObjSelected.length > 0) {
                this.onLoadRawData(arrObjSelected[0]);
              }
            }
          } else {
            this.bIsLoadRawData = true;
            this.strSelectedRawKey = '';
            this.strSelectedRawCycle = '';
          }
        }
      } else {
        this.bIsLoadRawData = true;
      }

      this.bIsGetAllRawData = true;
      this.initRawDataTable();
    },
    error => {
      console.log(error);
    });
  }

  initRawDataTable(nCount: number = 0) {
    if (this.nActionNumber === 2) {
      if (nCount > 50) {
        console.log('Timeout to init the raw table, Try again.');
      } else if (!this.rawPaginator) {
        nCount ++;
        setTimeout(() => this.initRawDataTable(nCount), 50);
      } else {
        this.rawDataSource = new MatTableDataSource(this.arrObjRawCycles);
        this.rawDataSource.paginator = this.rawPaginator;
      }
    }
  }

  /*
  *** get processed data files
  */
  getProcessedData() {
    if (this.processedDataSub) {
      this.processedDataSub.unsubscribe();
    }

    // processed data files
    this.processedDataSub = this._httpService.getAsList(`${environment.APIS.PROCESSEDDATA}/${this.sensorKey}`).subscribe((csvs) => {
      this.arrObjProcessedFiles = [];
      this.bIsChromatogram = false;
      this.bIsPeakLoad = false;
      this.strSelectedProcessKey = '';

      if (csvs.length) {
        if (this.bIsReadProcess) { // readable
          let nInd = 0;
          let nData = 0;

          this.arrObjProcessedFiles = csvs.filter((item) => {
            return item['startTimestamp'];
          }).sort((a, b) => {
            return parseInt(b['startTimestamp'], 10) - parseInt(a['startTimestamp'], 10);
          }).map((item) => {
            const objChromatogram = item[this.arrStrProcessedDataTypes[0]];
            const objDetectedPeaks = item[this.arrStrProcessedDataTypes[1]];
            let nStartIndex = 0;

            const objReturn = {
              cycleIndex: item['startTimestamp'],
              startTimestamp: this.convertToDate(parseInt(item['startTimestamp'], 10)),
              key: item['key'],
              isReaded: item['isReaded'] ? item['isReaded'] : false,
              comment: item['comment'],
              data: [],
              position: nData ++,
              isRunStart: false
            };

            if (objChromatogram) {
              objReturn['data'].push({
                name: (objChromatogram['storagePath'] && objChromatogram['storagePath'].indexOf('/') > -1) ?
                  objChromatogram['storagePath'].split('/').pop() : '',
                url: objChromatogram['storageUrl'],
                storageUrl: objChromatogram['storagePath'],
                date: this.convertToDate(parseInt(objChromatogram['timestamp'], 10)),
                timestamp: objChromatogram['timestamp'],
                size: this.formatBytes(objChromatogram['fileSize']),
                type: this.arrStrProcessedDataTypes[0],
                index: nInd ++,
                startIndex: nStartIndex ++
              });
            }

            if (objDetectedPeaks) {
              objReturn['data'].push({
                name: (objDetectedPeaks['storagePath'] && objDetectedPeaks['storagePath'].indexOf('/') > -1) ?
                objDetectedPeaks['storagePath'].split('/').pop() : '',
                url: objDetectedPeaks['storageUrl'],
                storageUrl: objDetectedPeaks['storagePath'],
                date: this.convertToDate(parseInt(objDetectedPeaks['timestamp'], 10)),
                timestamp: objDetectedPeaks['timestamp'],
                size: this.formatBytes(objDetectedPeaks['fileSize']),
                type: this.arrStrProcessedDataTypes[1],
                index: nInd ++,
                startIndex: nStartIndex ++
              });
            }

            return objReturn;
          });

          this.arrObjNewProcessedData = [];

          for (let i = 0; i < this.arrObjProcessedFiles.length; i++) {
            if (!this.arrObjProcessedFiles[i]['isReaded']) {
              this.arrObjNewProcessedData.push(this.arrObjProcessedFiles[i]);
            }
          }

          if (this.nActionNumber === 3 && this.arrObjNewProcessedData.length > 0) { // check if current tab is raw data one
            this.visitProcessedData();
          } else {
            if (this.arrObjProcessedFiles.length > 0) {
              if ( !this.strSelectedProcessKey) {
                this.onLoadProcessedData(this.arrObjProcessedFiles[0]);
              } else {
                const that = this;
                const arrObjSelected = this.arrObjProcessedFiles.filter(function( objItem ) {
                  return objItem['key'] === that.strSelectedProcessKey;
                });

                if (arrObjSelected.length > 0) {
                  this.onLoadProcessedData(arrObjSelected[0]);
                }
              }
            } else {
              this.bIsChromatogram = true;
              this.bIsPeakLoad = true;
              this.strSelectedProcessKey = '';
            }
          }
        }
      } else {
        this.bIsChromatogram = true;
        this.bIsPeakLoad = true;
      }

      this.bIsProcessedData = true;
      this.initProcessedDataTable();
    }, error => {
      console.log(error);
    });
  }

  initProcessedDataTable(nCount: number = 0) {
    if (this.nActionNumber === 3) {
      if (nCount > 50) {
        console.log('Timeout to init the processed table, Try again.');
      } else if (!this.processedPaginator) {
        nCount ++;
        setTimeout(() => this.initProcessedDataTable(nCount), 50);
      } else {
        this.processedDataSource = new MatTableDataSource(this.arrObjProcessedFiles);
        this.processedDataSource.paginator = this.processedPaginator;
      }
    }
  }

  /*
  *** load processed data for Chromatogram or DetectedPeaks
  */
  loadProcessedData(objProcessedData: Object) {
    this.strSelectedProcessKey = objProcessedData['key'];

    if (objProcessedData['data'] && objProcessedData['data'].length > 0) {
      for (let i = 0; i < objProcessedData['data'].length; i ++) {

        if (objProcessedData['data'][i]['type'] === this.arrStrProcessedDataTypes[0]) {// Chromatogram
          const objC = objProcessedData['data'][i];
          this.parseChromatogram(objC['url'], objC['date']);
        }

        if (objProcessedData['data'][i]['type'] === this.arrStrProcessedDataTypes[1]) {// Detected Peaks
          const objD = objProcessedData['data'][i];
          this.parsePeaks(objD['url'], objD['date']);
        }
      }
    }
  }

  ngOnChanges() {
    if (!this.sensorKey) {
      this._snackBar.open('The sensor key can\'t be empty', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });

      this._location.back();
    }

    if (!this.isTypeLoading) {
      this._spinner.start();
    }

    if (this.selectedSensor && this.selectedSensor['availability'] === this.arrStrAvailabilites[0]) { // sensor is online
      this.isOnlineDevice = true;
    } else {
      this.isOnlineDevice = false;
    }

    if (this.selectedSensor && this.selectedSensor['timestamp']) {
      this.selectedSensor['timestamp'] = this.convertToDate(this.selectedSensor['timestamp']);
    }

    if (this.sensorTypeSub) {
      this.sensorTypeSub.unsubscribe();
    }

    this.sensorTypeSub = this._httpService
      .getAsObject(`${environment.APIS.SENSORTYPES}/${this.selectedSensor.sensorTypeId}`).subscribe((sensorType) => {
      this.sensorType = sensorType;

      const arrStrCategories = global_variables['Categories'];

      for (let i = 0; i < arrStrCategories.length; i++) {
        this.getSensorParamData(arrStrCategories[i], i);
      }

      this.strSensorTypeName = this.sensorType['typeName'];

      if (this.nActionNumber === -1) {
        this.getAnalyticalData();
        this.getAllRawData();
        this.getProcessedData();
        this.changeStatus(0);

        if (!this.isTypeLoading) {
          this.isTypeLoading = true;
          this._spinner.stop();
        }
      }
    }, error => {
      console.log(error);
      this._router.navigate(['/dashboard']);
    });

    if (this.nActionNumber === -1) {
      if (this.configurationSub) {
        this.configurationSub.unsubscribe();
      }

      // if this is first load
      this.configurationSub = this._httpService.getAsObject(`${environment.APIS.SENSORCONFIGS}/${this.sensorKey}`).subscribe((config) => {
        this.orginConfigData = config;

        if (config && (config['Current_Modal_Type'] || config['Current_Modal_Type'] === 0)) {
          this.nCurrentModalType = config['Current_Modal_Type'];
          this.configData = config[config['Current_Modal_Type']];
          this.bIsProgressBar = false;
          this.bIsDoneProgress = false;
          this.buildProgressBar();
        } else {
          this.configData = null;
        }

        this.isGetConfig = true;
      }, error => {
        console.log(error);
      });
    }
  }

  getStepTime(nStep: number, nWaitTime: number, configData: any) {
    let nTime = 0;
    for (let j = 0; j < nStep; j++) {
      if (configData && configData.hasOwnProperty('Mode_Config')) {
        const strStepKey = `Step${j + 1}_Config`;
        if (configData['Mode_Config'].hasOwnProperty(strStepKey) ) {
          if (configData['Mode_Config'][strStepKey]['stepAction'] === this.arrStrStepActions[0]) {
            // measurement action
            nTime += parseInt(configData['Mode_Config'][strStepKey]['Total_Run_Time'], 10);
          }

          nTime += nWaitTime;
        }
      }
    }

    return nTime;
  }

  buildProgressBar() {
    let nRunNumber = 0;
    let nStepNumber = 0;
    let runProgressPercent = 0;
    let stepProgressPercent = 0;
    let stepTotalTime = 0;
    let runTotalTime = 0;
    let stepRemainTime = 0;
    let runRemainTime = 0;

    if (!this.configData) {
      return;
    }

    if (this.configData.hasOwnProperty('runNumber')) {
      nRunNumber = parseInt(this.configData['runNumber'], 10);
    }

    if (this.configData.hasOwnProperty('stepNumber')) {
      nStepNumber = parseInt(this.configData['stepNumber'], 10);
    }

    if (this.configData.hasOwnProperty('runProgressPercent')) {
      runProgressPercent = parseInt(this.configData['runProgressPercent'], 10);
    }

    if (this.configData.hasOwnProperty('stepProgressPercent')) {
      stepProgressPercent = parseInt(this.configData['stepProgressPercent'], 10);
    }

    if (this.configData.hasOwnProperty('stepTotalTime')) {
      stepTotalTime = parseInt(this.configData['stepTotalTime'], 10);
    }

    if (this.configData.hasOwnProperty('runTotalTime')) {
      runTotalTime = parseInt(this.configData['runTotalTime'], 10);
    }

    if (this.configData.hasOwnProperty('stepRemainTime')) {
      stepRemainTime = parseInt(this.configData['stepRemainTime'], 10);
    }

    if (this.configData.hasOwnProperty('runRemainTime')) {
      runRemainTime = parseInt(this.configData['runRemainTime'], 10);
    }

    if (this.configData.hasOwnProperty('isFinished')) {
      if (String(this.configData['isFinished']) === 'true') {
        this.bIsDoneProgress = true;
      } else {
        this.bIsDoneProgress = false;
      }
    }

    let nRunTotal = 0;
    let nStepTotal = 0;
    let configData: any;

    if (this.configData.hasOwnProperty('Current_Type') &&
      this.configData.hasOwnProperty(this.configData['Current_Type'])) {
      configData = this.configData[this.configData['Current_Type']];

      if (configData.hasOwnProperty('Num_of_Cycle')) {
        nRunTotal = parseInt(configData['Num_of_Cycle'], 10);
      }

      if (configData.hasOwnProperty('Num_of_Step')) {
        nStepTotal = parseInt(configData['Num_of_Step'], 10);
      }
    } else {
      console.log('The configuration data is not existed');
      return;
    }

    this.runProgress = {
      runTotalNumber: nRunTotal,
      runNumber: nRunNumber,
      stepNumber: nStepNumber,
      runProgressPercent: runProgressPercent,
      stepProgressPercent: stepProgressPercent,
      stepTotalTime: stepTotalTime,
      runTotalTime: runTotalTime,
      stepRemainTime: stepRemainTime,
      runRemainTime: runRemainTime
    };

    this.arrRunProgress = [];
    for (let i = 0; i < nRunTotal; i ++) {
      if ((nRunNumber - 1) > i) { // completed run case
        this.arrRunProgress.push(2);
      } else if ((nRunNumber - 1) === i) {
        this.arrRunProgress.push(1);
      } else {
        this.arrRunProgress.push(0);
      }
    }

    this.arrStepProgress = [];
    for (let j = 0; j < nStepTotal; j ++) {
      let strCategory = '';
      if (configData && configData.hasOwnProperty('Mode_Config')) {
        const strStepKey = `Step${j + 1}_Config`;
        if (configData['Mode_Config'].hasOwnProperty(strStepKey) ) {
          if (configData['Mode_Config'][strStepKey]['stepAction'] === this.arrStrStepActions[0]) {
            // measurement action
            strCategory = configData['Mode_Config'][strStepKey]['Step_Type'];
          } else {
            strCategory = configData['Mode_Config'][strStepKey]['stepAction'];
          }
        }
      }

      let status = 0;
      if ((nStepNumber - 1) > j) { // completed run case
        status = 2;
      } else if ((nStepNumber - 1) === j) {
        status = 1;
      } else {
        status = 0;
      }

      this.arrStepProgress[j] = {
        index: j + 1,
        status: status,
        categoryName: strCategory
      };
    }

    this.bIsProgressDes = true;
    this.bIsProgressBar = true;
  }

  ngOnDestroy() {
    this.destoryDynSubs();

    if (this.analyticalDataSub) {
      this.analyticalDataSub.unsubscribe();
    }

    if (this.sensorActionSub) {
      this.sensorActionSub.unsubscribe();
    }

    if (this.queryParamSub) {
      this.queryParamSub.unsubscribe();
    }

    if (this.processedDataSub) {
      this.processedDataSub.unsubscribe();
    }

    if (this.rawAllSub) {
      this.rawAllSub.unsubscribe();
    }

    if (this.sensorTypesSub) {
      this.sensorTypesSub.unsubscribe();
    }

    if (this.debugDataSub) {
      this.debugDataSub.unsubscribe();
    }

    for (let i = 0; i < 3; i++) {
      if (this.arrCategorySub[i]) {
        this.arrCategorySub[i].unsubscribe();
      }
    }
  }

  destoryDynSubs() {
    if (this.sensorTypeSub) {
      this.sensorTypeSub.unsubscribe();
    }

    if (this.configurationSub) {
      this.configurationSub.unsubscribe();
    }
  }

  onEditSensorType() {
    this.bIsSensorTypeEdit = true;
  }

  onDoneEditSensorType() {
    this.bIsSensorTypeEdit = false;
    const objUpdateVale = {
      sensorTypeId: this.strSensorTypeId
    };

    this._httpService.updateAsObject(`${environment.APIS.SENSORS}/${this.sensorKey}`, objUpdateVale)
      .then(
        res  => {
          this._snackBar.open('Sensor type update is successful!', 'Success', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        },
        error =>  console.error(error));
  }

  formatDate(data: string) {
    if (data.length === 1) {
      data = '0' + data;
    }
    return data;
  }

  convertToDate(timestamp: number) {
    const date = new Date(timestamp);
    let day = date.getDate() + '';
    let month = (date.getMonth() + 1) + '';
    let year = date.getFullYear() + '';
    let hour = date.getHours() + '';
    let minutes = date.getMinutes() + '';
    let seconds = date.getSeconds() + '';

    if (isNaN(parseInt(day, 10)) || isNaN(parseInt(month, 10)) || isNaN(parseInt(year, 10)) ||
      isNaN(parseInt(seconds, 10)) || isNaN(parseInt(minutes, 10)) || isNaN(parseInt(hour, 10))) {
      return 'N/A';
    } else {
      day     = this.formatDate(day);
      month   = this.formatDate(month);
      year    = this.formatDate(year);
      hour    = this.formatDate(hour);
      minutes = this.formatDate(minutes);
      seconds = this.formatDate(seconds);

      return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
    }
  }

  // check chart wrapper element ability
  checkChartElements(nChartEleIndex: number, nRepeatCount: number = 0) {
    const arraTabEles = [this.cdcTabElement, this.adcTabElement, this.flowTabElement];
    const selectedTabEle = arraTabEles[nChartEleIndex];

    if (nRepeatCount > 100) {
      console.log('Timeout to wait for chart body element');
    } else if (!this.chartBodyElement || !selectedTabEle) {
      nRepeatCount ++;
      setTimeout(() => this.checkChartElements(nChartEleIndex, nRepeatCount), 50);
    } else {
      const arrADCTime = [];
      const arrKp1 = [];
      const arrKp2 = [];
      const arrKp3 = [];
      const arrKp4 = [];
      const arrColumn1 = [];
      const arrColumn2 = [];
      const arrColumn3 = [];
      const arrPCF = [];
      const arrInjector = [];
      const arrThermistors1 = [];
      const arrThermistors2 = [];
      const arrThermistors3 = [];

      const arrCDCTime = [];
      const arrCapDET1 = [];
      const arrCapDET2 = [];

      const arrFlowTime = [];
      const arrFlow1 = [];
      const arrFlow2 = [];
      const arrFlow3 = [];
      let bIsThermistor = false;

      if (this.rawData) {
        for (let i = 0; i < this.rawData.length; i++) {
          const e = this.rawData[i];
          arrADCTime.push( parseFloat(e['ADC Timestamps']) );
          arrKp1.push( parseFloat(e['KP1']) < 1000 ? parseFloat(e['KP1']) : null );
          arrKp2.push( parseFloat(e['KP2']) < 1000 ? parseFloat(e['KP2']) : null );
          arrKp3.push( parseFloat(e['KP3']) < 1000 ? parseFloat(e['KP3']) : null );
          arrKp4.push( parseFloat(e['KP4']) < 1000 ? parseFloat(e['KP4']) : null );
          arrColumn1.push( parseFloat(e['Column1']) < 1000 ? parseFloat(e['Column1']) : null );
          arrColumn2.push( parseFloat(e['Column2']) < 1000 ? parseFloat(e['Column2']) : null );
          arrColumn3.push( parseFloat(e['Column3']) < 1000 ? parseFloat(e['Column3']) : null );
          arrPCF.push( parseFloat(e['PCF']) < 1000 ? parseFloat(e['PCF']) : null );
          arrInjector.push( parseFloat(e['Injector']) < 1000 ? parseFloat(e['Injector']) : null );
          if (e.hasOwnProperty('Thermistor1') && e.hasOwnProperty('Thermistor2') && e.hasOwnProperty('Thermistor3')) {
            arrThermistors1.push( parseFloat(e['Thermistor1']) < 1000 ? parseFloat(e['Thermistor1']) : null );
            arrThermistors2.push( parseFloat(e['Thermistor2']) < 1000 ? parseFloat(e['Thermistor2']) : null );
            arrThermistors3.push( parseFloat(e['Thermistor3']) < 1000 ? parseFloat(e['Thermistor3']) : null );
            bIsThermistor = true;
          }

          arrCDCTime.push( parseFloat(e['CDC Timestamps']) );
          arrCapDET1.push( parseFloat(e['CapDET1']) < 1000 ? parseFloat(e['CapDET1']) : null );
          arrCapDET2.push( parseFloat(e['CapDET2']) < 1000 ? parseFloat(e['CapDET2']) : null );

          arrFlowTime.push( parseFloat(e['Flow Timestamps']) );
          arrFlow1.push( parseFloat(e['Flow1']) < 1000 ? parseFloat(e['Flow1']) : null );
          arrFlow2.push( parseFloat(e['Flow2']) < 1000 ? parseFloat(e['Flow2']) : null );
          arrFlow3.push( parseFloat(e['Flow3']) < 1000 ? parseFloat(e['Flow3']) : null );
        }
      }

      if (!this.isCdcCalled && nChartEleIndex === 0) {
        this.buildCdcChart(arrCDCTime, arrCapDET1, arrCapDET2);
      }

      if (!this.isAdcCalled && nChartEleIndex === 1) {
        if (bIsThermistor) {
          this.buildAdcChart(
            arrADCTime,
            arrKp1,
            arrKp2,
            arrKp3,
            arrKp4,
            arrColumn1,
            arrColumn2,
            arrColumn3,
            arrPCF,
            arrInjector,
            arrThermistors1,
            arrThermistors2,
            arrThermistors3
          );
        } else {
          this.buildAdcChart(
            arrADCTime,
            arrKp1,
            arrKp2,
            arrKp3,
            arrKp4,
            arrColumn1,
            arrColumn2,
            arrColumn3,
            arrPCF,
            arrInjector
          );
        }
      }

      if (!this.isFlowCalled && nChartEleIndex === 2) {
        this.buildFlowChart(arrFlowTime, arrFlow1, arrFlow2, arrFlow3);
      }
    }
  }

  buildAdcChart(
    arrADCTime: number[],
    arrKp1: number[],
    arrKp2: number[],
    arrKp3: number[],
    arrKp4: number[],
    arrColumn1: number[],
    arrColumn2: number[],
    arrColumn3: number[],
    arrPCF: number[],
    arrInjector: number[],
    arrThermistors1: number[] = [],
    arrThermistors2: number[] = [],
    arrThermistors3: number[] = []
    ) {

    const trace1 = {
      x: arrADCTime,
      y: arrKp1,
      type: 'scatter',
      mode: 'lines',
      name: 'KP1'
    };

    const trace2 = {
      x: arrADCTime,
      y: arrKp2,
      type: 'scatter',
      mode: 'lines',
      name: 'KP2'
    };

    const trace3 = {
      x: arrADCTime,
      y: arrKp3,
      type: 'scatter',
      mode: 'lines',
      name: 'KP3',
      visible: 'legendonly'
    };

    const trace4 = {
      x: arrADCTime,
      y: arrKp4,
      type: 'scatter',
      mode: 'lines',
      name: 'KP4',
      visible: 'legendonly'
    };

    const trace5 = {
      x: arrADCTime,
      y: arrColumn1,
      type: 'scatter',
      mode: 'lines',
      name: 'Column1'
    };

    const trace6 = {
      x: arrADCTime,
      y: arrColumn2,
      type: 'scatter',
      mode: 'lines',
      name: 'Column2'
    };

    const trace7 = {
      x: arrADCTime,
      y: arrColumn3,
      type: 'scatter',
      mode: 'lines',
      name: 'Column3'
    };

    const trace8 = {
      x: arrADCTime,
      y: arrPCF,
      type: 'scatter',
      mode: 'lines',
      name: 'PCF'
    };

    const trace9 = {
      x: arrADCTime,
      y: arrInjector,
      type: 'scatter',
      mode: 'lines',
      name: 'Injector'
    };

    const trace10 = {
      x: arrADCTime,
      y: arrThermistors1,
      type: 'scatter',
      mode: 'lines',
      name: 'arrThermistors1'
    };

    const trace11 = {
      x: arrADCTime,
      y: arrThermistors2,
      type: 'scatter',
      mode: 'lines',
      name: 'arrThermistors2'
    };

    const trace12 = {
      x: arrADCTime,
      y: arrThermistors3,
      type: 'scatter',
      mode: 'lines',
      name: 'arrThermistors3'
    };

    if (arrThermistors1.length > 0 && arrThermistors2.length > 0 && arrThermistors3.length > 0) {
      this.plotlyADCData  = [trace1, trace2, trace3, trace4, trace5, trace6, trace7, trace8, trace9, trace10, trace11, trace12];
    } else {
      this.plotlyADCData  = [trace1, trace2, trace3, trace4, trace5, trace6, trace7, trace8, trace9, trace10, trace11, trace12];
    }

    this.plotlyADCStyle = {
      height: '500px',
            width: '100%'
    };
    this.plotlyADCLayout = {
      yaxis: {title: 'Temperature (°C)'},
      xaxis: {
        title: 'Time (s)'
      }
    };
    this.isAdcCalled = true;
  }

  buildCdcChart(arrCDCTime: number[],
    arrCapDET1: number[],
    arrCapDET2: number[]) {
    const trace1 = {
      x: arrCDCTime,
      y: arrCapDET1,
      type: 'scatter',
      mode: 'lines',
      name: 'CapDET1'
    };

    const trace2 = {
      x: arrCDCTime,
      y: arrCapDET2,
      type: 'scatter',
      mode: 'lines',
      name: 'CapDET2',
      visible: 'legendonly',
      marker: {
        color: 'green'
      }
    };

    this.plotlyCDCData  = [trace1, trace2];
    this.plotlyCDCStyle = {
      height: '500px',
            width: '100%'
    };
    this.plotlyCDCLayout = {
      yaxis: {title: 'Capacitance (pF)'},
      xaxis: {
        title: 'Time (s)'
      }
    };

    this.isCdcCalled = true;
  }

  buildFlowChart(arrFlowTime: number[],
    arrFlow1: number[],
    arrFlow2: number[],
    arrFlow3: number[]) {
    const trace1 = {
      x: arrFlowTime,
      y: arrFlow1,
      type: 'scatter',
      mode: 'lines',
      name: 'Flow1',
      visible: 'legendonly'
    };

    const trace2 = {
      x: arrFlowTime,
      y: arrFlow2,
      type: 'scatter',
      mode: 'lines',
      name: 'Flow2',
      marker: {
        color: 'green'
      }
    };

    const trace3 = {
      x: arrFlowTime,
      y: arrFlow3,
      type: 'scatter',
      mode: 'lines',
      name: 'Flow3',
      visible: 'legendonly',
      marker: {
        color: 'purple'
      }
    };

    this.plotlyFlowData  = [trace1, trace2, trace3];
    this.plotlyFlowStyle = {
      height: '500px',
            width: '100%'
    };
    this.plotlyFlowLayout = {
      yaxis: {title: 'Flow Rate (sccm)'},
      xaxis: {
        title: 'Time (s)'
      }
    };

      this.isFlowCalled = true;
  }

  onSelectTab(event: any) {
    this.checkChartElements(event);
  }

  /*
  get sensor params data for status, and analytical results
  *** params
  - strCategoryName: name like status, and analytical results
  - nCategory: number, 0: status, 1: analytical results
  */
  getSensorParamData(strCategoryName: string, nCategory: number) {
    // get the category name for the button clicked currently
    this.arrParams[nCategory]['types'] = this.sensorType[strCategoryName];

    if (!this.arrParams[nCategory]['types']) {
      this.arrParams[nCategory]['isSet'] = true;
      console.log('The sensor type of this sensor is not defined.');
      return;
    }

    // get the table type of the sensor type
    let tableType;
    if (this.arrParams[nCategory]['types'].hasOwnProperty('tableType')) {
      tableType = this.arrParams[nCategory]['types']['tableType'];
    } else {
      this.arrParams[nCategory]['isSet'] = true;
      console.log('The selected sensor category does not have table type property');
      return;
    }

    if (this.arrParams[nCategory]['types'].hasOwnProperty('heads')) {
      this.arrParams[nCategory]['isHeaderShow'] = true;
    } else {
      this.arrParams[nCategory]['isHeaderShow'] = false;
    }

    if (this.arrParams[nCategory]['types'].hasOwnProperty('rows')) {
      this.arrParams[nCategory]['isRowShow'] = true;
    } else {
      this.arrParams[nCategory]['isRowShow'] = false;
    }

    if (this.arrCategorySub[nCategory]) {
      this.arrCategorySub[nCategory].unsubscribe();
    }

    const categoryUrl = `${environment['APIS']['SENSORDATA']}/${strCategoryName}/${this.selectedSensor['key']}/recent`;
    this.arrCategorySub[nCategory] = this._httpService.getAsObject(categoryUrl).subscribe((data: any) => {
      if (tableType === this.arrStrTableTypes[1]) { // header_row_type
        if (data) {
          if (data.hasOwnProperty('$value') && !data['$value']) {
            this.arrParams[nCategory]['values'] = null;
          } else {
            this.arrParams[nCategory]['values'] = data['value'];
          }
        }
      } else {// header_type
        this.arrParams[nCategory]['values'] = data ? data['value'] : null;
      }

      this.arrParams[nCategory]['isRowHeader'] = true;
      this.arrParams[nCategory]['isSet'] = true;
    }, error => {
      console.log(error);
    });
  }

  /**
   * change checmical recognition parameters
   */
  onChangeChemicalParam(event: any, strRowId: string, strHeadId: string) {
    const strCategoryName = global_variables['Categories'][1];
    const categoryUrl = `${environment['APIS']['SENSORDATA']}/${strCategoryName}/${this.selectedSensor['key']}/recent/value`;
    const objUpdateVale = {
      [strHeadId]: event ? event : ''
    };

    this._httpService.updateAsObject(`${categoryUrl}/${strRowId}`, objUpdateVale)
      .then(()  => {
          this._snackBar.open('Chemical value update is successful!', 'Success', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        },
        error =>  console.error(error));
  }

  onChangeDebugParameter(event: any, strRowId: string, strHeadId: string) {
    const strCategoryName = global_variables['Categories'][2];
    const categoryUrl = `${environment['APIS']['SENSORDATA']}/${strCategoryName}/${this.selectedSensor['key']}/recent/value`;
    const objUpdateVale = {
      [strHeadId]: event
    };
    this._httpService.updateAsObject(`${categoryUrl}/${strRowId}`, objUpdateVale)
      .then(() => {
          this._snackBar.open('Debug value update is successful!', 'Success', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        }, error => console.error(error));
  }

  /*
  *** visit analytical data files
  */
  visitAnalyticData() {
    if (this.arrObjNewAnalyticalData.length > 0) {
      this.bIsReadAnalytic = false;
      const arrPromises = [];
      this._spinner.start();

      for (let i = 0; i < this.arrObjNewAnalyticalData.length; i ++) {
        const updateValue = {
          isReaded: true
        };

        const strKey = this.arrObjNewAnalyticalData[i]['key'];
        arrPromises.push(
          this._httpService.updateAsObject(`${environment['APIS']['ANAYLYTICALDATA']}/${this.sensorKey}/${strKey}`, updateValue)
            .then(() => {
              console.log('The raw data is readed: ' + `${environment['APIS']['ANAYLYTICALDATA']}/${this.sensorKey}/${strKey}`);
            }, error => console.error(error))
        );
      }

      Promise.all(arrPromises).then(() => {
        this._spinner.stop();
        console.log('All raw analytic data are read');
        this.bIsReadAnalytic = true;
        this.getAnalyticalData();
      },
      error =>  {
        console.error(error);
        this._spinner.stop();
      });
    } else {
      this.bIsReadAnalytic = true;
    }
  }

  /*
  *** visit raw data files
  */
  visitRawData() {
    if (this.arrObjNewRawData && this.arrObjNewRawData.length > 0) {
      const arrPromises = [];
      this.bIsReadRaw = false;
      this._spinner.start();

      for (let i = 0; i < this.arrObjNewRawData.length; i ++) {
        const updateValue = {
          isReaded: true
        };

        const strKey = this.arrObjNewRawData[i]['key'];
        arrPromises.push(
          this._httpService.updateAsObject(`${environment.APIS.RAWDATA}/${this.sensorKey}/${strKey}`, updateValue)
            .then(()  => {
              console.log('The raw data is readed: ' + `${environment.APIS.RAWDATA}/${this.sensorKey}/${strKey}`);
            }, error => console.error(error))
        );
      }

      Promise.all(arrPromises).then(() => {
        this._spinner.stop();
        console.log('All raw data are read');
        this.bIsReadRaw = true;
        this.getAllRawData();
      },
      error =>  {
        console.error(error);
        this._spinner.stop();
      });
    } else {
      this.bIsReadRaw = true;
    }
  }

  /*
  *** visit raw data files
  */
  visitProcessedData() {
    if (this.arrObjNewProcessedData.length > 0) {
      const arrPromises = [];
      this.bIsReadProcess = false;
      this._spinner.start();

      for (let i = 0; i < this.arrObjNewProcessedData.length; i ++) {
        const updateValue = {
          isReaded: true
        };

        const strKey = (this.arrObjNewProcessedData[i] as any).key;
        arrPromises.push(
          this._httpService.updateAsObject(`${environment.APIS.PROCESSEDDATA}/${this.sensorKey}/${strKey}`, updateValue)
            .then(
              ()  => {
                console.log('The processed data is readed: ' + `${environment.APIS.PROCESSEDDATA}/${this.sensorKey}/${strKey}`);
              },
              error =>  console.error(error))
        );
      }

      Promise.all(arrPromises).then(() => {
        this._spinner.stop();
        console.log('All processed data are read');
        this.bIsReadProcess = true;
        this.getProcessedData();
      },
      error =>  {
        console.error(error);
        this._spinner.stop();
      });
    } else {
      this.bIsReadProcess = true;
    }
  }

  changeStatus(statusIndex: number) {
    this.nActionNumber = statusIndex;

    switch (statusIndex) {
      case 0:
        break;

      case 1:
        this.visitAnalyticData();
        this.initAnalyticalDataTable();
        break;

      case 2:
        this.checkChartElements(this.nSelectedChartInd);
        this.visitRawData();
        this.initRawDataTable();
        break;

      case 3:
        this.visitProcessedData();
        this.initProcessedDataTable();
        break;

      case 4:
        this.checkChartElements(this.nSelectedChartInd);
        break;

      default:
        // code...
        break;
    }
  }

  onEditValue(index: number) {
    if ( this.strUserRole === this.arrStrUserRoles[3]) {
      this._snackBar.open('You don\'t have the edit permission.', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    } else {
      this.nStatus = index;
      this.paramValue = this.selectedSensor[this.SENSOR_MAP[index - 1]];
    }
  }

  onUpdate() {
    if ( this.strUserRole === this.arrStrUserRoles[3]) {
      this._snackBar.open('You don\'t have the edit permission.', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      return;
    }

    const strSensorUrl = environment.APIS.SENSORS;

    if (!this.paramValue) {
      this.error = 'This field is required';
      return;
    }

    this._spinner.start();
    const objUpdateValue = <any>{};
    objUpdateValue[this.SENSOR_MAP[this.nStatus - 1]] = this.paramValue;

    switch (this.nStatus) {
      case 2:
        // changing the address
        this.getLatitudeLongitude(this.showResult, this.paramValue, this);
        break;

      case 4:
        // changing the latitude
        this.getAddress(parseFloat(this.paramValue), parseFloat((this.selectedSensor as any).lng));
        break;

      case 5:
        // changing the longtitude
        this.getAddress(parseFloat((this.selectedSensor as any).lat), parseFloat(this.paramValue));
        break;

      case 7:
        // changing serial number
        this._httpService.getListByOrder(strSensorUrl, this.SENSOR_MAP[this.nStatus - 1], this.paramValue, 1).subscribe((sensors) => {
          if (sensors && sensors.length > 0) {
            this._snackBar.open('This serial number is already existed.', 'Exist', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
            this._spinner.stop();
          } else {
            this._httpService.updateAsObject(`${strSensorUrl}/${this.selectedSensor['key']}`, objUpdateValue)
              .then(() => {
                this._spinner.stop();
                this.clearEdit();
                this._snackBar.open('The serial number updates successful!', 'Success', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
              }, error => {
                this._spinner.stop();
                this._snackBar.open('Firebase Error!', 'Error', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
                console.error(error);
               });
          }
        });
        break;

      default:
        this._httpService.updateAsObject(`${strSensorUrl}/${this.selectedSensor['key']}`, objUpdateValue)
          .then(()  => {
            this._spinner.stop();
            this.clearEdit();
            this._snackBar.open('The sensor param updated successful!', 'Success', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          }, error => {
            this._spinner.stop();
            this._snackBar.open('Firebase Error!', 'Error', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
            console.error(error);
          });
        break;
    }
  }

  cancel() {
    this.clearEdit();
  }

  clearEdit() {
    this.nStatus = 0;
    this.paramValue = '';
    this.error = '';
  }

  showResult(result: any, strAddress: string, that: any) {
    let lat = result.geometry.location.lat();
    let lng = result.geometry.location.lng();
    lat = lat.toFixed(6);
    lng = lng.toFixed(6);

    // update latitude
    const objUpdateValue: Object = {
      lat: lat,
      lng: lng,
      address: strAddress
    };
    // update the lat/lng and address
    that._httpService.updateAsObject(`${environment.APIS.SENSORS}/${that.selectedSensor['key']}`, objUpdateValue)
      .then(() => {
        that._spinner.stop();
        that.clearEdit();
        that._snackBar.open('The address updates successful!', 'Success', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }, error => {
        that._spinner.stop();
        that._snackBar.open('Firebase Error', 'Error', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        console.error(error);
      });
  }

  getLatitudeLongitude(callback, strAddress: string, that: any) {
    if (strAddress && strAddress !== '') {
      // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
      strAddress = strAddress || 'Ferrol, Galicia, Spain';
      // Initialize the Geocoder
      if (that.geocoder) {
        that.geocoder = new google.maps.Geocoder();
        that.geocoder.geocode({
          'address': strAddress
        }, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            callback(results[0], strAddress, that);
          }
        });
      }
    } else {
      console.log('Address is required.');
    }
  }

  getAddress(lat: number, lng: number) {
    if (this.geocoder) {
      this.geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(lat, lng);
      const request = {latLng: latlng};

      this.geocoder.geocode(request, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const result = results[0];
          if (result !== null) {
            const objUpdateValue: Object = {
              lat: lat,
              lng: lng,
              address: result.formatted_address
            };

            this._httpService.updateAsObject(`${environment.APIS.SENSORS}/${this.selectedSensor['key']}`, objUpdateValue)
              .then(() => {
                this._spinner.stop();
                this.clearEdit();
                this._snackBar.open('The address param updates successful!', 'Success', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
              }, error => {
                this._spinner.stop();
                this._snackBar.open('Firebase Error', 'Error', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center'
                });
                console.error(error);
              });
          } else {
            this._spinner.stop();
            this._snackBar.open('Invalid latitude or longitude', 'Error', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          }
        }
      });
    }
  }

  /**
  status - 0:online, 1:config, 2:start, 3:stop, 4:reboot, 5: debug, 6:shutdown
  **/
  controlSensorDevice(status: number) {
    if (this.strUserRole === this.arrStrUserRoles[3]) { // user's role is viewer
      this._nofication.createNotification('error', 'Permission Denied', 'You don\'t have a permission.');
      return;
    }

    if (status === -1) {
      this._router.navigate(['/configure', this.sensorKey]);
    } else if (status === 1) {
      const config = {
        width: '560px',
        disableClose: true,
        data: {
          sensor: this.selectedSensor,
          configData: this.orginConfigData
        }
      };
      const dialogRef = this.dialog.open(ConfigModalComponent, config);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this._httpService.postAsObject(`${environment['APIS']['SENSORCONFIGS']}/${this.sensorKey}`, {
            Current_Modal_Type: result['modalType'],
            File_Name: result['fileName'] ? result['fileName'] : ''
          }).then(() => {
            console.log('Modal type update is successful!');
          }, error => console.error(error));

          this._httpService.postAsObject(`${environment['APIS']['SENSORCONFIGS']}/${this.sensorKey}/${result['modalType']}`, result['data'])
            .then(() => {
              this.updateSensorDevice(status);
              console.log('The sensor is configured successfully.');
            }, error => console.error(error));
        }
      });
    } else {
      if (status === 0 || status === 5) {
        this.updateSensorDevice(status);
      } else {
        let strActionName = '';
        switch (status) {
          case 2:
            strActionName = 'start this run';
            break;

          case 3:
            strActionName = 'stop this run';
            break;

          case 4:
            strActionName = 'reboot';
            break;

          case 6:
            strActionName = 'shut down';
            break;
        }
        const config = {
          disableClose: true,
          data: {
            title: 'Confirmation',
            description: `Are you sure to ${strActionName}?`
          }
        };
        const dialogRef = this.dialog.open(ConfirmModalComponent, config);
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if (status === 2) {
              this._httpService.updateAsObject(`${environment['APIS']['SENSORCONFIGS']}/${this.sensorKey}/${this.nCurrentModalType}`, {
                isFinished: false,
                runNumber: 0,
                runProgressPercent: 0,
                runRemainTime: 0,
                stepNumber: 0,
                stepProgressPercent: 0,
                stepRemainTime: 0
              }).then(() => {
                this.updateSensorDevice(status);
              }, error =>  console.error(error));
            } else {
              this.updateSensorDevice(status);
            }
          }
        });
      }
    }
  }

  // update sensorDevice status
  updateSensorDevice(status: number) {
    const resVal = Math.random().toString(36).slice(-5);

    this._httpService.updateAsObject(`${environment['APIS']['SENSORDEVICES']}/${this.sensorKey}`, {
      resVal: resVal
    }).then(() => {
      console.log('Ping to node.js server');
      this.responseValue = '';
      this.checkSensorDeviceResponse(status);
    }, error =>  console.error(error));
  }

  // check real sensor device response
  checkSensorDeviceResponse(status: number) {
    const sensorDevicUrl = environment.APIS.SENSORDEVICES;

    this._httpService.updateAsObject(`${sensorDevicUrl}/${this.sensorKey}`, {
      actionStatus: status
    }).then(() => {
      console.log('The sensor device status is changed.');
      this._spinner.start();
      setTimeout(() => this.watchSensorDeviceResponse(), 5000);

      this._httpService.getAsObject(`${sensorDevicUrl}/${this.sensorKey}/resVal`, 2).subscribe((res) => {
        this.responseValue = res['$value'];
        this.responseValue = this.responseValue.toString();

        if (this.responseValue === global_variables['sensorResponse']) {
          console.log('Response from node.js server');
          this._spinner.stop();

          if (!this.isOnlineDevice) {
            this._httpService.updateAsObject(`${sensorDevicUrl}/${this.sensorKey}`, {
              actionStatus: 0
            }).then(() => {
              this._nofication.createNotification('info', 'Status', 'Sensor device is now online');
            }, error => console.error(error));
          } else {
            this._nofication.createNotification('success', 'Status', 'This action is correctly applied.');
          }
        }
      }, error => console.log(error));
    }, error => console.error(error));
  }

  watchSensorDeviceResponse() {
    if (this.responseValue !== global_variables['sensorResponse']) {
      console.log('No response from node.js server!');
      this._nofication.createNotification('info', 'Sensor Device', 'Sensor device isn\'t running at a moment');

      // set action status to 0, none
      this._httpService.updateAsObject(`${environment.APIS.SENSORDEVICES}/${this.sensorKey}`, { actionStatus: 0 })
        .then(() => {
          console.log('The sensor device is set to none');
          this._spinner.stop();
        }, error => console.error(error));

      // set sensor availability to offline
      this._httpService.updateAsObject(`${environment.APIS.SENSORS}/${this.sensorKey}`, { availability: this.arrStrAvailabilites[1] })
        .then(() => {
          console.log('The sensor availability is set to offline');
          this._spinner.stop();
        }, error => console.error(error));
    }
  }

  onDeleteAnalyticalData(objAnalyticalData: Object) {
    this.strSelectedAnalyticKey = objAnalyticalData['key'];
    const config = {
      disableClose: true,
      data: {
        title: 'Delete',
        description: 'Are you sure to delete the analytical data file?'
      }
    };
    const dialogRef = this.dialog.open(ConfirmModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const strStorageUrl = objAnalyticalData['storageUrl'];
        // delete the analytic file from storage
        this.deleteStorageFile(strStorageUrl);

        const strAnalyticUrl = `${environment['APIS']['ANAYLYTICALDATA']}/${this.sensorKey}/${objAnalyticalData['key']}`;

        this._httpService.deleteAsObject(strAnalyticUrl)
          .then(() => {
            this.strSelectedAnalyticKey = '';
            console.log('Successfully delete analytic database: ' + strAnalyticUrl);
            this._snackBar.open('Analytical Data file delete successfully!', 'Success', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          }, error => {
            console.log('Fail to delete analytic database: ' + strAnalyticUrl);
            console.error(error);
          });
      }
    });
  }

  onDeleteRawData(objRawData: Object) {
    this.strSelectedRawKey = objRawData['key'];
    this.strSelectedRawCycle = objRawData['cycleIndex'];
    const config = {
      disableClose: true,
      data: {
        title: 'Delete',
        description: 'Are you sure to delete the raw data files?'
      }
    };
    const dialogRef = this.dialog.open(ConfirmModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const strStorageUrl = objRawData['storageUrl'];
        // delete the raw file from storage
        this.deleteStorageFile(strStorageUrl);

        const strRawUrl = `${environment['APIS']['RAWDATA']}/${this.sensorKey}/${objRawData['key']}`;

        this._httpService.deleteAsObject(strRawUrl)
          .then(() => {
            this.strSelectedRawKey = '';
            this.strSelectedRawCycle = '';
            console.log('Successfully delete raw database: ' + strRawUrl);
            this._snackBar.open('Raw Data files delete successfully!', 'Success', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          }, error =>  {
            this._snackBar.open('When deleting the raw data, some error occurred', 'Error', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
            console.log('Fail to delete raw database: ' + strRawUrl);
            console.error(error);
          });
      }
    });
  }

  buildProcessChart(arrTime: number[], arrValues: number[]) {
    this.arrPlotyChromatogramData  = [];

    if (arrTime.length > 0 && arrValues.length > 0) {
      const trace1 = {
        x: arrTime,
        y: arrValues,
        type: 'scatter',
        mode: 'lines',
        name: 'Processed Data'
      };

      this.arrPlotyChromatogramData  = [trace1];
      this.plotlyProcessStyle = {
        height: '500px',
        width: '100%'
      };
      this.plotlyProcessLayout = {
        xaxis: {
          title: 'Time (s)'
        },
        yaxis: {
          title: '∆C (fF)'
        }
      };
    }

    if ((<HTMLInputElement>document.getElementById('result_file_upload'))) {
      (<HTMLInputElement>document.getElementById('result_file_upload')).value = '';
    }
  }

  /*
  *** parse Chromatogram of processed data
  */
  parseChromatogram(strUrl: string, strDate: string) {
    if (!strUrl) {
      this.bIsChromatogram = true;
      return;
    }

    this.bIsChromatogram = false;
    this.strChromatogramTime = strDate;

    const objPostData = {
      url: strUrl,
      isHeader: 'no'
    };

    this._purehttpService.callFirebaseFunction(`${this.strFireFunctionUrl}/getCSVData`, objPostData).subscribe((res: any) => {
      const data = res.data;
      const arrTime = [];
      const arrValues = [];

      if (data && data.length) {
        for (let i = 0; i < data.length; i++) {
          arrTime.push( parseFloat(data[i][1]) );
          arrValues.push( parseFloat(data[i][2]) );
        }
      }

      this.buildProcessChart(arrTime, arrValues);
      this.bIsChromatogram = true;
    }, error => {
      console.log('Fail to getting the csv file data.');
      console.log(error);
      this.bIsChromatogram = true;
    });
  }

  /*
  *** parse Detected Peaks of processed data
  */
  parsePeaks(strUrl: string, strDate: string) {
    if (!strUrl) {
      this.bIsPeakLoad = true;
      return;
    }

    this.bIsPeakLoad = false;
    this.strPeakTime = strDate;

    const objPostData = {
      url: strUrl,
      isHeader: 'no'
    };

    this._purehttpService.callFirebaseFunction(`${this.strFireFunctionUrl}/getCSVData`, objPostData).subscribe((res: any) => {
      const rules = res.data;

      if (rules && rules.length) {
        this.arrStrPeakValues = [];
        this.arrStrPeakHeaders = rules[0];
        for (let i = 1; i < rules.length; i++) {
          const rowData = [];
          for (let j = 0; j < rules[i].length; j++) {
            rowData.push(parseFloat(rules[i][j]).toFixed(2));
          }

          this.arrStrPeakValues.push(rowData);
        }
      } else {
        this.arrStrPeakValues = [];
        this.arrStrPeakHeaders = [];
      }

      this.bIsPeakLoad = true;
    }, error => {
      console.log('Fail to getting Detected Peaks file data.');
      console.log(error);
    });
  }

  // delete the file from storage
  deleteStorageFile(strStorageUrl: string) {
    this.storage.ref(strStorageUrl).delete().take(1).subscribe(() => {
      // File deleted successfully
      console.log('Successfully delete the storage file: ' + strStorageUrl);
    }, err => {
      // Uh-oh, an error occurred!
      console.log('Fail to delete the storage file: ' + strStorageUrl);
      console.log(err);
    });
  }

  /*
  *** delete processed data for Chromatogram or DetectedPeaks
  */
  deleteProcessedData(objProcessedData: Object) {
    if (!objProcessedData) {
      console.log('The processed data is not existed.');
      return;
    }

    this.strSelectedProcessKey = objProcessedData['key'];

    for (let i = 0; i < objProcessedData['data'].length; i ++) {
      const objC = objProcessedData['data'][ i ];
      this.deleteStorageFile(objC['storageUrl']);
    }

    // delete the info in database
    const strDBUrl =  `${environment.APIS.PROCESSEDDATA}/${this.sensorKey}/${objProcessedData['key']}`;

    this._httpService.deleteAsObject(strDBUrl)
      .then(()  => {
        console.log('Successfully delete the info: ' + strDBUrl);
        this._snackBar.open('Processed Data files delete successfully!', 'Success', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.strSelectedProcessKey = '';
      }, error =>  {
        console.log('Fail to delete the info: ' + strDBUrl);
        console.error(error);
      });
  }

  onDeleteProcessedData(objProcessedData: Object) {
    const config = {
      disableClose: true,
      data: {
        title: 'Delete',
        description: 'Are you sure to delete the processed data files?'
      }
    };
    const dialogRef = this.dialog.open(ConfirmModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProcessedData(objProcessedData);
      }
    });
  }

  downloadFile(data: any, strName: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    if (strName.split('.').pop() === 'gz') {
      strName = strName.replace(strName.substr(strName.lastIndexOf('.')), '');
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', strName);
    link.click();
  }

  onDownloadFile(strUri: string, strName: string) {
    const objPostData = {
      url: strUri
    };

    this._purehttpService.callFirebaseFunction(`${this.strFireFunctionUrl}/getData`, objPostData).subscribe((res: any) => {
      const data = res.data;
      this.downloadFile(data, strName);
    }, error => {
      console.log('Fail to get the data to download.');
      console.log(error);
    });
  }

  onUpdateAnalyticComment(event: Object) {
    if (event.hasOwnProperty('comment') && (event as any).key) {
      const objUpdateVale = {
        comment: (event as any).comment
      };

      this._httpService.updateAsObject(`${environment.APIS.ANAYLYTICALDATA}/${this.sensorKey}/${(event as any).key}`, objUpdateVale)
        .then(() => {
          this._snackBar.open('The analytical comment update is successful!', 'Success', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
        });
      }, error => console.error(error));
    } else {
      console.log('The comment or key is empty');
    }
  }

  onUpdateRawComment(event: Object) {
    if (event.hasOwnProperty('comment') && event['key']) {
      const objUpdateVale = {
        comment: (event as any).comment
      };

      this._httpService.updateAsObject(`${environment['APIS']['RAWDATA']}/${this.sensorKey}/${(event as any).key}`, objUpdateVale)
        .then(()  => {
          this._snackBar.open('The raw comment update is successful!', 'Success', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        },
        error =>  console.error(error));
    } else {
      console.log('The comment or key is empty');
    }
  }

  onUpdateProcessComment(event: Object) {
    if (event.hasOwnProperty('comment') && event['key']) {
      const objUpdateVale = {
        comment: (event as any).comment
      };

      this._httpService.updateAsObject(`${environment.APIS.PROCESSEDDATA}/${this.sensorKey}/${(event as any).key}`, objUpdateVale)
        .then(()  => {
          this._snackBar.open('The processed data comment update is successful!', 'Success', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        },
        error =>  console.error(error));
    } else {
      console.log('The comment or key is empty');
    }
  }

  onUpdateAnalyticInput(event: any, nInd: number) {
    if (!this.arrAnalyticalInputs[nInd]) {
      this.arrAnalyticalInputs[nInd] = <any>{};
      this.arrAnalyticalInputs[nInd][event.key] = event.comment;
    } else {
      if (!this.arrAnalyticalInputs[nInd]) {
        this.arrAnalyticalInputs[nInd] = <any>{};
        this.arrAnalyticalInputs[nInd][event.key] = event.comment;
      } else {
        this.arrAnalyticalInputs[nInd][event.key] = event.comment;
      }
    }

    const objUpdateVal = {
      input : this.arrAnalyticalInputs
    };

    this._httpService
      .updateAsObject(`${environment['APIS']['ANAYLYTICALDATA']}/${this.sensorKey}/${this.strSelectedAnalyticKey}`, objUpdateVal)
      .then(() => {
        console.log('Sensor device resVal field is set to default status');
      }, error =>  console.error(error));
  }

  debugTask() {
    if (this.nActionStatus !==  2 && this.isOnlineDevice) { // status is not inprogress
      this.updateSensorDevice(5);
    }
  }
}
