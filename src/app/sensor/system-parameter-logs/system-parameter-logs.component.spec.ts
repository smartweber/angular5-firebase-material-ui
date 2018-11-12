import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemParameterLogsComponent } from './system-parameter-logs.component';

describe('SystemParameterLogsComponent', () => {
  let component: SystemParameterLogsComponent;
  let fixture: ComponentFixture<SystemParameterLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemParameterLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemParameterLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
