import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  MatDialog,
  MatSnackBar,
  MatPaginator,
  MatTableDataSource
} from '@angular/material';

import { environment } from '../../environments/environment.dev';
import { global_variables } from '../../environments/global_variables';
import { HttpService } from '../services/http.service';
import { PurehttpService } from '../services/purehttp.service';
import { AuthService } from '../services/auth.service';
import { SpinnerService } from '../components/spinner/spinner.service';

import { UserModalComponent } from '../modals/user-modal/user-modal.component';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { InviteModalComponent } from '../modals/invite-modal/invite-modal.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  arrObjCustomerUsers: Object[];
  arrObjStaffUsers: Object[];
  arrObjCustomerList: Object[];
  arrObjUserTypes: Object[];
  arrCustomerPortals: Object[];
  arrStrUserTypes: string[];
  arrStrDisplayedColumns: string[];

  bIsShowCustomerMenu: boolean;
  bIsPageLaoded: boolean;
  bIsNavBar: boolean;
  bIsNavBarController: boolean;
  bIsStaffUser: boolean;

  nUserType: number;
  nUserCounter: number;

  strSearchText: string;
  strSelectedCustomerKey: string;
  dataSource: any;

  usersSub: Subscription;
  customerUserSub: Subscription;
  portalSub: Subscription;
  routeSub: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @HostListener('window:resize', ['$event']) onResize(event) {
    // guard against resize before view is rendered
    this.checkWindows(event.target.innerWidth);
  }

  constructor(
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    public _httpService: HttpService,
    public _pureHttpService: PurehttpService,
    private _spinner: SpinnerService,
    private _authService: AuthService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.arrObjCustomerUsers = [];
    this.arrObjCustomerList = [];
    this.arrObjStaffUsers = [];
    this.arrCustomerPortals = [];
    this.init();

    this.bIsShowCustomerMenu = false;
    this.bIsPageLaoded = false;
    this.bIsNavBar = true;
    this.bIsNavBarController = false;
    this.bIsStaffUser = false;

    this.strSelectedCustomerKey = '';
    this.nUserType = -1; // 0: staff, 1: customer

    this.arrStrUserTypes = global_variables['userTypes'];
    this.arrStrDisplayedColumns = ['position', 'email', 'role', 'status', 'actions'];

    this.arrObjUserTypes = [
      {
        label: 'Omniscent Staff',
        value: this.arrStrUserTypes[0]
      },
      {
        label: 'Customer User',
        value: this.arrStrUserTypes[1]
      }
    ];
  }

  ngOnDestroy() {
    if (this.usersSub) {
      this.usersSub.unsubscribe();
    }

    if (this.customerUserSub) {
      this.customerUserSub.unsubscribe();
    }

    if (this.portalSub) {
      this.portalSub.unsubscribe();
    }

    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.arrObjCustomerUsers = [];
    this.checkWindows(window.innerWidth);

    this.routeSub = this._route.queryParams
      .subscribe(params => {
        if (params.approval) {
          let data = atob(params.approval);
          data = JSON.parse(data);
          if (data['userId'] && data['userType']) {
            if (data['userType'] === this.arrStrUserTypes[0]) { // staff case
              this._spinner.start();
              this._httpService.getAsObject(
                `${environment['APIS']['USERS']}/staffs/${data['userId']}`,
                1
              ).subscribe((user) => {
                if (user) {
                  this.onSelectStaff();
                  this.onEditUser({
                    key: user['key'],
                    email: user['info']['email'],
                    role: user['action']['role'],
                    status: user['action']['status']
                  });
                }

                this._spinner.stop();
              }, error => {
                console.log(error);
              });

            } else if (data['userType'] === this.arrStrUserTypes[1]) { // customer case
              this.onSelectCustomerArea();
            }
          }
        }
      });

    if (this._authService.isCheckUser && this._authService.isUserEmailLoggedIn) { // user already login
      this.getCustomerList();
    }
  }

  onInvite(event: any) {
    event.preventDefault();

    const config = {
      width: '400px',
      disableClose: true,
      data: {
        type: (this.nUserType === 0) ? this.arrStrUserTypes[0] : this.arrStrUserTypes[1]
      }
    };
    const dialogRef = this.dialog.open(InviteModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result['email'] && result['role']) {
          this.sendInviation(result['email'], result['role']);
        } else {
          this._snackBar.open('Empty email or role for a inviation user', 'Error', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        }
      }
    });
  }

  sendInviation(email: string, role: string) {
    const data = {
      email: email,
      userType: this.nUserType,
      role: role,
      customerKey: this.strSelectedCustomerKey ? this.strSelectedCustomerKey : ''
    };

    const encodeData = btoa(JSON.stringify(data));
    const url = window.location.href;
    const arr = url.split('/');
    const result = arr[0] + '//' + arr[2];
    const inviteUrl = `${result}/auth/set_password?data=${encodeData}`;

    const strFireFunctionUrl = global_variables['FirebaseFunctionUrlCloud']; // cloud
    // let strFireFunctionUrl = global_variables.FirebaseFunctionUrlLocal; // local

    const objPostData = {
      to: email,
      content: 'To create your account, please click this <a href="' + inviteUrl + '">link</a>'
    };
    this._spinner.start();

    this._pureHttpService.callFirebaseFunction(`${strFireFunctionUrl}/sendInvitation`, objPostData).subscribe((res: any) => {
      this._spinner.stop();
      if (res.status === 'success') {
        this._snackBar.open('Invitation email is successfully sent', 'Success', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      } else {
        this._snackBar.open('Fail to send a invitation because of mail service', 'Error', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    }, error => {
      this._spinner.stop();
      console.log(error);
      this._snackBar.open('Fail to send a invitation because of internet connection', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    });
  }

  getCustomerList() {
    if (this._authService.isUserStaff) { // staff user case
      this.bIsStaffUser = true;

      // get customer list
      this.portalSub = this._httpService.getAsList(environment['APIS']['CUSTOMERS']).subscribe((customerInfos) => {
        if (customerInfos) {
          this.arrObjCustomerList = customerInfos.map((info) => {
            return {
              key: info['key'],
              name: info['name']
            };
          });
        }

        this._spinner.stop();
      }, error => {
        this._spinner.stop();
        window.location.reload();
        this._snackBar.open('Permission or internet connection error', 'Error', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        console.log(error);
      });
    } else { // customer user case
      this.bIsStaffUser = false;

      this.portalSub = this._httpService.getAsObject(
        `${environment['APIS']['CUSTOMERS']}/${this._authService.objCustomerUser['info']['customerId']}`
      ).subscribe((customer) => {
        if (customer) {
          this.arrObjCustomerList = [{
            key: customer['key'],
            name: customer['name']
          }];
        }

        this._spinner.stop();
      }, error => {
        this._spinner.stop();
        this._snackBar.open('Permission or internet connection error', 'Error', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        console.log(error);
      });
    }
  }

  checkWindows(nWidth: number) {
    if (nWidth > 672) {
      this.bIsNavBarController = false;
      this.bIsNavBar = true;
    } else {
      this.bIsNavBarController = true;
      this.bIsNavBar = false;
    }
  }

  init() {
    this.strSearchText = '';
    this.strSelectedCustomerKey = '';
    this.bIsPageLaoded = false;
  }

  initDataTable(users: Object[], nCount: number = 0) {
    if (nCount > 30) {
      this._snackBar.open('Timeout to bind the table paginator.', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    } else if (!this.paginator) {
      nCount ++;
      setTimeout(() => this.initDataTable(users, nCount), 50);
    } else {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
    }
  }

  onUpdateFilter(event: any) {
    let filterValue = event.target.value.toLowerCase();

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  onSelectCustomerArea() {
    this.bIsShowCustomerMenu = !this.bIsShowCustomerMenu;
    this.nUserType = 1;
  }

  onSelectStaff() {
    if (this.usersSub) {
      this.usersSub.unsubscribe();
    }

    this.init();
    this.bIsShowCustomerMenu = false;
    this._spinner.start();
    this.usersSub = this._httpService.getAsList(`${environment['APIS']['USERS']}/staffs`).subscribe((users) => {
      let nPos = 0;

      this.arrObjStaffUsers = users.map((user) => {
        nPos ++;

        if (!user.hasOwnProperty('action') || !user['action'].hasOwnProperty('status')) {
          user['status'] = global_variables['userStatus'][1];
        } else {
          user['status'] = user['action']['status'];
        }

        if (!user.hasOwnProperty('action')) {
          user['role'] = '';
        } else {
          user['role'] = user['action']['role'];
          delete user['action'];
        }

        user['email'] = user['info']['email'];
        user['position'] = nPos;
        delete user['info'];
        return user;
      });

      this._spinner.stop();
      this.nUserType = 0;
      this.bIsPageLaoded = true;
      this.initDataTable(this.arrObjStaffUsers);
    }, error => {
      this._spinner.stop();
      console.log(error);
      this._router.navigate(['/dashboard']);
    });
  }

  onSelectCustomer(strCustomerKey: string) {
    if (this.customerUserSub) {
      this.customerUserSub.unsubscribe();
    }

    this.init();
    this.strSelectedCustomerKey = strCustomerKey;
    this._spinner.start();

    this.customerUserSub = this._httpService.getListByOrder(
      `${environment['APIS']['USERS']}/${this.arrStrUserTypes[1]}`,
      'info/customerId',
      strCustomerKey
    ).subscribe((users) => {
      let nPos = 0;

      this.arrObjCustomerUsers = users.map((user) => {
        nPos ++;

        if (!user.hasOwnProperty('action') || !user['action'].hasOwnProperty('status')) {
          user['status'] = global_variables['userStatus'][1];
        } else {
          user['status'] = user['action']['status'];
        }

        user['role'] = user['action'] ? user['action']['role'] : '';
        user['email'] = user['info']['email'];
        user['position'] = nPos;
        delete user['action'];
        delete user['info'];
        return user;
      });

      this.initDataTable(this.arrObjCustomerUsers);
      this.nUserType = 1;
      this._spinner.stop();
      this.bIsPageLaoded = true;
    }, error => {
      this._spinner.stop();
      console.log(error);
    });
  }

  onEditUser(user: Object) {
    if (user.hasOwnProperty('key')) {
      const config = {
        width: '400px',
        disableClose: true,
        data: {
          user: user,
          type: (this.nUserType === 0) ? this.arrStrUserTypes[0] : this.arrStrUserTypes[1]
        }
      };
      const dialogRef = this.dialog.open(UserModalComponent, config);
    } else {
      this._snackBar.open('The user key isn\'t exist.', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }
  }

  onDeleteUser(user: Object) {
    if (user.hasOwnProperty('key')) {
      const config = {
        disableClose: true,
        data: {
          title: 'Delete',
          description: 'Are you sure to delete the user?'
        }
      };
      const dialogRef = this.dialog.open(ConfirmModalComponent, config);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteUserAction(user['key']);
        }
      });
    } else {
      this._snackBar.open('The user key isn\'t exist.', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }
  }

  // action which delete the user
  deleteUserAction(userKey: string) {
    this._spinner.start();
    const strFireFunctionUrl = global_variables['FirebaseFunctionUrlCloud']; // cloud
    // let strFireFunctionUrl = global_variables.FirebaseFunctionUrlLocal; // local

    const objPostData = {
      systemMode: environment['SystemType'],
      userKey: userKey,
      userType: (this.nUserType === 0) ? this.arrStrUserTypes[0] : this.arrStrUserTypes[1]
    };

    this._pureHttpService.callFirebaseFunction(`${strFireFunctionUrl}/deleteUser`, objPostData).subscribe(res => {
      this._spinner.stop();
      this._snackBar.open('User deletion is successful!', 'Success', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }, error => {
      this._spinner.stop();
      this._snackBar.open('Fail to delete the user.', 'Error', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      console.log(error);
    });
  }

  onToggleNavBar() {
    this.bIsNavBar = this.bIsNavBar ? false : true;
  }
}
