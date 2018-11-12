import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { PurehttpService } from '../../services/purehttp.service';
import { environment } from '../../../environments/environment.dev';
import {
  ActivatedRoute
} from '@angular/router';
import {
  Component,
  Input,
  Output
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SensorMapComponent } from './sensor-map.component';

// describe('SensorMapComponent', () => {
//   let component: SensorMapComponent;
//   let fixture: ComponentFixture<SensorMapComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         SensorMapComponent,
//         MockAppCustomerMapComponent
//       ],
//       imports: [
//       ],
//       providers: [
//         {
//           provide: ActivatedRoute, useValue: {
//             queryParams: Observable.of({
//               code: 'mrxnrsjmhpxvlpz'
//             })
//           }
//         },
//         { provide: HttpService, useClass: HttpServiceMock },
//         { provide: AuthService, useClass: AuthServiceMock },
//         { provide: PurehttpService, useClass: PureHttpServiceMockClass }
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SensorMapComponent);
//     component = fixture.componentInstance;
//   });

//   it('#get the data from firebase if the code is valid via browser refresh', () => {
//     spyOn(component,  'checkLoad');
//     const mockPurehttpService = fixture.debugElement.injector.get(PurehttpService) as PureHttpServiceMockClass;
//     spyOn(mockPurehttpService, 'callFirebaseFunction').and.callThrough();
//     mockPurehttpService.returnValue = {
//       status: 'success'
//     };
//     component.ngOnInit();
//     fixture.detectChanges();

//     fixture.whenStable().then(() => {
//       expect(component.checkLoad).toHaveBeenCalled();
//       expect(component.isGetCustomers).toBeTruthy();
//       expect(component.isGetZones).toBeTruthy();
//       expect(component.isGetSensors).toBeTruthy();
//     });
//   });

//   it('#should calculate the values and complete to load the page by checkLoad function if geting data is successful', () => {
//     spyOn(component, 'filterSensorsToZone');
//     component.zones = [];
//     component.sensors = [
//       { data: 'data' }
//     ];
//     component.isGetCustomers = true;
//     component.isGetZones = true;
//     component.isGetSensors = true;
//     component.checkLoad();
//     expect(component.filterSensorsToZone).toHaveBeenCalled();
//   });

//   it('#should filter sensors by filterSensorsToZone function', () => {
//     component.zones = [
//       {
//         key: 'zone1',
//         sensors: []
//       }
//     ];
//     const sensor = {
//       zoneId: 'zone1'
//     };
//     component.filterSensorsToZone(sensor);
//     expect(component.zones[0]['sensors'].length).not.toBe(0);
//   });
// });

// class HttpServiceMock {
//   getAsList(strUrl: string, nTake: number = 0): Observable<any> {
//     let returnVal: any[];

//     switch (strUrl) {
//       case environment.APIS.CUSTOMERS:
//         returnVal = [];
//       break;
//       case environment.APIS.ZONES:
//         returnVal = [
//           {
//             key: 'zone1'
//           },
//           {
//             key: 'zone2'
//           }
//         ];
//       break;
//       case environment.APIS.SENSORS:
//       returnVal = [
//         {
//           zoneId: 'zone1'
//         },
//         {
//           zoneId: 'zone2'
//         }
//       ];
//       break;
//     }

//     return Observable.of(returnVal);
//   }
// }

// class AuthServiceMock {
//   getAuthStatus(): Promise<any> {
//     return Promise.resolve();
//   }

//   logout() {
//     return Promise.resolve();
//   }

//   loginWithEmail(email: string, password: string) {
//     return Promise.resolve({});
//   }

//   get isUserEmailLoggedIn(): boolean {
//     return true;
//   }

//   get currentUserId(): string {
//     return 'ABC123';
//   }
// }

// class PureHttpServiceMockClass {
//   returnValue: any;

//   callFirebaseFunction(strUrl: string, objPostData: Object) {
//     return Observable.of(this.returnValue);
//   }
// }

// @Component({
//   selector: 'app-customer-map',
//   template: '<p>Mock app-customer-map Component</p>'
// })
// class MockAppCustomerMapComponent {
//   @Input() customers: any;
//   @Input() zones: any;
//   @Input() strCustomerKey: any;
//   @Input() strZoneKey: any;
//   @Input() strSensorKey: any;
//   @Input() nIsBorder: any;
// }
/**
 * wrote in 2018/4/4
 * */
