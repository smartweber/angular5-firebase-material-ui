/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { SensorComponent } from './sensor.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { Observable } from 'rxjs/Observable';

// describe('SensorComponent', () => {
//     let component: SensorComponent;
//     let fixture: ComponentFixture<SensorComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 SensorComponent,
//                 MockSensorTopbarComponent,
//                 MockSensorDetailComponent
//             ],
//             providers: [
//                 {
//                     provide: ActivatedRoute, useValue: {
//                         params: Observable.of({
//                             id: 'key'
//                         })
//                     }
//                 },
//                 {
//                     provide: Router, useValue: {
//                         navigate: jasmine.createSpy('navigate')
//                     }
//                 },
//                 { provide: HttpService, useClass: HttpServiceMock },
//             ]
//         })
//         .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(SensorComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('#should get the sensor details via browser refresh', () => {
//         component.ngOnInit();
//         fixture.whenStable().then(() => {
//             expect(component.selectedSensor).toBeDefined();
//             expect(component.isPageLoading).toBeTruthy();
//         });
//     });

//     it('#destroy all of the subscribers by ngOnDestroy function', () => {
//         spyOn(component.sensorSub, 'unsubscribe').and.callFake(() => {
//             return;
//         });

//         component.ngOnDestroy();
//         expect(component.sensorSub.unsubscribe).toHaveBeenCalled();
//     });
// });

// class HttpServiceMock {
//     getAsObject(strUrl: string, nTake: number = 0): Observable<any> {
//         return Observable.of({});
//     }
// }

// @Component({
//     selector: 'app-sensor-topbar',
//     template: '<p>sensor topbar component</p>'
// })
// class MockSensorTopbarComponent {
//     @Input() sensorName: any;
// }

// @Component({
//     selector: 'app-sensor-detail',
//     template: '<p>sensor detail component</p>'
// })
// class MockSensorDetailComponent {
//     @Input() selectedSensor: any;
//     @Input() sensorKey: any;
// }
/**
 * wrote in 2018/4/11
 * */
