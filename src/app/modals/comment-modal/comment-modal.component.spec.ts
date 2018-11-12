import {
    async,
    ComponentFixture,
    TestBed,
    inject,
    fakeAsync,
    tick
} from '@angular/core/testing';

import { CommentModalComponent } from './comment-modal.component';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogModule,
    MatDialogRef
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// describe('CommentModalComponent', () => {
//     let dialog: MatDialog;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [ CommentModalComponent ],
//             providers: [
//                 { provide: MatDialogRef, useValue: {} },
//                 { provide: MAT_DIALOG_DATA, useValue: [] },
//             ],
//             imports: [
//                 BrowserDynamicTestingModule,
//                 NoopAnimationsModule,
//                 MatDialogModule,
//                 FormsModule,
//                 ReactiveFormsModule
//             ]
//         });

//         TestBed.overrideModule(BrowserDynamicTestingModule, {
//             set: {
//                 entryComponents: [CommentModalComponent]
//             }
//         });

//         TestBed.compileComponents();
//     }));

//     beforeEach(inject([MatDialog],
//         (d: MatDialog) => {
//             dialog = d;
//         })
//     );

//     it('#should open the user dialog and set the variables', () => {
//         const dialogRef = dialog.open(CommentModalComponent, {
//             width: '250px',
//             data: {
//                 strComment: 'comment',
//                 bIsEdit: false
//             }
//         });

//         expect(dialogRef.componentInstance instanceof CommentModalComponent).toBe(true);
//         expect(dialogRef.componentInstance.strComment).toBe('comment');
//         expect(dialogRef.componentInstance.bIsEdit).toBe(false);
//     });

//     it('#close the modal by close function', () => {
//         const dialogRef = dialog.open(CommentModalComponent, {
//             width: '250px',
//             data: {
//                 strComment: 'comment',
//                 bIsEdit: false
//             }
//         });
//         spyOn(dialogRef.componentInstance.dialgoRef, 'close');

//         dialogRef.componentInstance.close();
//         expect(dialogRef.componentInstance.dialgoRef.close).toHaveBeenCalledWith({status: false});
//     });

//     it('#close the modal with the comment by done function', () => {
//         const dialogRef = dialog.open(CommentModalComponent, {
//             width: '250px',
//             data: {
//                 strComment: 'comment',
//                 bIsEdit: false
//             }
//         });
//         spyOn(dialogRef.componentInstance.dialgoRef, 'close');

//         dialogRef.componentInstance.done();
//         expect(dialogRef.componentInstance.dialgoRef.close).toHaveBeenCalledWith(
//             {status: true, comment: dialogRef.componentInstance.strComment}
//         );
//     });
// });
/**
 * wrote in 2018/4/9
 * */
