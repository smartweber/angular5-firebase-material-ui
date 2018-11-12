import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { AngularFireAuth } from 'angularfire2/auth';

import { global_variables } from '../../environments/global_variables';

// describe('AuthService', () => {
//     const AngularFireAuthMockValue = {
//         authState: Observable.of({
//             uid: '-uid'
//         }),
//         auth: {
//             createUserWithEmailAndPassword: (email: any, password: any) => {
//                 return Promise.resolve(true);
//             },
//             signInWithEmailAndPassword: (email: any, password: any) => {
//                 return Promise.resolve({uid: 'uid'});
//             },
//             signOut: () => {
//                 return true;
//             },
//             sendPasswordResetEmail: (email: string) => {
//                 return Promise.resolve(true);
//             }
//         }
//     };

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [
//                 AuthService,
//                 { provide: AngularFireAuth, useValue: AngularFireAuthMockValue },
//                 { provide: HttpService, useClass: HttpServiceMockClass }
//             ]
//         });
//     });

//     it('#should set user data and occur an set event by setUserData function', inject([AuthService], (service: AuthService) => {
//         service.setUserData({});
//         expect(service.bIsGetUserData).toBeTruthy();
//     }));

//     it('#should check company by checkCompany function', inject([AuthService], (service: AuthService) => {
//         spyOn(service, 'setUserData');
//         service.bIsStaff = true;
//         service.objStaffUser = {
//             action: {
//                 status: global_variables['userStatus'][0]
//             }
//         };

//         const mockHttpService = TestBed.get(HttpService) as HttpServiceMockClass;
//         spyOn(mockHttpService, 'getAsObject').and.callThrough();
//         mockHttpService.returnValue = {};
//         service.checkCompany();
//         expect(service.setUserData).toHaveBeenCalled();
//     }));

//     it('#should check user statusby checkUserStatus function', inject([AuthService], (service: AuthService) => {
//         spyOn(service, 'checkCompany');
//         service.checkUserStatus({ info: {} }, 'staff', 2);
//         expect(service.bIsStaff).toBeTruthy();
//         expect(service.checkCompany).toHaveBeenCalled();
//     }));

//     it('#should check user statusby getUserData function', inject([AuthService], (service: AuthService) => {
//         const mockHttpService = TestBed.get(HttpService) as HttpServiceMockClass;
//         spyOn(mockHttpService, 'getAsObject').and.callThrough();
//         mockHttpService.returnValue = {};

//         spyOn(service, 'checkUserStatus');
//         service.getUserData();
//         expect(service.checkUserStatus).toHaveBeenCalled();
//     }));

//     it('#should get auth check status by isCheckStatus function', inject([AuthService], (service: AuthService) => {
//         service.bIsGetUserData = true;
//         expect(service.isCheckUser).toBeTruthy();
//     }));

//     it('#should check if user is staff by isUserStaff function', inject([AuthService], (service: AuthService) => {
//         service.bIsStaff = true;
//         expect(service.isUserStaff).toBeTruthy();
//     }));

//     it('#should get user login status by isUserAnonymousLoggedIn function', inject([AuthService], (service: AuthService) => {
//         expect(service.isUserAnonymousLoggedIn).toBeFalsy();
//     }));

//     it('#should get user id by currentUserId function', inject([AuthService], (service: AuthService) => {
//         service.authState = {
//             uid: '-uid'
//         };
//         expect(service.currentUserId).toBe('-uid');
//     }));

//     it('#should get user email by currentUserName function', inject([AuthService], (service: AuthService) => {
//         service.authState = {
//             email: '-email'
//         };
//         expect(service.currentUserName).toBe('-email');
//     }));

//     it('#should get user by currentUser function', inject([AuthService], (service: AuthService) => {
//         service.authState = {
//             email: '-email'
//         };
//         expect(service.currentUser).toBe(service.authState);
//     }));

//     it('#should get user login status by isUserEmailLoggedIn function', inject([AuthService], (service: AuthService) => {
//         service.authState = {
//             email: '-email'
//         };
//         expect(service.isUserEmailLoggedIn).toBeTruthy();
//     }));

//     it('#should get user data by userData function', inject([AuthService], (service: AuthService) => {
//         service.bIsStaff = true;
//         service.objStaffUser = { info: {} };
//         expect(service.userData).toEqual(service.objStaffUser);
//     }));

//     it('#should send reset email by resetPassword function', inject([AuthService], (service: AuthService) => {
//         service.resetPassword('test@gmail.com').then((res) => {
//             expect(res).toBeTruthy();
//         });
//     }));

//     it('#should create an account by signUpWithEmail function', inject([AuthService], (service: AuthService) => {
//         service.signUpWithEmail('test@gmail.com', 'test1234').then((res) => {
//             expect(res).toBeTruthy();
//         });
//     }));

//     it('#should login by loginWithEmail function', inject([AuthService], (service: AuthService) => {
//         service.loginWithEmail('test@gmail.com', 'test');
//         expect(service.authState).toBeDefined();
//     }));
// });

// class HttpServiceMockClass {
//     returnValue: any;

//     getAsObject(strUrl: string, nTake: number = 0): Observable<any> {
//         return Observable.of(this.returnValue);
//     }
// }
/**
 * wrote in 2018/3/29
 * */
