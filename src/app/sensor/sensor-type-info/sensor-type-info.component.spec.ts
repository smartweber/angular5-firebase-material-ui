import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorTypeInfoComponent } from './sensor-type-info.component';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment.dev';
import { global_variables } from '../../../environments/global_variables';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';
import { SensortypeDetailPipe } from '../../filters/sensortype-detail.pipe';
import { Observable } from 'rxjs/Observable';

// describe('SensorTypeInfoComponent', () => {
//   let component: SensorTypeInfoComponent;
//   let fixture: ComponentFixture<SensorTypeInfoComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//           SensorTypeInfoComponent,
//           SensortypeDetailPipe
//         ],
//       providers: [
//         {
//             provide: ActivatedRoute, useValue: {
//                 params: Observable.of({
//                     id: 'id1'
//                 })
//             }
//         },
//         { provide: HttpService, useClass: HttpServiceMock },
//         { provide: DataService, useClass: DataServiceMocks }
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SensorTypeInfoComponent);
//     component = fixture.componentInstance;
//   });

//   it('#should get sensor types and check the user permission via browser refresh', () => {
//     spyOn(component, 'getSensorTypes');
//     spyOn(component, 'checkAvailability');
//     component.ngOnInit();
//     expect(component.getSensorTypes).toHaveBeenCalled();
//     expect(component.checkAvailability).toHaveBeenCalled();
//   });

//   it('#should get sensor types by getSensorTypes function', () => {
//     spyOn(component, 'onChangeCategory');
//     component.getSensorTypes('-key');
//     expect(component.onChangeCategory).toHaveBeenCalled();
//     expect(component.isPageLoading).toBeTruthy();
//   });

//   it('#should change the category by onChangeCategory function', () => {
//     component.onChangeCategory(0);
//     expect(component.nSelectedCategory).toBeDefined();
//   });
// });

// class DataServiceMocks {
//     returnValue: any;
//     getString(strName: string) {
//         return this.returnValue;
//     }
// }

// class HttpServiceMock {
//     getAsList(strUrl: string, nTake: number = 0): Observable<any> {
//         return Observable.of({});
//     }
// }
/**
 * wrote in 2018/4/11
*/
