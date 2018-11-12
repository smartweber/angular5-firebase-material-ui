import { Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  Router
} from '@angular/router';
import { FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import {
  MatDialog,
  MatSnackBar
} from '@angular/material';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';
import { HttpService } from '../../services/http.service';
import { ConfirmModalComponent } from '../../modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-sensor-type-category',
  templateUrl: './sensor-type-category.component.html',
  styleUrls: ['./sensor-type-category.component.scss']
})
export class SensorTypeCategoryComponent implements OnInit, OnChanges {
  @Input() sensorType: Object;
  @Input() categoryType: number;
  @Input() isCreatable: boolean;
  @Input() selectedSensorTypeKey: string;
  @Input() sensorTypeName: string;

  rowForm: FormGroup;
  headerForm: FormGroup;

  @Output() updateTableTypeEmit = new EventEmitter();
  @Output() createRowParamEmit = new EventEmitter();
  @Output() createHeaderParamEmit = new EventEmitter();
  @Output() updateRowParamEmit = new EventEmitter();
  @Output() updateHeaderParamEmit = new EventEmitter();
  @Output() gotoSensorTypeInfoEmit = new EventEmitter();

  isSelectType: boolean;
  isHeaderRowType: boolean;
  isCreateNewRow: boolean;
  isCreateNewHeader: boolean;
  isCreateStatus: boolean;

  tableType: string;
  typeStatus: string;

  nSelectedRowParamId: number;
  nSelectedHeadParamId: number;

  formErrors: Object;
  headerModel: Object;
  rowModel: Object;
  relevantSensors: Object[];
  tableTypes: string[];

  PARAM_TYPE = ['option', 'number', 'text', 'time'];

