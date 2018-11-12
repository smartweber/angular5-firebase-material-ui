import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  Component,
  Input
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  ActivatedRoute
} from '@angular/router';

import { CreateComponent } from './create.component';

// describe('CreateComponent', () => {
//   let component: CreateComponent;
//   let fixture: ComponentFixture<CreateComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         CreateComponent,
//         MockCreateCustomerComponent,
//         MockCreateZoneComponent,
//         MockCreateSensorComponent
//       ],
//       providers: [
//         {
//           provide: ActivatedRoute, useValue: {
//             queryParams: Observable.of({
//               create: 'newCustomer'
//             }),
//             params: Observable.of({
//               name: 'newCustomer'
//             })
//           }
//         }
//       ],
//       imports: [
//       ]
//     })
//     .compileComponents()
//     .then(() => {
//         fixture = TestBed.createComponent(CreateComponent);
//         component = fixture.componentInstance;
//     });
//   }));

//   it('#should determine the create type via browser refresh', async(() => {
//     component.ngOnInit();
//     expect(component.createType).toBe(0);
//     expect(component.createName).toBe('newCustomer');
//   }));

//   it('#should destory all subscribes by ngOnDestroy function', async(() => {
//     fixture.detectChanges();

//     fixture.whenStable().then(() => {
//       spyOn(component.routeParamsSub, 'unsubscribe');
//       spyOn(component.routeQueryParamsSub, 'unsubscribe');

//       component.ngOnDestroy();
//       expect(component.routeParamsSub.unsubscribe).toHaveBeenCalled();
//       expect(component.routeQueryParamsSub.unsubscribe).toHaveBeenCalled();
//     });
//   }));
// });

// @Component({
//   selector: 'app-create-customer',
//   template: '<p>Mock Create Customer Component</p>'
// })
// class MockCreateCustomerComponent {
// }

// @Component({
//   selector: 'app-create-zone',
//   template: '<p>Mock Create Zone Component</p>'
// })
// class MockCreateZoneComponent {
//   @Input() customerId: string;
//   @Input() createName: string;
// }

// @Component({
//   selector: 'app-create-sensor',
//   template: '<p>Mock Create Sensor Component</p>'
// })
// class MockCreateSensorComponent {
//   @Input() createName: string;
//   @Input() customerId: string;
//   @Input() zoneId: string;
// }

/**
 * wrote in 2018/3/30
 * update in 2018/8/10
 * */
