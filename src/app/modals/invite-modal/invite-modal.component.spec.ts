import { Component, Inject } from '@angular/core';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatDialogModule,
  MatFormFieldModule,
  MatSelectModule,
  MatProgressBarModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../../services/http.service';
import { global_variables } from '../../../environments/global_variables';
import { environment } from '../../../environments/environment.dev';

import { InviteModalComponent } from './invite-modal.component';

// describe('InviteModalComponent', () => {
//   let dialog: MatDialog;
//   let dialogRef: any;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         InviteModalComponent
//       ],
//       imports: [
//         FormsModule,
//         ReactiveFormsModule,
//         MatDialogModule,
//         MatFormFieldModule,
//         MatSelectModule,
//         MatProgressBarModule,
//         NoopAnimationsModule,
//         BrowserDynamicTestingModule
//       ],
//       providers: [
//         { provide: MatDialogRef, useValue: { close: (() => {})} },
//         { provide: MAT_DIALOG_DATA, useValue: [] },
//         { provide: HttpService, useClass: HttpServiceMockClass }
//       ]
//     });

//     TestBed.overrideModule(BrowserDynamicTestingModule, {
//       set: {
//         entryComponents: [InviteModalComponent]
//       }
//     });

//     TestBed.compileComponents();
//   }));

//   beforeEach(inject([MatDialog],
//     (d: MatDialog) => {
//       dialog = d;
//       dialogRef = dialog.open(InviteModalComponent, {
//         width: '250px',
//         data: {
//           type: global_variables['userTypes'][0]
//         }
//       });
//     })
//   );

//   it('#should open the user dialog and set the variables', () => {
//     expect(dialogRef.componentInstance instanceof InviteModalComponent).toBe(true);
//     expect(dialogRef.componentInstance.arrObjRoles.length).toBe(5);
//   });

//   it('#should define the invite form via refreshing the browser', () => {
//     dialogRef.componentInstance.ngOnInit();
//     expect(dialogRef.componentInstance.inviteForm).toBeDefined();
//   });

//   it('#should close the dialog by close function', () => {
//     spyOn(dialogRef, 'close');
//     dialogRef.componentInstance.close();
//     expect(dialogRef.close).toHaveBeenCalled();
//   });

//   it('#should submit the invitation by submit function', fakeAsync(() => {
//     spyOn(dialogRef, 'close');
//     dialogRef.componentInstance.ngOnInit();
//     tick();

//     dialogRef.componentInstance.inviteForm.controls['email'].setValue('test@gmail.com');
//     tick();

//     const event = {
//       preventDefault: () => {
//         return;
//       }
//     };
//     dialogRef.componentInstance.submit(event);
//     tick();
//     expect(dialogRef.close).toHaveBeenCalled();
//   }));

// });

// class HttpServiceMockClass {
//   getListByOrder(strUrl: string, orderBy: string, orderEqual: string) {
//     return Observable.of([
//     ]);
//   }
// }

/**
 * wrote in 2018/4/11
*/
