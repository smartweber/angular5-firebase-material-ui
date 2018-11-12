import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockMatModule } from '../core/spec/mock-mat/mock-mat.module';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';
import {
    Router,
    ActivatedRoute
} from '@angular/router';
import {
    MatSnackBar
} from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { Location } from '@angular/common';
import { ConfigureComponent } from './configure.component';
import { global_variables } from '../../environments/global_variables';

// describe('InputComponent', () => {
//     let component: ConfigureComponent;
//     let fixture: ComponentFixture<ConfigureComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [ ConfigureComponent ],
//             imports: [
//                 MockMatModule
//             ],
//             providers: [
//                 { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
//                 {
//                     provide: ActivatedRoute, useValue: {
//                         params: Observable.of({ sensorKey: '-sensorKey' })
//                     }
//                 },
//                 { provide: HttpService, useClass: HttpServiceMockClass },
//                 { provide: AuthService, useClass: AuthServiceMockClass },
//                 { provide: MatSnackBar, useClass: SnackModalMockClass },
//                 { provide: Location, useValue: { back: function() { return true; } } }
//             ],
//         })
//         .compileComponents()
//         .then(() => {
//             fixture = TestBed.createComponent(ConfigureComponent);
//             component = fixture.componentInstance;
//         });
//     }));

//     it('#should display the config data via refreshing browser', async(() => {
//         const mockAuthService = fixture.debugElement.injector.get(AuthService) as AuthServiceMockClass;
//         mockAuthService.bIsStaff = true;
//         spyOn(component, 'setConfigData');
//         component.ngOnInit();
//         expect(component.strCurrentUserType).toBe(component.arrStrUserTypes[0]);
//         expect(component.bIsLoadData).toBeTruthy();
//         expect(component.setConfigData).toHaveBeenCalled();
//     }));

//     it('#should set the config data to the view by setConfigData function', async(() => {
//         const configData = <any>{};
//         component.arrObjConfigData[0] = <any>{};
//         component.arrBIsConfig[0] = false;
//         configData[global_variables['DataTypes'][0]] = {
//             Num_of_Step: 1,
//             Num_of_Cycle: 2
//         };
//         component.setConfigData(configData, 0);
//         expect(component.arrBIsConfig[0]).toBeTruthy();
//     }));
// });

// class HttpServiceMockClass {
//     getAsObject(strUrl: string, nTake: number = 0): Observable<any> {
//         const returnValue = {
//             Current_Modal_Type: 0,
//             0: <any>{}
//         };
//         returnValue[0][global_variables['DataTypes'][0]] = '';
//         return Observable.of(returnValue);
//     }
// }

// class AuthServiceMockClass {
//     loadAPI: Subject<any>;
//     bIsStaff: boolean;
//     objStaffUser: any;
//     objCustomerUser: any;

//     constructor() {
//         this.loadAPI = new Subject();
//     }

//     get isUserEmailLoggedIn() {
//         return true;
//     }

//     get isUserStaff() {
//         return this.bIsStaff;
//     }

//     get currentUserId(): string {
//         return '-userId';
//     }
// }

// class SnackModalMockClass {
//     open(des: string, title: string, config: Object) {
//         return true;
//     }
// }
/**
 * wrote in 2018/3/30
 * update in 2018/8/10
*/
