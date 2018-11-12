import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';

// describe('DataService', () => {
//   let store = {};
//   const mockLocalStorage = {
//     getItem: (key: string): string => {
//       return key in store ? store[key] : null;
//     },
//     setItem: (key: string, value: string) => {
//       store[key] = `${value}`;
//     },
//     removeItem: (key: string) => {
//       delete store[key];
//     },
//     clear: () => {
//       store = {};
//     }
//   };

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [DataService]
//     });

//     spyOn(localStorage, 'getItem')
//       .and.callFake(mockLocalStorage.getItem);
//     spyOn(localStorage, 'setItem')
//       .and.callFake(mockLocalStorage.setItem);
//     spyOn(localStorage, 'removeItem')
//       .and.callFake(mockLocalStorage.removeItem);
//     spyOn(localStorage, 'clear')
//       .and.callFake(mockLocalStorage.clear);
//   });

//   it('#should set the object value by setObject function', inject([DataService], (service: DataService) => {
//     const obj = { data: 1 };
//     service.setObject('obj', obj);
//     expect(localStorage.getItem('obj')).toEqual(JSON.stringify(obj));
//   }));

//   it('#should get the object value by getObject function', inject([DataService], (service: DataService) => {
//     const obj = { data: 1 };
//     localStorage.setItem('obj', JSON.stringify(obj));
//     expect(service.getObject('obj')).toEqual(obj);
//   }));

//   it('#should set the string value by saveString function', inject([DataService], (service: DataService) => {
//     const str = 'str';
//     service.saveString('str', str);
//     expect(localStorage.getItem('str')).toEqual(str);
//   }));

//   it('#should get the string value by getString function', inject([DataService], (service: DataService) => {
//     const str = 'str';
//     localStorage.setItem('str', str);
//     expect(service.getString('str')).toEqual(str);
//   }));
// });
/**wrote in 2018/3/30 */
