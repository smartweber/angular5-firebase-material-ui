import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Location } from '@angular/common';
import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {
  MatSnackBar
} from '@angular/material';
import { environment } from '../../../environments/environment.dev';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { database } from 'firebase';

@Component({
  selector: 'app-create-zone',
  templateUrl: './create-zone.component.html',
  styleUrls: ['./create-zone.component.scss']
})

export class CreateZoneComponent implements OnInit {
  @Input() customerId: string;
  @Input() createName: string;

  model: Object;
  isCreateZone: boolean;
  uid: string;

  arrStrCreateNames: string[];
  arrStrCriticalities: string[];

  zoneForm: FormGroup;

  formErrors: Object;

  validationMessages = {
    'name': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name can not be more that 24 characters long.'
    },
    'criticality': {
      'required': 'Criticality is required.'
    }
  };

  constructor(
    private _httpService: HttpService,
    private _authService: AuthService,
    public _snackBar: MatSnackBar,
    private _router: Router,
    private _location: Location
    ) {
    this.uid = null;
    this.isCreateZone = false;

    this.arrStrCreateNames = ['customer', 'zone'];
    this.arrStrCriticalities = ['high', 'medium', 'low'];
  }

  init() {
    this.uid = this._authService.currentUserId;

    this.formErrors = {
      name: '',
      criticality: ''
    };

    this.model = {
      name: '',
      description: '',
      color: '',
      criticality: '',
      customerId: this.customerId
    };

    this.zoneForm = new FormGroup({
      name: new FormControl(this.model['name'], [
        <any>Validators.required,
        <any>Validators.minLength(2),
        <any>Validators.maxLength(25)
      ]),
      criticality: new FormControl(this.model['criticality'], [
        <any>Validators.required
      ]),
      description: new FormControl()
    });

    this.zoneForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  ngOnInit() {
    this.init();
  }

  // check the validation
  onValueChanged(data?: any) {
    if (!this.zoneForm) { return; }

    const form = this.zoneForm;
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

  onCreateZone() {
    if (this.zoneForm.valid) {
      this.isCreateZone = true;

      this.model = {
        name: this.zoneForm.value.name,
        description: this.zoneForm.value.description,
        criticality: this.zoneForm.value.criticality,
        color: this.makeRandomColor(),
        customerId: this.customerId,
        timestamp: database.ServerValue.TIMESTAMP
      };

      this._httpService.createAsList(environment.APIS.ZONES, this.model)
        .then(() => {
          this._snackBar.open('New Zone creation is successful!', 'Success', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          if (this.createName === this.arrStrCreateNames[0]) {
            this._router.navigate(['/customer'], { queryParams: {type: 'list', customerId: this.customerId} });
          } else {
            this._router.navigate(['/zone'], { queryParams: {type: 'list'} });
          }
          this.zoneForm.reset();
          this.isCreateZone = false;
        },
        error =>  {
          this._snackBar.open('Network connection error', 'Error', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          console.error(error);
          this.isCreateZone = false;
        });
    } else {
      console.log('The form is invalid');
    }
  }

  onBack() {
    this._location.back();
  }
}
