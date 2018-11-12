/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AgmCoreModule } from '@agm/core';

import { ZoneMapComponent } from './zone-map.component';

// describe('ZoneMapComponent', () => {
//   let component: ZoneMapComponent;
//   let fixture: ComponentFixture<ZoneMapComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ZoneMapComponent ],
//       imports: [
//         AgmCoreModule.forRoot({
//           apiKey: 'AIzaSyBGH1Lmb_8OPJnadWq39AUglhyULkY8HZU'
//         })
//       ],
//       providers: [
//         { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
//       ]
//     })
//     .compileComponents()
//     .then(() => {
//       fixture = TestBed.createComponent(ZoneMapComponent);
//       component = fixture.componentInstance;
//     });
//   }));

//   it('#should process all the calculations for the map via refreshing browser', async(() => {
//     component.zoneObjects = [
//       {
//         sensors: [
//           {
//             key: {
//               customerId: 'id'
//             }
//           }
//         ],
//         color: 'red'
//       }
//     ];
//     spyOn(component, 'generateAllLines');
//     spyOn(component, 'getMapHeight');
//     component.ngOnInit();
//     expect(component.generateAllLines).toHaveBeenCalled();
//     expect(component.getMapHeight).toHaveBeenCalled();
//   }));

//   it('#should go to the list view by clickMarker function', async((done) => {
//     component.clickMarker('-customerKey', '-zoneKey', 'sensorKey');
//     expect((component as any)._router.navigate).toHaveBeenCalled();
//   }));

//   it('#should go to the list view by clickLine function', async((done) => {
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
 * wrote in 2018/4/12
 * */
