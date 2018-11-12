import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {
    Component
} from '@angular/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                MockTopBarComponent,
                MockSpinnerComponent
            ],
            imports: [
                SimpleNotificationsModule.forRoot(),
                RouterTestingModule
            ]
        }).compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(AppComponent);
            component = fixture.debugElement.componentInstance;
        });
    }));

    it('#should create', async(() => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    }));
});

@Component({
    selector: 'app-top-bar',
    template: '<p>Mock Top Bar Component</p>'
})
class MockTopBarComponent {
}

@Component({
    selector: 'app-spinner',
    template: '<p>Mock Spinner Component</p>'
})
class MockSpinnerComponent {
}
/**
 * Write in 2018/8/20
 */
