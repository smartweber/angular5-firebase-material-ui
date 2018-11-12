import {
    async,
    ComponentFixture,
    TestBed,
    inject,
    fakeAsync,
    tick
} from '@angular/core/testing';

import { UserModalComponent } from './user-modal.component';
import { HttpService } from '../../services/http.service';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import {
    MatSnackBar,
    MAT_DIALOG_DATA,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

// describe('UserModalComponent', () => {
//     let component: UserModalComponent;
//     let dialog: MatDialog;
//     let fixture: ComponentFixture<UserModalComponent>;
//     let dialogRef: any;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [ UserModalComponent ],
//             providers: [
//                 { provide: HttpService, useClass: HttpServiceMockClass },
//                 { provide: MatSnackBar, useClass: SnackModalMockClass },
//                 { provide: MatDialogRef, useValue: {} },
//                 { provide: MAT_DIALOG_DATA, useValue: [] }
//             ],
//             imports: [
//                 FormsModule,
//                 ReactiveFormsModule,
//                 MatFormFieldModule,
//                 MatSelectModule,
//                 MatDialogModule,
//                 MatProgressSpinnerModule,
//                 BrowserDynamicTestingModule,
//                 NoopAnimationsModule,
//                 MatProgressBarModule
//             ]
//         });

//         TestBed.overrideModule(BrowserDynamicTestingModule, {
//             set: {
//                 entryComponents: [UserModalComponent]
//             }
//         });

//         TestBed.compileComponents();
//     }));

//     beforeEach(inject([MatDialog],
//         (d: MatDialog) => {
//             dialog = d;

//             fixture = TestBed.createComponent(UserModalComponent);
//             component = fixture.componentInstance;
//             dialogRef = dialog.open(UserModalComponent, {
//                 width: '250px',
//                 data: {
//                     user: {
//                         role: 'admin',
//                         status: 'pending',
//                         key: 'key'
//                     }
//                 }
//             });
//         })
//     );

//     it('#should open the user dialog', () => {
//         expect(dialogRef.componentInstance instanceof UserModalComponent).toBe(true);
//     });

//     it('#should define the setting form by opening the modal', () => {
//         dialogRef.componentInstance.ngOnInit();
//         expect(dialogRef.componentInstance.settingForm).toBeDefined();
//     });

//     it('#should submit the setting form by submitSetting function', fakeAsync(() => {
//         dialogRef.componentInstance.ngOnInit();
//         tick();

//         spyOn(dialogRef.componentInstance.dialgoRef, 'close');
//         dialogRef.componentInstance.settingForm.controls['role'].setValue('admin');
//         dialogRef.componentInstance.settingForm.controls['status'].setValue('pending');
//         dialogRef.componentInstance.submitSetting();
//         tick();
//         expect(dialogRef.componentInstance.bIsProcess).toBeFalsy();
//         expect(dialogRef.componentInstance.dialgoRef.close).toHaveBeenCalled();
//     }));
// });

// class HttpServiceMockClass {
//     updateAsObject(strUrl: string, value: any): Promise<any> {
//         return Promise.resolve(true);
//     }
// }

// class SnackModalMockClass {
//     open(des: string, title: string, config: Object) {
//         return true;
//     }
// }
/**
 * wrote in 2018/4/11
*/
