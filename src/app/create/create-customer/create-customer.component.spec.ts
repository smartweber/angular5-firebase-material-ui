/* tslint:disable:no-unused-variable */
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  Router
} from '@angular/router';
import {
  MatSnackBar,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatRadioModule,
  MatInputModule,
  MatProgressBarModule,
  MatDialogModule,
  MatIconModule
} from '@angular/material';
import { Location } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpService } from '../../services/http.service';
import { CreateCustomerComponent } from './create-customer.component';

// describe('CreateCustomerComponent', () => {
//   let component: CreateCustomerComponent;
//   let fixture: ComponentFixture<CreateCustomerComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         CreateCustomerComponent
//       ],
//       providers: [
//         { provide: HttpService, useClass: HttpServiceMock },
//         { provide: Router, useValue: {navigate: jasmine.createSpy('navigate')} },
//         { provide: MatSnackBar, useClass: MockSnackModal },
//         { provide: Location, useValue: { back: function() {return true;}} }
//       ],
//       imports: [
//         FormsModule,
//         ReactiveFormsModule,
//         MatCardModule,
//         MatFormFieldModule,
//         MatSelectModule,
//         MatRadioModule,
//         MatInputModule,
//         BrowserAnimationsModule,
//         MatProgressBarModule,
//         MatDialogModule,
//         MatIconModule
//       ]
//     })
//     .compileComponents()
//     .then(() => {
//       fixture = TestBed.createComponent(CreateCustomerComponent);
//       component = fixture.componentInstance;
//     });
//   }));

//   it('#should get all customers at first', async(() => {
//     spyOn(component, 'initForm');
//     let mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//     spyOn(mockHttpService, 'getAsList').and.callThrough();
//     mockHttpService.returnValue = null;
//     component.ngOnInit();
//     expect(component.initForm).toHaveBeenCalled();
//   }));

//   it('#should create forms by initForm function', async(() => {
//     component.initForm();
//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       expect(component.customerForm).toBeDefined();
//     });
//   }));

//   it("#'s form validation should work by onValueChanged function", async(() => {
//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       let nameInput = fixture.debugElement.query(By.css('form input[placeholder="Name *"]')).nativeElement;
//       nameInput.value = 'a';
//       nameInput.dispatchEvent(new Event('input'));
//       expect(component.formErrors['name']).toContain(component.validationMessages['name']['minlength']);
//       expect(component.formErrors['address']).toBe('');
//     });
//   }));

//   it('#should call the createNewCustomer function by save function', async(() => {
//     spyOn(component, 'createNewCustomer');
//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       component.customerForm.controls['name'].setValue('new customer');
//       component.customerForm.controls['industry'].setValue('new industry');
//       component.customerForm.controls['address'].setValue('usa');
//       component.customerForm.controls['email'].setValue('new@gmail.com');
//       component.customerForm.controls['date'].setValue('new date');
//       component.customerForm.controls['logo'].setValue('a.com/logo.png');
//       component.customerForm.controls['c1FirstName'].setValue('new c1FirstName');
//       component.customerForm.controls['c1LastName'].setValue('new c1LastName');
//       component.customerForm.controls['c1Email'].setValue('new c1Email');
//       component.customerForm.controls['c1PhoneNumber'].setValue('new c1PhoneNumber');
//       component.customerForm.controls['c2FirstName'].setValue('new c2FirstName');
//       component.customerForm.controls['c2LastName'].setValue('new c2LastName');
//       component.customerForm.controls['c2Email'].setValue('new c2Email');
//       component.customerForm.controls['c2PhoneNumber'].setValue('new c2PhoneNumber');
//       component.customerForm.controls['eFirstName'].setValue('new eFirstName');
//       component.customerForm.controls['eLastName'].setValue('new eLastName');
//       component.customerForm.controls['eEmail'].setValue('new eEmail');
//       component.customerForm.controls['ePhoneNumber'].setValue('new ePhoneNumber');
//       component.save();
//       expect(component.createNewCustomer).toHaveBeenCalled;
//     });
//   }));

//   it('#should create new customer by createNewCustomer function', (done) => {
//     spyOn((component as any).dialog, 'open');
//     spyOn(component, 'createPortal');
//     fixture.detectChanges();

//     fixture.whenStable().then(() => {
//       component.model = {
//         logo: 'logo',
//         name: 'name',
//         path: 'customerpath'
//       };
//       component.createNewCustomer()
//         .then(() => {
//           expect(component.createPortal).toHaveBeenCalled();
//           done();
//         })
//         .catch(() => {
//           expect((component as any).dialog.open).toHaveBeenCalled();
//           done();
//         });
//     });
//   });

//   it('#should create the new customer data to the firebase by createPortal function', async(() => {
//     spyOn(component, 'initForm');
//     component.customerPortalValue = {
//       logo: 'logo',
//       name: 'name',
//       path: 'customerpath'
//     };
//     component.createPortal('-key');

//     fixture.whenStable().then(() => {
//       expect(component.isCreateCustomer).toBeFalsy();
//       expect(component.initForm).toHaveBeenCalled();
//       expect(component._router.navigate).toHaveBeenCalled();
//     });
//   }));
// });

// class HttpServiceMock {
//   returnValue: any;

//   getAsObject(strUrl: string, nTake: number = 0):Observable<any> {
//     return Observable.of(this.returnValue);
//   }

//   getAsList(strUrl: string, nTake: number = 0) {
//     return Observable.of(this.returnValue);
//   }

//   createAsList(strUrl: string, objModel: Object) {
//     return Promise.resolve({key: 'customerkey'});
//   }

//   postAsObject(strUrl: string, value: any):Promise<any> {
//     return Promise.resolve(true);
//   }
// }

// class MockSnackModal {
//   open(des: string, title: string, config: Object) {
//     return true;
//   }
// }
/** wrote in 2018/3/30 */
/** update in 2018/8/10 */
