/* tslint:disable:no-unused-variable */
import {
    async,
    ComponentFixture,
    TestBed,
    tick,
    fakeAsync
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import {
    Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {
    Component,
    Input
} from '@angular/core';
import { global_variables } from '../../../environments/global_variables';
import { NotificationService } from '../../services/notification.service';
import { HttpService } from '../../services/http.service';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../components/spinner/spinner.service';

import { ZoneListComponent } from './zone-list.component';
import {
    MatCardModule,
    MatIconModule,
    MatDialog
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

// describe('CustomerListComponent', () => {
//     let component: ZoneListComponent;
//     let fixture: ComponentFixture<ZoneListComponent>;
//     const NotificationMocks = {
//         createNotification: function(type: string, title: string, content: string) {
//             return true;
//         }
//     };

//     beforeEach(async(() => {
//         const routerStub = {
//             navigate: jasmine.createSpy('navigate'),
//             routerState: {}
//         };

//         TestBed.configureTestingModule({
//             declarations: [
//                 ZoneListComponent,
//                 MockSensorDetailComponent,
//                 MockZoneDetailComponent,
//                 MockAppDetailViewerComponent
//             ],
//             providers: [
//                 SpinnerService,
//                 { provide: HttpService, useClass: HttpServiceMock },
//                 { provide: NotificationService, useValue: NotificationMocks },
//                 { provide: Router, useValue: routerStub },
//                 { provide: DataService, useClass: DataServiceMocks },
//                 { provide: MatDialog, useClass: MockDialogComponent },
//                 { provide: AuthService, useClass: AuthServiceMockClass }
//             ],
//             imports: [
//                 MatCardModule,
//                 MatIconModule,
//                 RouterTestingModule.withRoutes([
//                     { path: 'zone_detail/:id', component: MockZoneDetailComponent },
//                     { path: 'sensor/:id', component: MockSensorDetailComponent }
//                 ])
//             ]
//         })
//         .compileComponents()
//         .then(() => {
//             fixture = TestBed.createComponent(ZoneListComponent);
//             component = fixture.componentInstance;
//         });
//     }));

//     it('#should the user role by checkUserRole function', () => {
//         component.checkUserRole();
//         expect(component.bIsZoneEditatble).toBeTruthy();
//     });

//     it('#should go to the suitable page by preload function', () => {
//         spyOn(component, 'getIndexFromArray').and.callFake(function(type: string, key: string) {
//             return 1;
//         });
//         spyOn(component, 'gotoZone');
//         spyOn(component, 'gotoSensor');
//         component.preload();
//         expect(component.gotoZone).toHaveBeenCalled();
//         expect(component.gotoSensor).toHaveBeenCalled();
//     });

//     it('#should check the key availability by getIndexFromArray function', () => {
//         component.zones = [{key: 'key'}];
//         const response = component.getIndexFromArray('zone', 'key');
//         expect(response).not.toEqual(-1);
//     });

//     it('#delete the item by deleteAction function', () => {
//         spyOn(component.loadPage, 'emit');
//         component.selectedZone = {
//             customerId: 'customerId'
//         };

//         component.deleteAction('zone', 'key');
//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect(component.loadPage.emit).toHaveBeenCalled();
//         });
//     });

//     it('#should delete the zone by deleteZone function', fakeAsync(() => {
//         spyOn(component, 'clearSensor');
//         spyOn(component, 'deleteAction');
//         component.selectedZone = {
//             sensors: []
//         };
//         component.deleteZone('key');
//         tick();
//         expect(component.clearSensor).toHaveBeenCalled();
//         expect(component.deleteAction).toHaveBeenCalled();
//     }));

//     it('#should delete the sensor by deleteSensor function', fakeAsync(() => {
//         spyOn(component, 'deleteAction');
//         component.deleteSensor('key');
//         tick();
//         expect(component.deleteAction).toHaveBeenCalled();
//         expect(component.bIsSelectedSensor).toBeFalsy();
//     }));

//     it('#create the zone by createZone function', () => {
//         component.customerId = '-key';
//         component.createZone();
//         expect((component as any)._router.navigate).toHaveBeenCalled();
//     });

//     it('#create the sensor by createSensor function', () => {
//         component.selectedZone = {};
//         component.createSensor();
//         expect((component as any)._router.navigate).toHaveBeenCalled();
//     });

// });

// class AuthServiceMockClass {
//     get userData(): Object {
//         return {
//             action: {
//                 role: global_variables['userRoles'][0]
//             }
//         };
//     }
// }

// class HttpServiceMock {
//     deleteAsObject(strUrl: string) {
//         return Promise.resolve(true);
//     }
// }

// class DataServiceMocks {
//     getString(strName: string) {
//         return 'admin';
//     }
// }

// @Component({
//     selector: 'app-sensor-detail',
//     template: '<p>sensor detail</p>'
// })
// class MockSensorDetailComponent {
//     @Input() selectedSensor: string;
//     @Input() sensorKey: string;
// }

// @Component({
//     selector: 'app-zone-detail',
//     template: '<p>zone detail</p>'
// })
// class MockZoneDetailComponent {
// }

// @Component({
//     selector: 'app-detail-viewer',
//     template: ''
// })
// class MockAppDetailViewerComponent {
//     @Input() strName: string;
//     @Input() strDescription: string;
// }

// class MockDialogComponent {
//     open(component: any, config: any) {
//         return {
//             afterClosed: function() {
//                 return Observable.of(true);
//             }
//         };
//     }
// }

/**
 * wrote in 2018/4/12
 * update in 2018/8/17
 * */
