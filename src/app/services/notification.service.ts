import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class NotificationService {

  constructor(
    private _notificationsService: NotificationsService
  ) {
  }

  createNotification(type: string, title: string, content: string, options: Object = null) {
    switch (type) {
      case 'success':
        this._notificationsService.success(title, content, options);
        break;

      case 'alert':
        this._notificationsService.alert(title, content, options);
        break;

      case 'error':
        this._notificationsService.error(title, content, options);
        break;

      case 'info':
        this._notificationsService.info(title, content, options);
        break;

      case 'bare':
        this._notificationsService.bare(title, content, options);
        break;

      default:
        console.log('The alert type is not existed.');
        break;
    }
  }

}
