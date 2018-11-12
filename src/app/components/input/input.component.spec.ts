import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockMatModule } from '../../core/spec/mock-mat/mock-mat.module';

import { InputComponent } from './input.component';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';

// describe('InputComponent', () => {
//     let component: InputComponent;
//     let fixture: ComponentFixture<InputComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [ InputComponent ],
//             imports: [
//                 MockMatModule,
//                 FormsModule,
//                 ReactiveFormsModule
//             ]
//         })
//         .compileComponents()
//         .then(() => {
//             fixture = TestBed.createComponent(InputComponent);
//             component = fixture.componentInstance;
//         });
//     }));

//     it('#should set the input type via refreshing browser', async(() => {
//         component.arrStrInputTypes = ['number', 'text', 'textarea', 'date', 'option'];
//         component.ngOnInit();
//         expect(component.strInputType).toEqual(component.arrStrInputTypes[0]);
//     }));

//     it('#should display the action icons by onOver function', async(() => {
//         component.onOver();
//         expect(component.bIsShowEditBtn).toBeTruthy();
//     }));

//     it('#should disappear the action icons by onLeave function', async(() => {
//         component.onLeave();
//         expect(component.bIsShowEditBtn).toBeFalsy();
//     }));

//     it('#should be editable by onClickEdit function', async(() => {
//         component.onClickEdit();
//         expect(component.bIsEdit).toBeTruthy();
//     }));

//     it('#should occur edit end event with changed value by onDone function', async(() => {
//         spyOn(component.doneEdit, 'emit');
//         component.onDone();
//         expect(component.bIsEdit).toBeFalsy();
//         expect(component.doneEdit.emit).toHaveBeenCalled();
//     }));
// });
/**
 * wrote in 2018/3/30
 * update in 2018/8/10
 */
