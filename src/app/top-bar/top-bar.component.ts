import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  Router,
  NavigationEnd,
  NavigationStart
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/event.service';
import { StorageManagerService } from '../services/storage-manager.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  bIsShown: boolean;
  strLogoUrl: string;
  strCompanyName: string;
  authServiceSub: any;

  constructor(
    private router: Router,
    private _authService: AuthService,
    private _location: Location,
    private _eventService: EventService,
    private _storageManagerService: StorageManagerService
  ) {
    this.bIsShown = false;
    this.strCompanyName = '';

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.bIsShown = false;
        this.checkAuth(event.url);
      }

      if (event instanceof NavigationStart) {
        if (event.url.includes('/auth/forgot_password') || event.url.includes('/auth/set_password')) {
          this.logoout(false);
        }
      }
    });
  }

  ngOnInit() {
  }

  logoout(bIsNavigate = true) {
    this._eventService.emit('logout');
    this._authService.logout(bIsNavigate);
  }

  gotoDashboard() {
    this.router.navigate(['/dashboard']);
  }

  back() {
    this._location.back();
  }

  init(url: string) {
    if (url.indexOf('/embed-map') !== 0 || url.indexOf('/reset') !== 0) {
      if ( this._authService.isUserEmailLoggedIn ) {
        const data = this._authService.companyData;
        this.strLogoUrl = data['logo'];
        this.strCompanyName = this._authService.isUserStaff ? 'Omniscent' : data['name'];
        this.bIsShown = true;
      } else {
        this.bIsShown = false;
      }
    }

  }

  checkAuth(url: string) {
    if (this.authServiceSub) {
      this.authServiceSub.unsubscribe();
    }
    this._storageManagerService.checkStorages().then(() => {
      if (this._authService.isCheckUser) { // get the user auth status already
        this.init(url);
      }

      this.authServiceSub = this._authService.loadAPI.subscribe((res: Object) => {
        if (res['status'] === 2) {
          this.init(url);
        }
      }, error => {
        console.log(error);
      });
    });
  }
}
