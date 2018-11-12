import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { StorageManagerService } from './storage-manager.service';

// describe('StorageManagerService', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [StorageManagerService]
//     });
//   });

//   it('#should call refresh function by checkStorages function',
//     inject([StorageManagerService], fakeAsync((service: StorageManagerService) => {
//     spyOn(service, 'refresh');
//     service.checkStorages();
//     tick();
//     expect(service.refresh).toHaveBeenCalled();
//   })));

//   it('#should clear storage by clearStorage function',
//     inject([StorageManagerService], fakeAsync((service: StorageManagerService) => {
//     spyOn(service, 'clearCacheStorage');
//     spyOn(service, 'clearIndexedDb');
//     service.clearStorage();
//     tick();
//     expect(service.clearCacheStorage).toHaveBeenCalled();
//     expect(service.clearIndexedDb).toHaveBeenCalled();
//   })));

//   it('#should clear cache by clearCacheStorage function',
//     inject([StorageManagerService], fakeAsync((service: StorageManagerService) => {
//     const result = service.clearCacheStorage();
//     tick();
//     expect(result).toBeTruthy();
//   })));

//   it('#should clear indexeddb by clearIndexedDb function',
//     inject([StorageManagerService], fakeAsync((service: StorageManagerService) => {
//     const result = service.clearIndexedDb('indexeddb');
//     tick();
//     expect(result).toBeTruthy();
//   })));
// });
