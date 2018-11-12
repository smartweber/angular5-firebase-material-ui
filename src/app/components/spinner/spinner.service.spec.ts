import {
    TestBed,
    inject,
    async
} from '@angular/core/testing';

import { SpinnerService } from './spinner.service';

// describe('SpinnerService', () => {
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             providers: [SpinnerService]
//         }).compileComponents();
//     }));

//     it('#should show the spinner by start function', inject([SpinnerService], (service: SpinnerService) => {
//         service.start();
//         expect(service.active).toBeTruthy();
//     }));

//     it('#should hide the spinner by stop function', inject([SpinnerService], (service: SpinnerService) => {
//         service.stop();
//         expect(service.active).toBeFalsy();
//     }));

//     it('#should get spinner active status by get active function', inject([SpinnerService], (service: SpinnerService) => {
//         (service as any)._active = true;
//         expect(service.active).toBeTruthy();
//     }));

//     it('#should hide the spinner by stop function', inject([SpinnerService], (service: SpinnerService) => {
//         spyOn(service.status, 'next');
//         service.active = true;
//         expect((service as any)._active).toBeTruthy();
//         expect(service.status.next).toHaveBeenCalled();
//     }));
// });
/**
 * wrote in 2018/3/30
 * update in 2018/8/10
 */
