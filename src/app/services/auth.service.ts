import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment.dev';
import { global_variables } from '../../environments/global_variables';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  authState: any = null;
  nUserTypeCount: number;
  bIsStaff: boolean;
  bIsGetUserData: boolean;

  objCustomerUser: Object;
  objStaffUser: Object;
  objCompanyData: Object;

  loadAPI: Subject<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private httpService: HttpService,
    private router: Router
  ) {
    this.bIsStaff = false;
    this.bIsGetUserData = false;
    this.nUserTypeCount = 0;
    this.loadAPI = new Subject();

    this.afAuth.authState.subscribe((auth) => {
      this.bIsGetUserData = false;
      this.authState = auth;

      if (this.authState) {
        this.getUserData();
      } else {
        this.bIsGetUserData = true;
        this.loadAPI.next({
          status: -1
        });
      }
    },
    error => {
      this.bIsGetUserData = true;
      this.authState = null;
      this.loadAPI.next({
        status: 0,
        message: 'Firebase connection error'
      });
    });
  }

  setUserData(companyData: Object) {
    if (companyData) {
      this.objCompanyData = companyData;
      this.bIsGetUserData = true;
      this.loadAPI.next({
        status: 2
      });
    } else {
      this.bIsGetUserData = true;
      this.loadAPI.next({
        status: 1,
        message: 'Your company information isn\'t enough at a moment. Please contact support team'
      });
    }
  }

  checkCompany() {
    const user = this.bIsStaff ? this.objStaffUser : this.objCustomerUser;

    if (user.hasOwnProperty('action') && user['action']['status'] === global_variables['userStatus'][0]) {
      if (this.bIsStaff) {
        this.httpService.getAsObject(environment['APIS']['STAFFINFO'], 1).subscribe(staffInfo => {
          this.setUserData(staffInfo);
        },
        error => {
          console.log(error);
          this.bIsGetUserData = true;
          this.loadAPI.next({
            status: 0,
            message: 'Firebase Connection Error'
          });
        });
      } else {
        this.httpService.getAsObject(
          `${environment['APIS']['CUSTOMERPORTALS']}/${user['info']['customerId']}`,
          1
        ).subscribe(companyInfo => {
          this.setUserData(companyInfo);
        },
        error => {
          console.log(error);
          this.bIsGetUserData = true;
          this.loadAPI.next({
            status: 0,
            message: 'Firebase Connection Error'
          });
        });
      }
    } else {
      this.bIsGetUserData = true;
      this.loadAPI.next({
        status: 1,
        message: 'Your account is pending approval, Please wait until Admin activates yours.'
      });
    }
  }

  checkUserStatus(user: Object, userType: string, fitCounter: number) {
    if (userType === 'customer') {
      this.objCustomerUser = user;
    } else {
      this.objStaffUser = user;
    }

    if (fitCounter > 1) {
      if (this.objCustomerUser && this.objCustomerUser['info']) {
        this.bIsStaff = false;
        this.checkCompany();
        return;
      } else if (this.objStaffUser && this.objStaffUser['info']) {
        this.bIsStaff = true;
        this.checkCompany();
        return;
      } else {
        this.bIsGetUserData = true;
        this.loadAPI.next({
          status: 1,
          message: 'Your account isn\'t existed'
        });
      }
    }
  }

  getUserData() {
    let fitCounter = 0;

    /*=== Customer ===*/
    this.httpService.getAsObject(`${environment['APIS']['USERS']}/customers/${this.currentUserId}`, 1).subscribe(user => {
      fitCounter ++;
      this.checkUserStatus(user, 'customer', fitCounter);
    },
    error => {
      console.log(error);
      this.bIsGetUserData = true;
      this.loadAPI.next({
        status: 0,
        message: 'Firebase connection error'
      });
    });
    /*=== Customer ===*/

    /*=== Staff ===*/
    this.httpService.getAsObject(`${environment['APIS']['USERS']}/staffs/${this.currentUserId}`, 1).subscribe(user => {
      fitCounter ++;
      this.checkUserStatus(user, 'staff', fitCounter);
    },
    error => {
      console.log(error);
      this.bIsGetUserData = true;
      this.loadAPI.next({
        status: 0,
        message: 'Firebase connection error'
      });
    });
    /*=== Staff ===*/
  }

  get isCheckUser(): boolean {
    return this.bIsGetUserData;
  }

  get isUserStaff(): boolean {
    return this.bIsStaff;
  }

  get isUserAnonymousLoggedIn(): boolean {
    return (this.authState !== null) ? this.authState.isAnonymous : false;
  }

  get currentUserId(): string {
    return (this.authState !== null) ? this.authState.uid : '';
  }

  get currentUserName(): string {
    return this.authState['email'];
  }

  get currentUser(): any {
    return (this.authState !== null) ? this.authState : null;
  }

  get isUserEmailLoggedIn(): boolean {
    if ((this.authState !== null) && (!this.isUserAnonymousLoggedIn) && this.bIsGetUserData) {
      return true;
    } else {
      return false;
    }
  }

  get userData(): Object {
    const user = this.bIsStaff ? this.objStaffUser : this.objCustomerUser;

    if (this.bIsStaff) {
      return user['info'] ? user : null;
    } else {
      return (user['info'] && user['info']['customerId']) ? user : null;
    }

  }

  get companyData(): Object {
    return this.objCompanyData;
  }

  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  signUpWithEmail(email: string, password: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  loginWithEmail(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        this.bIsGetUserData = false;
        // this.getUserData();
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  }

  logout(bIsNavigate = true, bIsReturnUrl = true, customerPath = '') {
    const mainUri = customerPath ? `/${ customerPath }/login` : '/login';
    return this.afAuth.auth.signOut().then(() => {
      if (bIsNavigate) {
        // if (bIsReturnUrl) {console.log(this.router.url);
        //   return this.router.navigate([mainUri], { queryParams: { returnUrl: this.router.url }});
        // } else {
        //   return this.router.navigate([mainUri]);
        // }
        return this.router.navigate([mainUri]);
      }
    });
  }
}
