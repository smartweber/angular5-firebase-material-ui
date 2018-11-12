import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewContainerRef } from '@angular/core';
import {
    MatDialog,
    MatIconModule
} from '@angular/material';
import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CommentComponent } from './comment.component';

// describe('CommentComponent', () => {
//     let component: CommentComponent;
//     let fixture: ComponentFixture<CommentComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 CommentComponent
//             ],
//             providers: [
//                 { provide: MatDialog, useClass: MockDialogComponent }
//             ],
//             imports: [
//                 MatIconModule
//             ]
//         })
//         .compileComponents()
//         .then(() => {
//             fixture = TestBed.createComponent(CommentComponent);
//             component = fixture.componentInstance;
//         });
//     }));

//     it('#should call applyToElement function when changing inputs', async(() => {
//         spyOn(component, 'applyToElement');
//         component.ngOnChanges();
//         expect(component.applyToElement).toHaveBeenCalled();
//     }));

//     it('#should set content to the display element by applyToElement function', async(() => {
//         spyOn(component.displayElement.nativeElement, 'insertAdjacentHTML');
//         component.strComment = null;
//         component.applyToElement();
//         expect(component.strComment).toBe('');
//         expect(component.displayElement.nativeElement.insertAdjacentHTML).toHaveBeenCalled();
//     }));

//     it('#should occur the update event after confirm by onEdit function', async(() => {
//         spyOn(component.updateComment, 'emit');
//         component.strComment = '';
//         component.onEdit(false);

//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect(component.updateComment.emit).toHaveBeenCalled();
//         });
//     }));

//     it('#should display the action icons by onOver function', async(() => {
//         component.onOver();
//         expect(component.bIsHover).toBeTruthy();
//     }));

//     it('#should disappear the action icons by onLeave function', async(() => {
//         component.onLeave();
//         expect(component.bIsHover).toBeFalsy();
//     }));
// });

// class MockDialogComponent {
//     open(component: any, config: any) {
//         return {
//             afterClosed: function() {
//                 return Observable.of({
//                     status: true
//                 });
//             }
//         };
//     }
// }
/**
 * wrote in 2018/3/30
 * update in 2018/8/10
 */
