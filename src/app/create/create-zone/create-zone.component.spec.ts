/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
import { AuthService } from '../../services/auth.service';
import { CreateZoneComponent } from './create-zone.component';

// describe('CreateCustomerComponent', () => {
//   let component: CreateZoneComponent;
//   let fixture: ComponentFixture<CreateZoneComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         CreateZoneComponent
//       ],
//       providers: [
//         { provide: Router, useValue: {navigate: jasmine.createSpy('navigate')} },
//         { provide: MatSnackBar, useClass: MockSnackModal },
//         { provide: HttpService, useClass: HttpServiceMock },
//         { provide: AuthService, useClass: AuthServiceMock },
//         { provide: Location, useValue: { back: function() { return true; }} }
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
//       fixture = TestBed.createComponent(CreateZoneComponent);
//       component = fixture.componentInstance;
//     });
//   }));

//   it('#should call init function via browser refresh', async(() => {
//     spyOn(component, 'init');
//     component.ngOnInit();
//     expect(component.init).toHaveBeenCalled();
//   }));

//   it('#should create zone form by init function', async(() => {
//     component.init();
//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       expect(component.zoneForm).toBeDefined();
//     });
//   }));

//   it('#\'s form validation should work by onValueChanged function', async(() => {
//     fixture.detectChanges();

//     fixture.whenStable().then(() => {
//       const nameInput = fixture.debugElement.query(By.css('form input[placeholder="Name *"]'));
//       nameInput.nativeElement.value = 'a';
//       nameInput.nativeElement.dispatchEvent(new Event('input'));
//       expect(component.formErrors['name']).toContain(component.validationMessages['name']['minlength']);
//     });
//   }));

//   it('#should create new zone by onCreateZone function', async(() => {
//     fixture.detectChanges();

//     fixture.whenStable().then(() => {
//       spyOn(component.zoneForm, 'reset');
//       component.zoneForm.controls['name'].setValue('new customer');
//       component.zoneForm.controls['criticality'].setValue(component.arrStrCriticalities[0]);
//       component.zoneForm.controls['description'].setValue('new industry');
//       fixture.detectChanges();
//       component.onCreateZone();
//       fixture.whenStable().then(() => {
//         fixture.detectChanges();
//         expect(component.zoneForm.reset).toHaveBeenCalled();
//       });
//     });
//   }));
// });

// class HttpServiceMock {
//   createAsList(strUrl: string, objModel: Object) {
//     return Promise.resolve({key: 'customerkey'});
//   }
// }

// class MockSnackModal {
//   open(des: string, title: string, config: Object) {
//     return true;
//   }
// }

// class AuthServiceMock {
//   getAuthStatus(): Promise<any> {
//       return Promise.resolve();
//   }

//   logout() {
//       return Promise.resolve();
//   }

//   loginWithEmail(email: string, password: string) {
//       return Promise.resolve({});
//   }

//   get isUserEmailLoggedIn(): boolean {
//       return true;
//   }

//   get currentUserId(): string {
//       return 'ABC123';
//   }
// }
/**
 * wrote in 2018/3/30
 * update in 2018/8/15
 * */
