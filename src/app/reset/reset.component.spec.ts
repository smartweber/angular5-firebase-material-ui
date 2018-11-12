import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetComponent } from './reset.component';
import {
  MatCardModule
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { StorageManagerService } from '../services/storage-manager.service';

// describe('ResetComponent', () => {
//   let component: ResetComponent;
//   let fixture: ComponentFixture<ResetComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ResetComponent ],
//       imports: [
//         MatCardModule,
//         RouterTestingModule
//       ],
//       providers: [
//         { provide: StorageManagerService, useClass: StorageManagerMockService }
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ResetComponent);
//     component = fixture.componentInstance;
//   });

//   it('should create', () => {
//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       expect(component.bIsProcess).toBeTruthy();
//     });
//   });
// });

// class StorageManagerMockService {
//   clearStorage() {
//     return Promise.resolve();
//   }
// }
