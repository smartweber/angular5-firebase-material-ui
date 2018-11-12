import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  MatSnackBar,
  MatDialog,
  MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatFormFieldModule
} from '@angular/material';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpService } from '../../services/http.service';
import { PurehttpService } from '../../services/purehttp.service';
import { global_variables } from '../../../environments/global_variables';
import { Location } from '@angular/common';

import { SensorListComponent } from './sensor-list.component';

// describe('SensorListComponent', () => {
//   let component: SensorListComponent;
//   let fixture: ComponentFixture<SensorListComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         SensorListComponent,
//         MockCommentComponent
//       ],
//       providers: [
//         { provide: HttpService, useClass: HttpServiceMock },
//         { provide: PurehttpService, useClass: PureHttpServiceMockClass },
//         { provide: MatDialog, useClass: MockDialogComponent },
//         { provide: MatSnackBar, useClass: MockSnackModal },
//         { provide: Location, useValue: { back: function() { return true; } } }
//       ],
//       imports: [
//         MatDialogModule,
//         MatTableModule,
//         MatPaginatorModule,
//         MatCardModule,
//         MatProgressSpinnerModule,
//         BrowserAnimationsModule,
//         MatIconModule,
//         FormsModule,
//         ReactiveFormsModule,
//         MatFormFieldModule
//       ]
//     })
//     .compileComponents()
//     .then(() => {
//       fixture = TestBed.createComponent(SensorListComponent);
//       component = fixture.componentInstance;
//     });

//   }));

//   it('#should get sensors data via browser refresh', () => {
//     spyOn(component, 'getSensorList');
//     spyOn(component, 'getSensorDevices');
//     component.ngOnInit();
//     expect(component.getSensorList).toHaveBeenCalled();
//     expect(component.getSensorDevices).toHaveBeenCalled();
//   });

//   it('#should get sensor list by getSensorList function', () => {
//     const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//     spyOn(mockHttpService, 'getAsList').and.callThrough();
//     mockHttpService.returnValue = [{
//       key: '-sensorKey',
//       serialNumber: 'sensor123',
//       customerName: 'customer1',
//       zoneName: 'zone1',
//       name: 'sensor1',
//       availability: global_variables.deviceStatus[0],
//       time: '2018',
//       customerId: '-customerId',
//       zoneId: '-zoneId'
//     }];
//     component.bIsGetData = true;
//     spyOn(component, 'integrateSensorDetails');

//     component.getSensorList();
//     expect(component.integrateSensorDetails).toHaveBeenCalled();
//   });

//   it('#should get sensors device status by getSensorDevices function', () => {
//     const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//     spyOn(mockHttpService, 'getAsList').and.callThrough();
//     mockHttpService.returnValue = [{
//       actionStatus: 0,
//       comment: 'comment',
//       fileName: 'file1',
//       fileKey: '-filekey1',
//       key: '-key1'
//     }];
//     component.bIsGetData = true;
//     spyOn(component, 'integrateSensorDetails');
//     component.getSensorDevices();
//     expect(component.integrateSensorDetails).toHaveBeenCalled();
//   });

//   it('#should integrate device status by integrateSensorDetails function', () => {
//     component.arrSensors = [
//       {
//         key: 'sensor1'
//       }
//     ];

//     component.objDeviceStatus = {
//       sensor1: {
//         actionStatus: 2,
//         comment: 'comment',
//         fileName: 'file1',
//         fileKey: '-filekey1'
//       }
//     };

//     component.integrateSensorDetails();
//     expect(component.objPreviousDeviceStatus).toBeDefined();
//   });

//   it('#should integrate device status by integrateDeviceStatus function', () => {
//     component.downloadFile({}, 'file1');
//     expect(component.bIsDownloadProcess).not.toBeTruthy();
//   });

//   it('#should download file by downloadFile function', () => {
//     spyOn((component as any)._httpService, 'postAsObject').and.callFake(() => {
//       return Promise.resolve(true);
//     });

//     spyOn((component as any)._httpService, 'updateAsObject').and.callFake(() => {
//       return Promise.resolve(true);
//     });

//     component.onConfigure({
//       key: '-sensorkey1'
//     });
//     expect(component.fileName).toBeDefined();
//     expect((component as any)._httpService.postAsObject).toHaveBeenCalled();
//     expect((component as any)._httpService.updateAsObject).toHaveBeenCalled();
//   });

//   it('#should get download data by onDownloadFile function', () => {
//     const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//     spyOn(mockHttpService, 'getAsObject').and.callThrough();
//     mockHttpService.returnValue = {
//       path: 'data/file1',
//       configUrl: 'http://configure.com'
//     };

//     const mockPureHttpService = fixture.debugElement.injector.get(PurehttpService) as PureHttpServiceMockClass;
//     mockPureHttpService.returnValue = {
//       data: {}
//     };
//     spyOn(component, 'downloadFile');

//     component.onDownloadFile({
//       key: '-sensorkey1',
//       fileKey: '-fileKey1'
//     });

//     expect(component.downloadFile).toHaveBeenCalled();
//   });

//   it('#should delete configuration file by onDeleteConfig function', fakeAsync(() => {
//     component.onDeleteConfig({
//       key: '-sensorkey1'
//     });
//     tick();
//     expect(component.bIsDeleteProcess).not.toBeTruthy();
//   }));

//   it('#should change comment by onChangeComment function', () => {
//     spyOn((component as any)._httpService, 'updateAsObject').and.callFake(() => {
//       return Promise.resolve(true);
//     });

//     component.onChangeComment({
//       key: '-sensorDeviceKey1',
//       comment: 'comment'
//     });

//     expect((component as any)._httpService.updateAsObject).toHaveBeenCalled();
//   });
// });

// @Component({
//   selector: 'app-comment',
//   template: '<p>Mock Comment Component</p>'
// })
// class MockCommentComponent {
//   @Input() strComment: string;
//   @Input() key: string;
//   @Output() updateComment = new EventEmitter();
// }

// class HttpServiceMock {
//   returnValue: any;

//   getAsObject(strUrl: string, nTake: number = 0): Observable<any> {
//     return Observable.of(this.returnValue);
//   }

//   getAsList(strUrl: string, nTake: number = 0) {
//     return Observable.of(this.returnValue);
//   }

//   postAsObject(strUrl: string, value: any) {
//     return Promise.resolve(true);
//   }

//   updateAsObject(strUrl: string, value: any) {
//     return Promise.resolve(true);
//   }
// }

// class PureHttpServiceMockClass {
//   returnValue: any;

//   callFirebaseFunction(strUrl: string, objPostData: Object) {
//     return Observable.of(this.returnValue);
//   }
// }

// class MockDialogComponent {

//   open(component: any, config: any) {
//     return {
//       afterClosed: () => {
//         return Observable.of({
//           fileName: 'file_name',
//           fileKey: '-filekey123',
//           modalType: 1,
//           data: null
//         });
//       }
//     };
//   }
// }

// class MockSnackModal {
//   open(des: string, title: string, config: Object) {
//     return true;
//   }
// }
/**
 * write in 2018/8/17
 * update in 2018/8/17
 */
