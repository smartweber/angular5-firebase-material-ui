import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MatIconModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressSpinnerModule
} from '@angular/material';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DailyTestModalComponent } from './daily-test-modal.component';
import { HttpService } from '../../services/http.service';
import { Observable } from 'rxjs/Observable';

// describe('DailyTestModalComponent', () => {
//   let component: DailyTestModalComponent;
//   let dialog: MatDialog;
//   let fixture: ComponentFixture<DailyTestModalComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ DailyTestModalComponent ],
//       providers: [
//         { provide: MatDialogRef, useValue: {} },
//         { provide: MAT_DIALOG_DATA, useValue: [] },
//         { provide: HttpService, useClass: HttpServiceMock }
//       ],
//       imports: [
//         BrowserDynamicTestingModule,
//         NoopAnimationsModule,
//         MatDialogModule,
//         MatIconModule,
//         MatSelectModule,
//         FormsModule,
//         ReactiveFormsModule,
//         MatTableModule,
//         MatPaginatorModule,
//         MatProgressSpinnerModule
//       ]
//     });

//     TestBed.overrideModule(BrowserDynamicTestingModule, {
//       set: {
//         entryComponents: [DailyTestModalComponent]
//       }
//     });

//     TestBed.compileComponents();
//   }));

//   beforeEach(inject([MatDialog],
//     (d: MatDialog) => {
//       dialog = d;
//       fixture = TestBed.createComponent(DailyTestModalComponent);
//       component = fixture.componentInstance;
//     })
//   );

//   it('#should open the daily test setting dialog', () => {
//     const dialogRef = dialog.open(DailyTestModalComponent, {
//       width: '250px'
//     });

//     expect(dialogRef.componentInstance instanceof DailyTestModalComponent).toBe(true);
//   });

//   it('#should get configuration file list by getConfigList function', () => {
//     component.nModalType = 0;
//     const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMock;
//     spyOn(mockHttpService, 'getListByOrder').and.callThrough();
//     mockHttpService.returnValue = [
//       {
//         modalType: component.nModalType,
//         timestamp: 1534500000
//       }
//     ];
//     spyOn(component, 'initDataTable');
//     component.getConfigList();
//     expect(component.isLoadTable).toBeFalsy();
//     expect(component.initDataTable).toHaveBeenCalled();
//   });

//   it('#should submit daily test setting configuration by onSubmit function', () => {
//     const dialogRef = dialog.open(DailyTestModalComponent, {
//       width: '250px'
//     });
//     spyOn(dialogRef.componentInstance.dialgoRef, 'close');
//     dialogRef.componentInstance.strSelectConfigKey = '-configKey';
//     dialogRef.componentInstance.nScheduleTime = 1;
//     dialogRef.componentInstance.onSubmit();
//     expect(dialogRef.componentInstance.dialgoRef.close).toHaveBeenCalled();
//   });
// });

// class HttpServiceMock {
//   returnValue: any;

//   getListByOrder(strUrl: string, strOrder: string, strEqual: string, nTake: number = 0) {
//     return Observable.of(this.returnValue);
//   }
// }
/**
 * write in 2018/8/17
 */
