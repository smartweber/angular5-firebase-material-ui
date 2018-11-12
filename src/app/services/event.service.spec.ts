import {
    async,
    TestBed,
    inject
} from '@angular/core/testing';
import { EventService } from './event.service';

// describe('EventService', () => {
//     let eventService: EventService = null;
//     const data = {
//         helpIcon: 'http://helpIcon.png',
//         helpStatus: true
//     };

//     beforeEach(async(() => {

//     TestBed.configureTestingModule({
//         providers: [
//             EventService
//         ]
//     }).compileComponents();
//     }));

//     beforeEach(inject([EventService], (eventS: EventService) => {
//         eventService = eventS;
//     }));

//     it('#should occur event service event by emit function', () => {
//         spyOn((<any>eventService).subject, 'next');
//         eventService.emit('test', data);
//         expect((<any>eventService).subject.next).toHaveBeenCalled();
//     });

//     it('#should register the event service by registerEvent function', () => {
//         eventService.registerEvent('test', null, (args: any) => {
//             console.log('test event is registered');
//         });
//         expect((<any>eventService).listeners['test']).toBeDefined();
//     });

//     it('#should unregister the event service by unregisterEvent function', () => {
//         eventService.unregisterEvent('test', null);
//         expect((<any>eventService).listeners['test']).toBeUndefined();
//     });
// });
/**
 * wrote in 2018/3/30
 * */
