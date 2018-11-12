import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  Router
} from '@angular/router';
import { Location } from '@angular/common';
import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {
  MatSnackBar,
  MatDialog
} from '@angular/material';
import { environment } from '../../../environments/environment.dev';
import { HttpService } from '../../services/http.service';
import { AlertModalComponent } from '../../modals/alert-modal/alert-modal.component';
import { AngularFireStorage } from 'angularfire2/storage';
import { database } from 'firebase';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit, OnDestroy {
  model: Object;
  customerPortalValue: Object;

  isCreateCustomer: boolean;
  isUploadOption: boolean; // true: upload with url, false: upload with file

  pathNames: string[];
  preDefinedNames: string[];
  arrStringIndustries: string[];

  portalSub: any;
  customerForm: FormGroup;
  formErrors: Object;

  validationMessages = {
    'name': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name can not be more that 24 characters long.'
    },
    'address': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name can not be more that 24 characters long.'
    },
    'path': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name can not be more that 24 characters long.'
    }
  };

  constructor(
    private _httpService: HttpService,
    public _router: Router,
    public _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _location: Location,
    private storage: AngularFireStorage
  ) {
    this.isCreateCustomer = false;
    this.isUploadOption = true;
    this.pathNames = [];
    this.preDefinedNames = ['create'];
    this.arrStringIndustries = [
      'Air Quality Mg',
      'Law enforcement',
      'Instrumentation',
      'PetroChemical ',
      'Military '
    ];

    this.model = {
      name: '',
      address: '',
      industry: '',
      email: '',
      date: '',
      logo: '',
      path: '',
      contact1: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
      },
      contact2: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
      },
      emergencyContact: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
      },
      color: ''
    };
  }

  ngOnInit() {
    // get all customers' uids
    this.portalSub = this._httpService.getAsList(environment.APIS.CUSTOMERPORTALS).subscribe(CustomerPortals => {
      if (CustomerPortals) {
        this.pathNames = CustomerPortals.map(element => {
          return element.path;
        });
      }
    }, error => {
      console.log(error);
    });

    this.initForm();
  }

  ngOnDestroy() {
    if (this.portalSub) {
      this.portalSub.unsubscribe();
    }
  }

  initForm() {
    this.formErrors = {
      name: '',
      industry: '',
      address: '',
      path: ''
    };

    this.customerForm = new FormGroup({
      name: new FormControl('', [
        <any>Validators.required,
        <any>Validators.minLength(2),
        <any>Validators.maxLength(25)
      ]),
      industry: new FormControl(this.arrStringIndustries[0], [
        <any>Validators.required
      ]),
      address: new FormControl('', [
        <any>Validators.required,
        <any>Validators.minLength(2),
        <any>Validators.maxLength(25)
      ]),
      path: new FormControl('', [
        <any>Validators.required,
        <any>Validators.minLength(2),
        <any>Validators.maxLength(25)
      ]),
      uploadOption: new FormControl(0),
      logo: new FormControl(),
      email: new FormControl(),
      date: new FormControl(),
      c1FirstName: new FormControl(),
      c1LastName: new FormControl(),
      c1Email: new FormControl(),
      c1PhoneNumber: new FormControl(),
      c2FirstName: new FormControl(),
      c2LastName: new FormControl(),
      c2Email: new FormControl(),
      c2PhoneNumber: new FormControl(),
      eFirstName: new FormControl(),
      eLastName: new FormControl(),
      eEmail: new FormControl(),
      ePhoneNumber: new FormControl()
    });

    this.customerForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  // check the validation
  onValueChanged(data?: any) {
    if (!this.customerForm) { return; }

    const form = this.customerForm;
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

  // generate random color
  makeRandomColor() {
    return '#' + Math.random().toString(16).slice(-6);
  }

  save() {
    if (this.customerForm.valid) {
      this.model = {
        name: this.customerForm.value.name,
        industry: this.customerForm.value.industry,
        address: this.customerForm.value.address,
        email: this.customerForm.value.email,
        date: this.customerForm.value.date,
        logo: this.customerForm.value.logo,
        path: this.customerForm.value.path,
        contact1: {
          firstName: this.customerForm.value.c1FirstName,
          lastName: this.customerForm.value.c1LastName,
          email: this.customerForm.value.c1Email,
          phoneNumber: this.customerForm.value.c1PhoneNumber
        },
        contact2: {
          firstName: this.customerForm.value.c2FirstName,
          lastName: this.customerForm.value.c2LastName,
          email: this.customerForm.value.c2Email,
          phoneNumber: this.customerForm.value.c2PhoneNumber
        },
        emergencyContact: {
          firstName: this.customerForm.value.eFirstName,
          lastName: this.customerForm.value.eLastName,
          email: this.customerForm.value.eEmail,
          phoneNumber: this.customerForm.value.ePhoneNumber
        },
        color: ''
      };

      const path = this.customerForm.value.path;
      if (this.pathNames.indexOf(path) > -1) {
        (this.model as any).path = '';
        this._snackBar.open('The customer site name is existed. Please choose another one.', 'Availibility', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        return;
      } else if (this.preDefinedNames.indexOf(path) > -1) {
        this.model['path'] = '';
        this._snackBar.open('You can\'t use the \'create\', please select another one.', 'Availibility', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        return;
      }

      this.isCreateCustomer = true;

      if (this.customerForm.value.uploadOption === 1) {
        this.createNewCustomer();
      } else {
        this.upload();
      }
    } else {
      console.log('Invalid form');
    }
  }

  createNewCustomer() {
    return new Promise<any>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.customerPortalValue = {
          'logo': this.model['logo'],
          'name': this.model['name'],
          'path': this.model['path']
        };

        this.model['color'] = this.makeRandomColor();
        this.model['timestamp'] = database.ServerValue.TIMESTAMP;
        delete this.model['path'];
        delete this.model['logo'];

        this._httpService.createAsList(environment.APIS.CUSTOMERS, this.model)
          .then(key  => {
            resolve(this.createPortal(key));
          }, reject
        );
      };

      img.onerror = () => {

        this.isCreateCustomer = false;
        const config = {
          width: '400px',
          disableClose: true,
          data: {
            title: 'Alert',
            description: 'Invalid logo image url.'
          }
        };
        this.dialog.open(AlertModalComponent, config);
        reject('Invalid logo image url');
      };

      img.src = this.model['logo'];
    });
  }

  createPortal(strKey: string) {
    return this._httpService.postAsObject(`${environment.APIS.CUSTOMERPORTALS}/${strKey}`, this.customerPortalValue)
      .then(()  => {
        this._snackBar.open('New customer creation is successful!', 'Success', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.isCreateCustomer = false;
        this.initForm();
        this._router.navigate(['/customer'], { queryParams: {type: 'list'} });
      },
      error => {
        this.isCreateCustomer = false;
        console.log(error);
      });
  }

  upload() {
    const fileID = 'logo_file_upload';
    const fileFolder = environment.Upload.logoFolder;
    const fileUploadEle = <HTMLInputElement>document.getElementById(fileID);
    if (!fileUploadEle ||
      (fileUploadEle && fileUploadEle.value === '')) {
      const config = {
        width: '400px',
        disableClose: true,
        data: {
          title: 'Alert',
          description: 'Please select logo image.'
        }
      };
      this.dialog.open(AlertModalComponent, config);
      this.isCreateCustomer = false;
    } else {
      // This currently only grabs item 0, TODO refactor it to grab them all
      for (const selectedFile of [(<HTMLInputElement>document.getElementById(fileID)).files[0]]) {
        // Make local copies of services because "this" will be clobbered
        const timestamp = new Date().getTime().toString();
        const filename = timestamp + '_' + selectedFile.name;
        const task = this.storage.upload(`/${fileFolder}/${filename}`, selectedFile);
        console.log('Uploaded a blob or file! Now storing the reference at' , `/${fileFolder}/images/`);
        task.downloadURL().take(1).subscribe(url => {
          this.model['logo'] = url;
          console.log(this.model);
          this.createNewCustomer();
        });
      }
    }
  }

  onBack() {
    this._location.back();
  }
}
