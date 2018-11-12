/* tslint:disable:no-unused-variable */
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  inject
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment.dev';
import { AgmCoreModule } from '@agm/core';
import { CustomerMapComponent } from './customer-map.component';

// describe('CustomerMapComponent', () => {
//   let component: CustomerMapComponent;
//   let fixture: ComponentFixture<CustomerMapComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ CustomerMapComponent ],
//       imports: [
//         AgmCoreModule.forRoot({
//           apiKey: 'AIzaSyBGH1Lmb_8OPJnadWq39AUglhyULkY8HZU'
//         })
//       ],
//       providers: [
//         { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
//       ],
//     })
//     .compileComponents()
//     .then(() => {
//       fixture = TestBed.createComponent(CustomerMapComponent);
//       component = fixture.componentInstance;
//     });
//   }));

//   it('#should process all the calculations for the map via refreshing browser', async(() => {
//     component.zones = [
//       {
//         customerId: '-customerKey'
//       }
//     ];
//     spyOn(component, 'generateAllLines');
//     spyOn(component, 'init');
//     component.ngOnInit();
//     expect(component.generateAllLines).toHaveBeenCalled();
//     expect(component.init).toHaveBeenCalled();
//   }));

//   it('#should get specific customer color by getCustomerColor function', async((done) => {
//     component.customers = [
//       {
//         key: '-key',
//         color: 'red'
//       }
//     ];
//     const color = component.getCustomerColor('-key');
//     expect(color).toBeDefined();
//   }));

//   it('#should navigate from map view to the list one by clickMarker function when', async((done) => {
//     component.nIsBorder = 1;
//     component.clickMarker('-customerKey', '-zoneKey', 'sensorKey');
//     expect((component as any)._router.navigate).toHaveBeenCalled();
//   }));

//   it('#should navigate from map view to the list one by clickLine function', async((done) => {
//     component.nIsBorder = 1;
//     component.clickLine('-customerKey', '-zoneKey');
//     expect((component as any)._router.navigate).toHaveBeenCalled();
//   }));

//   it('#should get all available lines by generateAllLines function', async((done) => {
//     component.paths = [];
//     component.generateAllLines([
//       {
//         lat: 21,
//         lng: 12,
//         customerKey: '-customerkey1',
//         zoneKey: '-zoneKey1',
//         zoneColor: 'red'
//       },
//       {
//         lat: 11,
//         lng: 15,
//         customerKey: '-customerkey2',
//         zoneKey: '-zoneKey2',
//         zoneColor: 'black'
//       }
//     ]);
//     expect(component.paths).toBeDefined();
//   }));
// });
/**
 * wrote 2018/4/2
 */
