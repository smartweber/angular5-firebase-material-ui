import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment.dev';
import { global_variables } from '../../environments/global_variables';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
    MatSnackBar
} from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent implements OnInit, OnDestroy {
  configurationSub: Subscription;
  paramSub: Subscription;
  bIsLoadData: boolean;
  strCurrentDataType: string;
  strConfigurationFileName: string;
  strCurrentUserType: string;

  arrBIsConfig: boolean[];
  arrStrStepActions: string[];
  arrStrUserTypes: string[];
  arrStrDataTypes: string[];
  arrObjConfigData: Object[];
  arrObjTKeyTable: Object[];

  nModalType: number;

  constructor(
    private _httpService: HttpService,
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _location: Location
  ) {
    this.nModalType = -1;
    this.bIsLoadData = false;
    this.arrStrStepActions = global_variables['stepActions'];
    this.arrStrDataTypes = global_variables['DataTypes'];
    this.arrStrUserTypes = global_variables['userTypes'];
    this.arrBIsConfig = [];
    this.arrObjConfigData = [];
    this.arrObjTKeyTable = [];
    this.strConfigurationFileName = '';
  }

  /*
  *** make the configuration table to display
  */
  setConfigData(objConfigData: Object, nDataType: number) {
    const strDataType = this.arrStrDataTypes[nDataType];
    this.strCurrentDataType = strDataType;

    this.arrObjConfigData[nDataType]['Num_of_Step'] = objConfigData[strDataType]['Num_of_Step'];
    this.arrObjConfigData[nDataType]['Num_of_Cycle'] = objConfigData[strDataType]['Num_of_Cycle'];
    this.arrObjConfigData[nDataType]['Sampling_Time'] = objConfigData[strDataType]['Sampling_Time'];
    this.arrObjConfigData[nDataType]['Idle_Time'] = objConfigData[strDataType]['Idle_Time'];
    const data = [];

    for (let i = 1; i <= parseInt(this.arrObjConfigData[nDataType]['Num_of_Step'], 10); i++) {
      const stepKey = `Step${i}_Config`;
      if (objConfigData[strDataType]['Mode_Config']) {
        data.push(objConfigData[strDataType]['Mode_Config'][stepKey]);
      }
    }

    this.arrObjConfigData[nDataType]['data'] = data;
    this.arrBIsConfig[nDataType] = true;
  }

  ngOnInit() {
    if (this._authService.isUserEmailLoggedIn && this._authService.currentUserId) {
      if (this._authService.isUserStaff) { // staff
        this.strCurrentUserType = this.arrStrUserTypes[0];
      } else { // customer
        this.strCurrentUserType = this.arrStrUserTypes[1];
      }

      this.arrObjTKeyTable = [
        {
          headers: ['tIdle', 'tTarget', 't1', 't2', 't3'],
          rows: ['KP1', 'KP3', 'PCF', 'Injector', 'Column1', 'Column2', 'Column3']
        },
        {
          headers: ['tIdle', 'tTarget', 't1', 't2', 't3'],
          rows: ['KP1', 'KP2', 'KP3', 'KP4', 'PCF', 'Injector', 'Column1', 'Column2', 'Column3']
        },
        {
          headers: ['tIdle', 'tTarget', 't1', 't2', 't3'],
          rows: ['KP1', 'KP3', 'PCF', 'Injector', 'Column1', 'Column2', 'Column3']
        }
      ];

      this.paramSub = this._route.params.subscribe(params => {
        const sensorKey = params['sensorKey'];
        if (this.configurationSub) {
          this.configurationSub.unsubscribe();
        }

        this.configurationSub = this._httpService
        .getAsObject(`${environment.APIS.SENSORCONFIGS}/${sensorKey}`).subscribe((config: Object) => {
          this.arrBIsConfig = [];
          this.arrObjConfigData = [];

          if (config && config['Current_Modal_Type'] !== null) {
            this.nModalType = config['Current_Modal_Type'];
            const configData = config[config['Current_Modal_Type']];
            for (let i = 0; i < this.arrStrDataTypes.length; i++) {
              this.arrObjConfigData[i] = <any>{};
              this.arrBIsConfig[i] = false;

              if (configData && configData.hasOwnProperty(this.arrStrDataTypes[i])) {
                this.setConfigData(configData, i);
              }
            }
          }

          if (this.nModalType === 1) {
            const forDeletion = ['KP3', 'Injector'];
            for (let i = 0; i < this.arrObjTKeyTable.length; i ++) {

              this.arrObjTKeyTable[i]['rows'] = this.arrObjTKeyTable[i]['rows'].filter(item => !forDeletion.includes(item));

            }
          }

          this.strConfigurationFileName = config['File_Name'];
          this.bIsLoadData = true;
        }, error => {
          console.log(error);
        });
      });
    } else {
      this._snackBar.open('You don\'t have right permission.', 'Alert', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      this._router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy() {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }

    if (this.configurationSub) {
      this.configurationSub.unsubscribe();
    }
  }

  onBack() {
    this._location.back();
  }

}