  validationMessages = {
    'name': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name can not be more that 24 characters long.'
    }
  };

  constructor(
    private _httpService: HttpService,
    private _router: Router,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar
  ) {
    this.isSelectType = false;
    this.isCreateNewRow = false;
    this.isCreateNewHeader = false;
    this.isCreateStatus = false;
    this.tableTypes = global_variables['tableTypes'];
    this.tableType = this.tableTypes[0];
    this.isHeaderRowType = false;

    this.nSelectedRowParamId = -1;
    this.nSelectedHeadParamId = -1;

    this.headerModel = {};
    this.rowModel = {};
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.checkTypeStatus();
  }

  // init FormGroup
  initFormGroup() {
    // header Form Group
      this.headerForm = new FormGroup({
          name: new FormControl((this.headerModel as any).name, [
              <any>Validators.required,
              <any>Validators.minLength(2),
              <any>Validators.maxLength(50)
            ])
      });

      this.headerForm.valueChanges.subscribe(data => this.onHeaderValueChanged(data));

    // row Form Group
      this.rowForm = new FormGroup({
        name: new FormControl(this.rowModel['name'], [
          <any>Validators.required,
          <any>Validators.minLength(2),
          <any>Validators.maxLength(50)
        ]),
        unit: new FormControl(this.rowModel['defaultValue']),
        type: new FormControl(this.rowModel['type'], <any>Validators.required)
      });

      this.rowForm.valueChanges.subscribe(data => this.onRowValueChanged(data));
  }

  // check the validation
  onRowValueChanged(data?: any) {
    if (!this.rowForm) { return; }

    const form = this.rowForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onTypeChange(event: any) {
    this.typeStatus = event;
  }

  // check the validation
  onHeaderValueChanged(data?: any) {
    if (!this.headerForm) { return; }

    const form = this.headerForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  // init model
  initModel() {
    this.formErrors = {
      name: ''
    };

    this.headerModel = {
      name: '',
      id: ''
    };

    this.rowModel = {
      name: '',
      type: this.PARAM_TYPE[1],
      defaultValue: '',
      id: ''
    };
  }

  // check if the type is not defined yet
  checkTypeStatus() {
    this.initModel();
    this.initFormGroup();
    this.clearShowForm();
    this.getSensors();
    const type = this.sensorType ? (this.sensorType as any).tableType : '';
    if (!type || type === '') {
      this.isSelectType = true;
    } else {
      this.isSelectType = false;
      if (type === this.tableTypes[1]) {
        this.isHeaderRowType = true;

        if ((this.sensorType as any).rows && (this.sensorType as any).rows.length > 0) {
          (this.sensorType as any).rows = (this.sensorType as any).rows.map(item => {
            item.detail = item.valueType;
            if (item.valueType === this.PARAM_TYPE[0]) {
              item.detail = '';

              if (item.defaultValue) {
                item.detail = item.defaultValue.join('/');
              }
            }
            return item;
          });
        }
      } else {
        this.isHeaderRowType = false;
      }
    }
  }

  // get sensors with the sensortype
  getSensors() {
    if (this.selectedSensorTypeKey) {
      this._httpService.getListByOrder(environment.APIS.SENSORS, 'sensorTypeId', this.selectedSensorTypeKey, 1).subscribe((sensors) => {
        this.relevantSensors = sensors;
      },
      error => {
        console.log(error);
      });
    }
  }

  // update table type
  updateTableType() {
    this.updateTableTypeEmit.emit(this.tableType);
  }

  clearShowForm() {
    this.isCreateNewHeader = false;
    this.isCreateNewRow = false;
  }

  // an => A: alpha flag, an => N: numeric flag
  randomString(len: number, an: string = null) {
    return Math.random().toString(36).substring(len);
  }

  // pop up confirm modal
  confirmSensorModal() {
    let alert = '<div class="description">You should delete all these sensors. The sensors are related to this sensor type.</div>';
      alert += '<table class="table table-bordered"><thead><tr><th>Customer</th><th>Zone</th><th>Sensor</th></tr></thead><tbody>';
    for (let i = 0; i < this.relevantSensors.length; i++) {
      const sensorItem = this.relevantSensors[i];
      const item = `<tr><td>${(sensorItem as any).customerId}</td><td>${(sensorItem as any).zoneId}</td><td>${sensorItem['key']}</td></tr>`;
      alert += item;
    }
    alert += '</tbody></table>';

    const config = {
      disableClose: true,
      data: {
        title: 'Delete',
        description: alert
      }
    };
    const dialogRef = this.dialog.open(ConfirmModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._router.navigate(['/customer']);
      }
    });
  }

  /*
  *** header form action
  */
  // show header param form
  showHeaderParam() {
    this.initModel();
    this.initFormGroup();
    this.clearShowForm();
    this.isCreateNewHeader = true;
    this.isCreateStatus = true;
  }

  // close header param form
  closeHeaderForm() {
    this.isCreateNewHeader = false;
  }

  // edit header param form
  editHeaderParams(index: number) {
    this.showHeaderParam();
    const head = (this.sensorType as any).heads[index];
    this.headerModel = {
      name: (head as any).name,
      id: (head as any).id
    };

    this.initFormGroup();
    this.isCreateStatus = false;
  }

  /**
   * check the duplicated header parameters when updating header parameter
   */
  checkDuplicatedHeaderParameters() {
    if (this.sensorType['heads']) {
      const existedHeaderNames = this.sensorType['heads']
        .filter(item => {
          return item['id'] !== this.headerModel['id'];
        })
        .map(item => item.name);

      if (existedHeaderNames.indexOf(this.headerForm.value['name']) > -1) {
        return true;
      }
    }

    return false;
  }

  // create new header params
  submitHeaderParam() {
    if (this.headerForm.valid) {
      if (this.checkDuplicatedHeaderParameters()) {
        this._snackBar.open('The parameter is already existed', 'Alert', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        return;
      }

      if (this.isCreateStatus) {
        if (this.sensorType.hasOwnProperty('heads') && this.sensorType['heads'].length > 0) { // if primary key is existed
          this.createHeaderParamEmit.emit({
            name: this.headerForm.value.name,
            id: this.randomString(10)
          });
        } else { // primary key
          this.createHeaderParamEmit.emit({
            name: this.headerForm.value.name,
            id: this.randomString(10),
            primaryKey: true
          });
        }
      } else {
        (this.sensorType as any).heads[this.nSelectedHeadParamId].name = this.headerForm.value.name;
        (this.sensorType as any).heads[this.nSelectedHeadParamId].id = (this.headerModel as any).id;
        this.updateHeaderParamEmit.emit({data: (this.sensorType as any).heads,
          isDelete: false});
        this.checkTypeStatus();
      }

      this.isCreateNewHeader = false;
    } else {
      this._snackBar.open('Invalid form', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }

  }

  /*
  *** show row param form
  */
  showRowParam() {
    this.initModel();
    this.initFormGroup();
    this.clearShowForm();
    this.isCreateNewRow = true;
    this.isCreateStatus = true;
    this.typeStatus = '';
  }

  // close row form
  closeRowForm() {
    this.isCreateNewRow = false;
  }

  // edit row param form
  editRowParams(index: number) {
    this.showRowParam();
    this.isCreateStatus = false;
    const row = this.sensorType['rows'][index];

    if (row['valueType'] === this.PARAM_TYPE[0]) {
      this.rowModel = {
        name: row['name'],
        type: row['valueType'],
        defaultValue: row['defaultValue'].join(','),
        id: row['id']
      };
    } else {
      this.rowModel = {
        name: row['name'],
        type: row['valueType'],
        id: row['id']
      };
    }

    this.initFormGroup();
    this.typeStatus = this.rowModel['type'];
  }

  /**
   * check the duplicated row parameters when updating row parameter
   */
  checkDuplicatedRowParameters() {
    if (this.sensorType['rows']) {
      const existedRowNames = this.sensorType['rows']
        .filter(item => {
          return item['id'] !== this.rowModel['id'];
        })
        .map(item => item.name);

      if (existedRowNames.indexOf(this.rowForm.value['name']) > -1) {
        return true;
      }
    }

    return false;
  }

  // create new row params
  submitRowParam() {
    if (this.rowForm.valid) {
      if (this.checkDuplicatedRowParameters()) {
        this._snackBar.open('The parameter is already existed', 'Alert', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        return;
      }

      if (this.isCreateStatus) {
        if (this.rowForm.value.type === this.PARAM_TYPE[0]) {
          if (this.rowForm.value.unit) {
            const optionValueArray = this.rowForm.value.unit.split(',');
            let strAlert = 'The units will consist of ';
            strAlert += optionValueArray;
            strAlert += ';\n Is it ok?';

            const config = {
              disableClose: true,
              data: {
                title: 'Create',
                description: strAlert
              }
            };
            const dialogRef = this.dialog.open(ConfirmModalComponent, config);

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.createRowParamEmit.emit({
                  name: this.rowForm.value.name,
                  valueType: this.rowForm.value.type,
                  defaultValue: optionValueArray,
                  id: this.randomString(10)
                });

                this.isCreateNewRow = false;
              } else {
                return;
              }
            });
          } else {
            this._snackBar.open('Unit can\'t be empty', 'Error', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
            return;
          }
        } else {
          this.createRowParamEmit.emit({
            name: this.rowForm.value.name,
            valueType: this.rowForm.value.type,
            id: this.randomString(10)
          });

          this.isCreateNewRow = false;
        }
      } else {
        if (this.rowForm.value.type === this.PARAM_TYPE[0]) {
          if (this.rowForm.value.unit) {
            let optionValueArray = this.rowForm.value.unit.split(',');
            optionValueArray = optionValueArray.map((s) => s.trim());
            let strAlert = 'The units will consist of ';
            strAlert += optionValueArray;
            strAlert += ';\n Is it ok?';

            const config = {
              disableClose: true,
              data: {
                title: 'Update',
                description: strAlert
              }
            };
            const dialogRef = this.dialog.open(ConfirmModalComponent, config);

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.sensorType['rows'][this.nSelectedRowParamId]['name'] = this.rowForm.value.name;
                this.sensorType['rows'][this.nSelectedRowParamId]['valueType'] = this.rowForm.value.type;
                this.sensorType['rows'][this.nSelectedRowParamId]['defaultValue'] = optionValueArray;
                this.sensorType['rows'][this.nSelectedRowParamId]['id'] = this.rowModel['id'];
                this.updateRowParamEmit.emit({
                  data: this.sensorType['rows'],
                  isDelete: false
                });
                this.checkTypeStatus();
                this.isCreateNewRow = false;
              } else {
                return;
              }
            });
          } else {
            this._snackBar.open('Unit can\'t be empty', 'Error', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
            return;
          }
        } else {
          (this.sensorType as any).rows[this.nSelectedRowParamId].name = this.rowForm.value.name;
          (this.sensorType as any).rows[this.nSelectedRowParamId].valueType = this.rowForm.value.type;
          (this.sensorType as any).rows[this.nSelectedRowParamId].id = this.rowModel['id'];
          this.updateRowParamEmit.emit({data: (this.sensorType as any).rows,
            isDelete: false});
          this.checkTypeStatus();
          this.isCreateNewRow = false;
        }
      }
    } else {
      this._snackBar.open('Invalid form', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }
  }

  onChangeType(value: string) {
    this.typeStatus = value;
  }

  selectRowSensorType(index: number) {
    this.nSelectedHeadParamId = -1;
    this.nSelectedRowParamId = index;
  }

  selectHeadSensorType(index: number) {
    this.nSelectedRowParamId = -1;
    this.nSelectedHeadParamId = index;
  }

  deleteHeaderParams(index: number) {
    this.updateHeaderParamEmit.emit({data: (this.sensorType as any).heads,
      isDelete: true,
      deleteId: index
    });
  }

  deleteRowParams(index: number) {
    this.updateRowParamEmit.emit({data: (this.sensorType as any).rows,
      isDelete: true,
      deleteId: index
    });
  }

  gotoSensorInfo($event: any) {
    $event.preventDefault();
    this.gotoSensorTypeInfoEmit.emit();
  }
}
