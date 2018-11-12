import { Injectable } from '@angular/core';
declare var require: any;

@Injectable()
export class StorageManagerService {

  constructor() { }

  checkStorages() {
    return new Promise<any>((resolve) => {
      const localAppVersion = localStorage.getItem('omniscent_app_version');
      const serverAppVersion = require('../../../package.json').version;

      if (localAppVersion !== serverAppVersion) {
        this.clearStorage().then(() => {
          this.refresh();
          return resolve();
        });
      } else {
        this.refresh();
        return resolve();
      }
    });
  }

  refresh() {
    if (localStorage.getItem('omniscent_remove_cache')) {
      window.location.reload();
      localStorage.removeItem('omniscent_remove_cache');
    }
  }

  clearStorage() {
    return new Promise<any>((resolve) => {
      localStorage.clear();
      sessionStorage.clear();
      return Promise.all(
        [
          this.clearCacheStorage(),
          this.clearIndexedDb('firebaseLocalStorageDb')
        ]
      ).then(() => {
        localStorage.setItem('omniscent_app_version', require('../../../package.json').version);
        return resolve(true);
      });
    });
  }

  clearCacheStorage() {
    return new Promise<any>((resolve) => {
      const promises = [];

      caches.keys().then((cacheNames) => {
        cacheNames.map((cacheName) => {
          promises.push(caches.delete(cacheName));
        });
      });

      Promise.all(
        promises
      ).then(() => {
        return resolve(true);
      }).catch(() => {
        return resolve(false);
      });
    });
  }

  clearIndexedDb(name: string) {
    return new Promise<any>((resolve) => {
      if (window.indexedDB) {
        let request = null;

        // #region Create or open an existing indexeddb
        request = window.indexedDB.open(name, 1);

        request.onerror = (event) => {
          // Do something with request.errorCode!
          console.log('Error ', event);
          return resolve(false);
        };

        request.onsuccess = (event) => {
          console.log('Success ', event);

          const db = event.target.result;

          // Needed if indexeddb is open while trying to delete it.
          // This MIGHT need to be added to existing code.
          db.onversionchange = (dbEvent) => {
            console.log('version change', dbEvent);

            // If indexeddb was open, then newVersion will be null when trying to delete it.
            if (dbEvent.newVersion == null) {
              dbEvent.target.close();
              localStorage.setItem('omniscent_remove_cache', 'done');
            }
            return resolve(true);
          };
        };
        // #endregion

        // #regin DELETE indexeddb
        const DBDeleteRequest = window.indexedDB.deleteDatabase(name);

        DBDeleteRequest.onerror = (event) => {
          console.log('Error deleting database.', event);
          localStorage.setItem('omniscent_remove_cache', 'done');
          return resolve(false);
        };

        DBDeleteRequest.onsuccess = (event) => {
          console.log('Database deleted successfully', event);
          localStorage.setItem('omniscent_remove_cache', 'done');
          return resolve(true);
        };

        DBDeleteRequest.onblocked = (event) => {
          console.log('Error message: Database in blocked state. ', event);
          // return resolve(false);
        };
        // #endregion
      } else {
        console.log('Your browser doesn\'t support a stable version of IndexedDB. Such and such feature will not be available.');
        return resolve(false);
      }
    });
  }

}
