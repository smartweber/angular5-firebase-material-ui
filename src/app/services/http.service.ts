import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

@Injectable()
export class HttpService {
  returnValue: any; // for only unit test

  constructor(
    private db: AngularFireDatabase
  ) {
  }

  getAsObject(strUrl: string, nTake: number = 0): Observable<any> {
    if (nTake === 0) {
      return this.db.object(strUrl).snapshotChanges().map((action) => {
        return this.convertToValue(action);
      });
    }

    return this.db.object(strUrl).snapshotChanges().take(nTake).map((action) => {
      return this.convertToValue(action);
    });
  }

  getAsList(strUrl: string, nTake: number = 0): Observable<any> {
    if (nTake === 0) {
      return this.db.list(strUrl).snapshotChanges().map((arr) => {
        return arr.map((action) => {
          return this.convertToValue(action);
        });
      });
    }

    return this.db.list(strUrl).snapshotChanges().take(nTake).map((arr) => {
      return arr.map((action) => {
        return this.convertToValue(action);
      });
    });
  }

  getListByOrder(strUrl: string, strOrder: string, strEqual: string, nTake: number = 0): Observable<any> {
    if (nTake === 0) {
      return this.db.list(strUrl, ref => ref.orderByChild(strOrder).equalTo(strEqual)).snapshotChanges().map((arr) => {
        return arr.map((action) => {
          return this.convertToValue(action);
        });
      });
    }

    return this.db.list(strUrl, ref => ref.orderByChild(strOrder).equalTo(strEqual)).snapshotChanges().take(nTake).map((arr) => {
      return arr.map((action) => {
        return this.convertToValue(action);
      });
    });
  }

  postAsObject(strUrl: string, value: any): Promise<any> {
    return this.db.object(strUrl).set(value);
  }

  createAsList(strUrl: string, value: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db.list(strUrl).push(value).then((res) => {
        resolve(res['key']);
      });
    });
  }

  updateAsObject(strUrl: string, value: any): Promise<any> {
    return this.db.object(strUrl).update(value);
  }

  deleteAsObject(strUrl: string): Promise<any> {
    return this.db.object(strUrl).remove();
  }

  convertToValue(res: any) {
    const returnVal = res.payload.val();
    if (!returnVal) {
      if (res['key']) {
        return {
          key: res['key'],
          $value: returnVal === 0 ? 0 : null
        };
      } else {
        return null;
      }
    }

    if (typeof returnVal === 'object') {
      returnVal['key'] = res['key'];
      return returnVal;
    } else {
      return {
        key: res['key'],
        $value: returnVal
      };
    }
  }
}
