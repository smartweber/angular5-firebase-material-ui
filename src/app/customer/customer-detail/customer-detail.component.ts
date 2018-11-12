import { Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Location } from '@angular/common';
import {
  MatDialog
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment.dev';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs/Subscription';
import { AlertModalComponent } from '../../modals/alert-modal/alert-modal.component';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit, OnDestroy {

  bIsPageLoading: boolean;
  bIsEditable: boolean;
  bIsPortalLoading: boolean;
  bIsInProgress: boolean;
  bIsUploadWithUrl: boolean;

  status: number;

  error: string;
  userRole: string;
  paramValue: string;

  currentCustomer: Object;
  customerPortal: Object;
  paramObject: Object;

  customerSub: Subscription;
  portalSub: Subscription;

  PARAM_MAP = [
    ['name'],
    ['industry'],
    ['address'],
    ['email'],
    ['color'],
    ['date'],
    ['contact1', 'firstName'],
    ['contact1', 'lastName'],
    ['contact1', 'email'],
    ['contact1', 'phoneNumber'],
    ['contact2', 'firstName'],
    ['contact2', 'lastName'],
    ['contact2', 'email'],
    ['contact2', 'phoneNumber'],
    ['emergencyContact', 'firstName'],
    ['emergencyContact', 'lastName'],
    ['emergencyContact', 'email'],
    ['emergencyContact', 'phoneNumber']
  ];

  PORTAL_PARAM_MAP = [
    'name',
    'logo',
    'path'
  ];

  INDUSTRY_OPTIONS = [
    'Air Quality Mg',
    'Law enforcement',
    'Instrumentation',
    'PetroChemical ',
    'Military '
  ];

  @ViewChild('logoArea') logoArea: ElementRef;

  constructor(
    private _httpService: HttpService,
    private _authService: AuthService,
    private _activeRoute: ActivatedRoute,
    private _nofication: NotificationService,
    private dialog: MatDialog,
    private _location: Location,
    private storage: AngularFireStorage
  ) {
    this.status = 0; // 0: none, 1>: edit
    this.bIsUploadWithUrl = false; // upload the logo with the file
    this.bIsEditable = false;
    this.bIsPortalLoading = false;
    this.bIsInProgress = false;
    this.paramValue = '';
  }

  ngOnInit() {
    this._activeRoute.params.subscribe(params => {
      const customerKey = params['id'];
      this.customerSub = this._httpService.getAsObject(`${environment['APIS']['CUSTOMERS']}/${customerKey}`).subscribe(customer => {
        this.currentCustomer = customer;
        this.bIsPageLoading = true;
      },
      error => {
        console.log(error);
      });

      this.portalSub = this._httpService
      .getAsObject(`${environment['APIS']['CUSTOMERPORTALS']}/${customerKey}`).subscribe(customerPortal => {
        this.customerPortal = customerPortal;
        this.bIsPortalLoading = true;
      },
      error => {
        console.log(error);
      });
    });

    if (this._authService.isCheckUser && this._authService.isUserEmailLoggedIn) { // user already login
      this.checkUserRole();
    }
  }

  ngOnDestroy() {
    if (this.customerSub) {
      this.customerSub.unsubscribe();
    }

    if (this.portalSub) {
      this.portalSub.unsubscribe();
    }
  }

  checkUserRole() {
    const userData = this._authService.userData;
    this.userRole = userData['action']['role'];

    if (this.userRole === 'admin') {
      this.bIsEditable = true;
    } else {
      this.bIsEditable = false;
    }
  }

  getCurrentTime() {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    let currentDay, d, m, yy;

    yy = yyyy.toString();
    d = dd.toString();
    m = mm.toString();

    if (dd < 10) {
        d = '0' + dd.toString();
    }

    if (mm < 10) {
        m = '0' + mm.toString();
    }

    currentDay = m + '/' + d + '/' + yy;
    return currentDay;
  }

  /*
  update the values
  1: name
  2: industry
  3: address
  4: email
  5: color
  6: date
  7: contact1 first name
  8: contact1 last name
  9: contact1 email
  10: contact1 phone number
  11: contact2 first name
  12: contact2 last name
  13: contact2 email
  14: contact2 phone number
  15: emergency contact first name
  16: emergency contact last name
  17: emergency contact email
  18: emergency contact phone number
  */

  editValue(index: number) {
    this.status = index;

    if (this.status < 19) {
      if (this.PARAM_MAP[this.status - 1].length === 1) {
        this.paramValue = this.currentCustomer[this.PARAM_MAP[this.status - 1][0]];
      } else {
        if (this.currentCustomer[this.PARAM_MAP[this.status - 1][0]]) {
          this.paramValue = this.currentCustomer[this.PARAM_MAP[this.status - 1][0]][this.PARAM_MAP[this.status - 1][1]];
        } else {
          this.paramValue = '';
        }
      }
    } else {
      this.paramValue = this.customerPortal[this.PORTAL_PARAM_MAP[this.status - 18]];
    }
  }

  // update the value
  update() {
    const strCustomerUrl = environment['APIS']['CUSTOMERS'];
    const updateValue = <any>{};

    if (this.PARAM_MAP[this.status - 1].length === 1) {
      updateValue[this.PARAM_MAP[this.status - 1][0]] = this.paramValue;

      this._httpService.updateAsObject(`${strCustomerUrl}/${this.currentCustomer['key']}`, updateValue)
        .then(()  => {
          this.clearEdit();
          this._nofication.createNotification('success', 'Update', 'The customer parameter update is successful!');
        }, error => console.error(error));

        if (this.status === 1) {
          this.updateCustomerPortal(0);
        }
    } else {
      const objectKey = this.PARAM_MAP[this.status - 1][0];
      updateValue[this.PARAM_MAP[this.status - 1][1]] = this.paramValue;

      this._httpService.updateAsObject(`${strCustomerUrl}/${(this.currentCustomer as any).key}/${objectKey}`, updateValue)
        .then(() => {
          this.clearEdit();
          this._nofication.createNotification('success', 'Update', 'The customer parameter update is successful!');
        }, error =>  console.error(error));
    }
  }

  updatePortal() {
    this.bIsInProgress = true;

    if (this.status === 19) { // upload logo
      if (this.bIsUploadWithUrl) { // upload with the url
        this.updateCustomerPortal(1);
      } else { // upload with the file
        this.upload();
      }
    } else if (this.status === 20) {
      this.updateCustomerPortal(2);
    } else {
      this.bIsInProgress = false;
    }
  }

  updateCustomerPortal(index: number) {
    const portalValue = <any>{};
    portalValue[this.PORTAL_PARAM_MAP[index]] = this.paramValue;

    if (index === 2) { // portal path
      this._httpService.getListByOrder(
        environment['APIS']['CUSTOMERPORTALS'],
        'path',
        this.paramValue,
        1
      ).subscribe((customerPaths) => {
        if (customerPaths && customerPaths.length > 0) {
          this._nofication.createNotification('alert', 'Alert', 'The portal path is already existed.');
          this.bIsInProgress = false;
        } else {
          this.updateCustomerPortalItem(portalValue);
        }
      });
    } else {
      this.updateCustomerPortalItem(portalValue);
    }
  }

  updateCustomerPortalItem(itemValue: any) {
    this._httpService.updateAsObject(`${environment['APIS']['CUSTOMERPORTALS']}/${this.currentCustomer['key']}`, itemValue)
      .then(()  => {
        this.clearEdit();
        this._nofication.createNotification('success', 'Update', 'The portal param updated successful!');
      }, error => {
        console.error(error);
        this.clearEdit();
      });
  }

  // cancel to edit
  cancel() {
    this.clearEdit();
  }

  clearEdit() {
    this.status = 0;
    this.paramValue = '';
    this.error = '';
    this.bIsInProgress = false;
  }

  onChangeIndustry(value: string) {
    this.paramValue = value;
  }

  upload() {
    const fileID = 'logo_file_upload';
    const fileFolder = environment['Upload']['logoFolder'];
    if ((<HTMLInputElement>document.getElementById(fileID)).value === '') {
      const config = {
        width: '400px',
        disableClose: true,
        data: {
          title: 'Alert',
          description: 'Please select upload file.'
        }
      };
      const dialogRef = this.dialog.open(AlertModalComponent, config);

      dialogRef.afterClosed().subscribe(result => {
        this.bIsInProgress = false;
      });
    } else {
      // This currently only grabs item 0, TODO refactor it to grab them all
      for (const selectedFile of [(<HTMLInputElement>document.getElementById(fileID)).files[0]]) {
        // Make local copies of services because "this" will be clobbered
        const timestamp = new Date().getTime().toString();
        let filename;
        filename = timestamp + '_' + selectedFile.name;
        const task = this.storage.upload(`/${fileFolder}/${filename}`, selectedFile);
        console.log('Uploaded a blob or file! Now storing the reference at' , `/${fileFolder}/images/`);
        task.downloadURL().take(1).subscribe(url => {
          this.paramValue = url;
          this.updateCustomerPortal(1);
        });
      }
    }
  }

  onBack() {
    this._location.back();
  }

}
