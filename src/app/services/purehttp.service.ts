import { Injectable } from '@angular/core';
import {
  Http,
  Response,
  Headers,
  RequestOptions
} from '@angular/http';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PurehttpService {
  options: RequestOptions;
  returnValue: any; // for a unit test

  constructor(private http: Http) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: headers });
  }

  // start checking sensor status
  callFirebaseFunction(strUrl: string, objPostData: Object = {}) {
    return this.http.post(strUrl, objPostData, this.options)
      .map((res: Response) => res.json())
      .catch((error: any) => this.handleError(error));
  }

  handleError(error: any) {
    const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }
}
