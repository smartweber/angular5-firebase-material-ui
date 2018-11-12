import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import {
    MatListModule
} from '@angular/material';

import { SensorTypeListComponent } from './sensor-type-list.component';
import { HttpService } from '../../services/http.service';
import { SpinnerService } from '../../components/spinner/spinner.service';
import { Observable } from 'rxjs/Observable';

// describe('SensorTypeListComponent', () => {
//     let component: SensorTypeListComponent;
//     let fixture: ComponentFixture<SensorTypeListComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 SensorTypeListComponent,
//                 MockSensorTypeInfoComponent
//             ],
//             providers: [
//                 SpinnerService,
//                 { provide: HttpService, useClass: HttpServiceMock },
//             ],
//             imports: [
//                 MatListModule
//             ]
//         })
//         .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(SensorTypeListComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('#should call loadData function via browser refresh', () => {
//         spyOn(component, 'loadData');
//         component.ngOnInit();
//         expect(component.loadData).toHaveBeenCalled();
//     });

//     it('#should get sensor type data function by loadData function', () => {
//         component.loadData();
//         expect(component.bIsLoadList).toBeTruthy();
//     });

//     it('#should select specific sensor by onSelectType function', () => {
//         const key = '-key';
//         component.onSelectType(key);
//         expect(component.strSelectedType).toBe(key);
//     });
// });

// class HttpServiceMock {
//     getAsList(strUrl: string, nTake: number = 0): Observable<any> {
//         return Observable.of({});
//     }
// }

// @Component({
//     selector: 'app-sensor-type-info',
//     template: '<p>sensor type info component</p>'
// })
// class MockSensorTypeInfoComponent {
//     @Input() strTypeKey: any;
//     @Input() isComponent: any;
// }
/**
 * wrote in 2018/4/11
 * */
