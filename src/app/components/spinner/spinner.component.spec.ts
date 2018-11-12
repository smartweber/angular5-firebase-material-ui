import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';
import { SpinnerComponent } from './spinner.component';
import { SpinnerService } from './spinner.service';

// describe('SpinnerComponent', () => {
//   let component: SpinnerComponent;
//   let fixture: ComponentFixture<SpinnerComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ SpinnerComponent ],
//       providers: [ SpinnerService ]
//     })
//     .compileComponents()
//     .then(() => {
//       fixture = TestBed.createComponent(SpinnerComponent);
//       component = fixture.componentInstance;
//     });
//   }));

//   it('#should trigger by the spinner service', () => {
//     fixture.detectChanges();
//     (component as any).spinner.start();
//     fixture.whenStable().then(() => {
//       fixture.detectChanges();
//       expect(component.active).toBeTruthy();
//     });
//   });
// });
/**
 * wrote in 2018/3/30
 */
