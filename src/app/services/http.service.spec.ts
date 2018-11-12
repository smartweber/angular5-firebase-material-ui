import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpService } from './http.service';
import { AngularFireDatabase } from 'angularfire2/database';

// describe('HttpService', () => {
//   const AngularFireDatabaseMockValues = {
//     object: (strUrl: string) => {
//       return {
//         snapshotChanges: () => {
//           return Observable.of({ data : 1 });
//         },
//         set: (value: any) => {
//           return true;
//         },
//         update: (value: any) => {
//           return true;
//         },
//         remove: () => {
//           return true;
//         }
//       };
//     },
//     list: (strUrl: string, ref: any = null) => {
//       return {
//         snapshotChanges: () => {
//           return Observable.of([{ data : 1 }]);
//         },
//         push: (value: any) => {
//           return Promise.resolve({
//             key: 'key'
//           });
//         }
//       };
//     }
//   };

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         HttpService,
//         { provide: AngularFireDatabase, useValue: AngularFireDatabaseMockValues }
//       ]
//     });
//   });

//   it('#should get the data as object by getAsObject function', inject([HttpService], (service: HttpService) => {
//     spyOn((service as any).db, 'object').and.callFake(() => {
//       return {
//         snapshotChanges: () => {
//           return Observable.of({});
//         }
//       };
//     });
//     service.getAsObject('test.com/url');
//     expect((service as any).db.object).toHaveBeenCalled();
//   }));

//   it('#should get the data as list by getAsList function', inject([HttpService], (service: HttpService) => {
//     spyOn((service as any).db, 'list').and.callFake(() => {
//       return {
//         snapshotChanges: () => {
//           return Observable.of([{}]);
//         }
//       };
//     });
//     service.getAsList('test.com/url');
//     expect((service as any).db.list).toHaveBeenCalled();
//   }));

//   it('#should get the data as list by getListByOrder function', inject([HttpService], (service: HttpService) => {
//     spyOn((service as any).db, 'list').and.callFake(() => {
//       return {
//         snapshotChanges: () => {
//           return Observable.of([{}]);
//         }
//       };
//     });
//     service.getListByOrder('test.com/url', 'timestamp', '1111');
//     expect((service as any).db.list).toHaveBeenCalled();
//   }));

//   it('#should post the data as object by postAsObject function', inject([HttpService], (service: HttpService) => {
//     spyOn((service as any).db, 'object').and.callFake(() => {
//       return {
//         set: () => {
//           return true;
//         }
//       };
//     });
//     service.postAsObject('test.com/url', 'timestamp');
//     expect((service as any).db.object).toHaveBeenCalled();
//   }));

//   it('#should post the data as list by createAsList function', inject([HttpService], (service: HttpService) => {
//     spyOn((service as any).db, 'list').and.callFake(() => {
//       return {
//         push: (value) => {
//           return Promise.resolve({key: 'key'});
//         }
//       };
//     });
//     service.createAsList('test.com/url', 'timestamp');
//     expect((service as any).db.list).toHaveBeenCalled();
//   }));

//   it('#should update the data as object by updateAsObject function', inject([HttpService], (service: HttpService) => {
//     spyOn((service as any).db, 'object').and.callFake(() => {
//       return {
//         update: () => {
//           return true;
//         }
//       };
//     });
//     service.updateAsObject('test.com/url', 'timestamp');
//     expect((service as any).db.object).toHaveBeenCalled();
//   }));

//   it('#should delete the data as object by deleteAsObject function', inject([HttpService], (service: HttpService) => {
//     spyOn((service as any).db, 'object').and.callFake(() => {
//       return {
//         remove: () => {
//           return true;
//         }
//       };
//     });
//     service.deleteAsObject('test.com/url');
//     expect((service as any).db.object).toHaveBeenCalled();
//   }));

//   it('#should convert the firebase response to json object value by convertToValue function',
//     inject([HttpService], (service: HttpService) => {
//     const firebaseResponse = {
//       payload: {
//         val: () => {
//           return { data: 'data' };
//         }
//       },
//       key: 'key'
//     };

//     const val = service.convertToValue(firebaseResponse);
//     expect(typeof val === 'object').toBeTruthy();
//   }));
// });
/**
 * wrote in 2018/3/30
 * */
