import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import {
    ActivatedRoute,
    Router
} from '@angular/router';
import {
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import {
    ColorPickerModule
} from 'ngx-color-picker';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ZoneDetailComponent } from './zone-detail.component';


// describe('ZoneDetailComponent', () => {
//     let component: ZoneDetailComponent;
//     let fixture: ComponentFixture<ZoneDetailComponent>;
//     const NotificationMocks = {
//         createNotification: function(type: string, title: string, content: string) {
//             return true;
//         }
//     };

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [ ZoneDetailComponent ],
//                 imports: [
//                 MatRadioModule,
//                 MatFormFieldModule,
//                 MatSelectModule,
//                 MatCardModule,
//                 FormsModule,
//                 ReactiveFormsModule,
//                 ColorPickerModule,
//                 BrowserAnimationsModule,
//                 MatIconModule
//             ],
//             providers: [
//                 {
//                     provide: ActivatedRoute, useValue: {
//                         params: Observable.of({ id: '-id' })
//                     }
//                 },
//                 { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
//                 { provide: AuthService, useClass: AuthServiceMockClass },
//                 { provide: HttpService, useClass: HttpServiceMockClass },
//                 { provide: NotificationService, useValue: NotificationMocks },
//                 { provide: Location, useValue: { back: function() { return true; } } }
//             ],
//         })
//         .compileComponents()
//         .then(() => {
//             fixture = TestBed.createComponent(ZoneDetailComponent);
//             component = fixture.componentInstance;
//         });
//     }));

//     it('#should get the zone and sensors sensortype list via refreshing browser', async(() => {
//         spyOn(component, 'checkUserRole');
//         const mockHttpService = fixture.debugElement.injector.get(HttpService) as HttpServiceMockClass;
//         spyOn(mockHttpService, 'getAsObject').and.callThrough();
//         spyOn(mockHttpService, 'getListByOrder').and.callThrough();
//         mockHttpService.returnValue = [
//             {
//                 sensorTypeId: 'sensorType'
//             }
//         ];
//         component.ngOnInit();
//         fixture.detectChanges();
//         fixture.whenStable().then(() => {
//             expect(component.bIsPageLoading).toBeTruthy();
//             expect(component.checkUserRole).toHaveBeenCalled();
//         });
//     }));

//     it('#should check user role by checkUserRole function and the admin user should be editable the zone details parameters',
//         async(() => {
//         const mockAuthService = fixture.debugElement.injector.get(AuthService) as AuthServiceMockClass;
//         mockAuthService.bIsStaff = true;
//         mockAuthService.objStaffUser = {
//             action: {
//                 role: 'admin'
//             }
//         };
//         component.checkUserRole();
//         expect(component.bIsEditable).toBeTruthy();
//     }));

//     it('# zone parameter should be editable by editValue function', async(() => {
//         component.editValue(0, 'value');
//         expect(component.paramValue).toBe('value');
//     }));

//     it('#update the zone parameter by update function', async(() => {
//         spyOn(component, 'clearEdit');
//         component.status = 1;
//         component.paramValue = 'value';
//         component.currentZone = {
//             key: 'zone'
//         };
//         component.update();
//         fixture.whenStable().then(() => {
//             expect(component.clearEdit).toHaveBeenCalled();
//         });
//     }));

//     it('#clear the variables for edit paramters by clearEdit function', async(() => {
//         component.clearEdit();
//         expect(component.status).toBe(0);
//         expect(component.paramValue).toBe('');
//     }));

// });

// class AuthServiceMockClass {
//     loadAPI: Subject<any>;
//     bIsStaff: boolean;
//     objStaffUser: any;
//     objCustomerUser: any;

//     constructor() {
//         this.loadAPI = new Subject();
//     }

//     setUserData(companyData: any) {
//         this.loadAPI.next({
//             status: 2
//         });
//     }

//     get userData(): Object {
//         const user = this.bIsStaff ? this.objStaffUser : this.objCustomerUser;
//         return user;
//     }

//     get isCheckUser() {
//         return true;
//     }

//     get isUserEmailLoggedIn() {
//         return true;
//     }

//     get isUserStaff() {
//         return this.bIsStaff;
//     }
// }

// class HttpServiceMockClass {
//     returnValue: any;

//     getAsObject(strUrl: string, nTake: number = 0): Observable<any> {
//         return Observable.of(this.returnValue);
//     }

//     getListByOrder(strUrl: string, strOrder: string, strEqual: string, nTake: number = 0): Observable<any> {
//         return Observable.of(this.returnValue);
//     }

//     updateAsObject(strUrl: string, value: any): Promise<any> {
//         return Promise.resolve();
//     }
// }
/**
 * Update in 2018/4/12
 * */
