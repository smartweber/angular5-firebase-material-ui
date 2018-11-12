import {
    async,
    TestBed,
    inject
} from '@angular/core/testing';

import { ConfirmModalComponent } from './confirm-modal.component';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogModule,
    MatDialogRef,
    MatIconModule
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// describe('ConfirmModalComponent', () => {
//     let dialog: MatDialog;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [ ConfirmModalComponent ],
//             providers: [
//                 { provide: MatDialogRef, useValue: {} },
//                 { provide: MAT_DIALOG_DATA, useValue: [] },
//             ],
//             imports: [
//                 BrowserDynamicTestingModule,
//                 NoopAnimationsModule,
//                 MatDialogModule,
//                 MatIconModule
//             ]
//         });

//         TestBed.overrideModule(BrowserDynamicTestingModule, {
//             set: {
//                 entryComponents: [ConfirmModalComponent]
//             }
//         });

//         TestBed.compileComponents();
//     }));

//     beforeEach(inject([MatDialog],
//         (d: MatDialog) => {
//             dialog = d;
//         })
//     );

//     it('#should open the user dialog and set the title and description', () => {
//         const dialogRef = dialog.open(ConfirmModalComponent, {
//             width: '250px',
//             data: {
//                 title: 'title',
//                 description: 'description'
//             }
//         });

//         expect(dialogRef.componentInstance instanceof ConfirmModalComponent).toBe(true);
//         expect(dialogRef.componentInstance.strTitle).toBe('title');
//         expect(dialogRef.componentInstance.strDescription).toBe('description');
//     });
// });
/**
 * wrote in 2018/4/9
 * */
