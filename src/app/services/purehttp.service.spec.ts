import { TestBed, inject } from '@angular/core/testing';
import {
    Http,
    BaseRequestOptions,
    ResponseOptions,
    Response,
    RequestMethod
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { PurehttpService } from './purehttp.service';

// describe('PurehttpService', () => {
//     let subject: PurehttpService = null;
//     let backend: MockBackend = null;

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [
//                 MockBackend,
//                 BaseRequestOptions,
//                 {
//                     provide: Http,
//                     useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
//                         return new Http(backendInstance, defaultOptions);
//                     },
//                     deps: [MockBackend, BaseRequestOptions]
//                 },
//                 PurehttpService
//             ]
//         }).compileComponents();
//     });

//     beforeEach(inject([PurehttpService, MockBackend], (userService: PurehttpService, mockBackend: MockBackend) => {
//         subject = userService;
//         backend = mockBackend;
//     }));

//     it('#should call endpoint and return it\'s result by callFirebaseFunction function', (done) => {
//         backend.connections.subscribe((connection: MockConnection) => {
//             expect(connection.request.method).toEqual(RequestMethod.Post);
//             expect(connection.request.url).toEqual('test.com/url');
//             expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
//             const options = new ResponseOptions({
//                 body: JSON.stringify({ success: true })
//             });
//             connection.mockRespond(new Response(options));
//         });

//         subject
//             .callFirebaseFunction('test.com/url', {})
//             .subscribe((response: any) => {
//                 expect(response).toEqual({ success: true });
//                 done();
//             });
//     });
// });
/**
 * wrote in 2018/3/30
 * */

