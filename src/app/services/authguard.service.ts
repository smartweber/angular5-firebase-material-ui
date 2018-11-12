import {
  Injectable
} from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { global_variables } from '../../environments/global_variables';
import { AuthService } from './auth.service';

@Injectable()
export class AuthguardService implements CanActivate {
  currentUser: any;

  arrStrUserTypes: string[];

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {
    this.arrStrUserTypes = global_variables['userTypes'];
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const roles = route.data['roles'] as Array<string>;
    const types = route.data['types'] as Array<string>;

    if (this._authService.isCheckUser) {
      return this.checkAuthStatus(roles, types);
    } else {
      const status: Promise<boolean> = new Promise((resolve, reject) => {
        this._authService.loadAPI.subscribe((res: Object) => {
          console.log('--authguard--');
          console.log(res);
          if (res['status'] === 2) {
            resolve(this.checkAuthStatus(roles, types));
          } else {
            this.logout();
            resolve(false);
          }
        },
        error => {
          console.log(error);
          resolve(false);
        });
      });

      return status;
    }
  }

  checkAuthStatus(roles: string[], types: string[]) {
    if (this._authService.isUserEmailLoggedIn) {
      const userData = this._authService.userData;
      const userType = this._authService.isUserStaff ? this.arrStrUserTypes[0] : this.arrStrUserTypes[1];
      const userRole = (userData && userData['action']) ? userData['action']['role'] : '';

      if (!roles && !types) {
        return true;
      }

      if (roles && roles.indexOf(userRole) === -1) {
        this.gotoDashboard();
        return false;
      }

      if (types && types.indexOf(userType) === -1) {
        this.gotoDashboard();
        return false;
      }

      return true;
    } else {
      this.logout();
      return false;
    }
  }

  gotoDashboard() {
    if (this._authService.isUserStaff) {
      this._router.navigate(['/dashboard']);
    } else {
      this._router.navigate([`/${this._authService.companyData['path']}/dashboard`]);
    }
  }

  logout() {
    this._authService.logout();
  }
}

