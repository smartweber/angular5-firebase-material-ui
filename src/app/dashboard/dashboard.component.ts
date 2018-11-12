import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { global_variables } from '../../environments/global_variables';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  bIsLoading: boolean;

  strUserType: string;
  strUserRole: string;
  customerPath: string;

  userSub: Subscription;
  routeSub: Subscription;

  arrStrUserRoles: string[];
  arrStrUserTypes: string[];

  constructor(
    private _authService: AuthService,
    private _httpService: HttpService,
    private router: Router,
    private _activeRoute: ActivatedRoute
  ) {
      this.bIsLoading = false;
      this.strUserType = '';
      this.strUserRole = '';
      this.arrStrUserRoles = global_variables['userRoles'];
      this.arrStrUserTypes = global_variables['userTypes'];
  }

  ngOnInit() {
    this.customerPath = null;

    // get customer portal id
    this.routeSub = this._activeRoute.params.subscribe(params => {
      this.customerPath = params['customerId'];

      if (this._authService.isCheckUser && this._authService.isUserEmailLoggedIn) {
        this.checkUserAuthentication();
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }

    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  checkUserAuthentication() {
    if (this._authService.isUserStaff) { // staff case
      if (this.customerPath) {
        this.router.navigate(['/dashboard']);
        return;
      }

      this.userSub = this._httpService
      .getAsObject(`${environment.APIS.USERS}/${this.arrStrUserTypes[0]}/${this._authService.currentUserId}`).subscribe(user => {
        if (user && user['info'] && user['action']) {
          this.setUserRole(user);
          this.strUserType = this.arrStrUserTypes[0];
          this.bIsLoading = true;
        } else {
          console.log('Log out because there is no user in staff table');
          this._authService.logout();
        }
      },
      error => {
        console.log(error);
      });

    } else { // customer case
      if (!this.customerPath) {
        const data = this._authService.companyData;
        this.router.navigate([`/${data['path']}/dashboard`]);
        return;
      }

      this.userSub = this._httpService
      .getAsObject(`${environment.APIS.USERS}/${this.arrStrUserTypes[1]}/${this._authService.currentUserId}`).subscribe(user => {
        if (user['info']['email'] && user['action']['status'] === 'approved') {
          this.setUserRole(user);
          this.strUserType = this.arrStrUserTypes[1];
          this.bIsLoading = true;
        } else {
          console.log('Log out because there is no user in customer table');
          this._authService.logout();
        }
      },
      error => {
        console.log(error);
      });
    }
  }

  // set user role
  setUserRole(user: Object) {
    this.strUserRole = user['action']['role'];
  }

  gotoCustomer() {
    this.router.navigate(['/customer'], { queryParams: {type: 'list'} });
  }

  gotoZone() {
    if (this.customerPath) {
      this.router.navigate([`/${this.customerPath}/zone`], { queryParams: {type: 'list'} });
    } else {
      this.router.navigate(['/zone'], { queryParams: {type: 'list'} });
    }
  }

  gotoSensorList() {
    if (this.customerPath) {
      this.router.navigate([`/${this.customerPath}/sensor_list`]);
    } else {
      this.router.navigate(['sensor_list']);
    }
  }

  gotoSensorTypes() {
    if (this.customerPath) {
      this.router.navigate([`/${this.customerPath}/sensor_type_list`]);
    } else {
      this.router.navigate(['sensor_type_list']);
    }
  }

  gotoSensorTypeEdit() {
    if (this.customerPath) {
      this.router.navigate([`/${this.customerPath}/sensor_type`]);
    } else {
      this.router.navigate(['/sensor_type']);
    }
  }

  gotoAdmin() {
    if (this.customerPath) {
      this.router.navigate([`/${this.customerPath}/admin`]);
    } else {
      this.router.navigate(['/admin']);
    }
  }

}
