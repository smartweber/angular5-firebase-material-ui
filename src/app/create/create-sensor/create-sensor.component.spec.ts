/* tslint:disable:no-unused-variable */
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatSnackBar,
  MatFormFieldModule,
  MatSelectModule,
  MatCardModule,
  MatInputModule,
  MatRadioModule,
  MatProgressBarModule,
  MatDialogModule,
  MatIconModule
} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../../../environments/environment.dev';
import { HttpService } from '../../services/http.service';
import { SpinnerService } from '../../components/spinner/spinner.service';
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { Location } from '@angular/common';
import { global_variables } from '../../../environments/global_variables';
import { CreateSensorComponent } from './create-sensor.component';
declare var google: any;

// describe('CreateSensorComponent', () => {
//   let component: CreateSensorComponent;
//   let fixture: ComponentFixture<CreateSensorComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         CreateSensorComponent
//       ],
//       providers: [
//         SpinnerService,
//         { provide: MatSnackBar, useClass: MockSnackModal },
//         { provide: HttpService, useClass: HttpServiceMock },
//         { provide: Router, useValue: {navigate: jasmine.createSpy('navigate')} },
//         { provide: Location, useValue: { back: function() { return true; }} }
//       ],
//       imports: [
//         FormsModule,
//         ReactiveFormsModule,
//         MatFormFieldModule,
//         MatSelectModule,
//         MatRadioModule,
//         MatCardModule,
//         MatInputModule,
//         BrowserAnimationsModule,
//         AgmCoreModule.forRoot({
//           apiKey: 'AIzaSyBGH1Lmb_8OPJnadWq39AUglhyULkY8HZU'
//         }),
//         AngularFireModule.initializeApp(global_variables.firebase),
//         MatProgressBarModule,
//         MatDialogModule,
//         MatIconModule
//       ]
//     })
//     .compileComponents()
//     .then(() => {
//       fixture = TestBed.createComponent(CreateSensorComponent);
//       component = fixture.componentInstance;
//     });
//   }));

//   it('#should call the initForm and initData function via refreshing browser', async(() => {
//     spyOn(component, 'initForm');
//     spyOn(component, 'initData');
//     component.ngOnInit();
//     expect(component.initForm).toHaveBeenCalled();
//     expect(component.initData).toHaveBeenCalled();
//   }));

//   it('#should create forms by initForm function', async(() => {
//     spyOn(component, 'initData');
//     component.initForm();
//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       expect(component.sensorForm).toBeDefined();
//     });
//   }));

//   it('#\'s form validation should work by onValueChanged function', async(() => {
//     spyOn(component, 'initData');
//     component.initForm();
//     component.isGettingData = true;
//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       const nameInput = fixture.debugElement.query(By.css('form input[placeholder="Name *"]'));
//       nameInput.nativeElement.value = 'a';
//       nameInput.nativeElement.dispatchEvent(new Event('input'));
//       expect(component.formErrors['name']).toContain(component.validationMessages['name']['minlength']);
//     });
//   }));

//   it('#should call the createNewCustomer function by onSave function', async(() => {
//     spyOn(component, 'initData');
//     spyOn(component, 'createNewSensor');
//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       component.sensorForm.controls['name'].setValue('new customer');
//       component.sensorForm.controls['description'].setValue('new industry');
//       component.sensorForm.controls['address'].setValue('usa');
//       component.sensorForm.controls['lat'].setValue(37);
//       component.sensorForm.controls['lng'].setValue(-23);
//       component.sensorForm.controls['type'].setValue('new type');
//       component.sensorForm.controls['serialNumber'].setValue('123');
//       component.sensorForm.controls['situation'].setValue(0);
//       fixture.detectChanges();
//       component.onSave();
//       expect(component.createNewSensor).toHaveBeenCalled();
//     });
//   }));

//   it('#should create new sensor by createNewSensor function', fakeAsync(() => {
//     spyOn(component, 'initForm');
//     component.model = {
//       serialNumber: 123
//     };
//     component.createNewSensor();
//     tick();
//     expect(component.initForm).toHaveBeenCalled();
//   }));
// });

// class HttpServiceMock {
//   returnValue: any;

//   getListByOrder(strUrl: string, strOrder: string, strEqual: string, nTake: number = 0) {
//     return Observable.of(this.returnValue);
//   }

//   getAsList(strUrl: string, nTake: number = 0) {
//     return Observable.of(this.returnValue);
//   }

//   createAsList(strUrl: string, objModel: Object) {
//     return Promise.resolve({key: 'customerkey'});
//   }

//   updateAsObject(strUrl: string, model: any): Promise<any> {
//     return Promise.resolve(true);
//   }
// }

// class MockSnackModal {
//   open(des: string, title: string, config: Object) {
//     return true;
//   }
// }
/**
 * wrote in 2018/3/30
 * update in 2018/8/15
 * */
