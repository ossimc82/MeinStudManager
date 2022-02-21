import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceRecordComponent } from './performance-record.component';

describe('PerformanceRecordComponent', () => {
  let component: PerformanceRecordComponent;
  let fixture: ComponentFixture<PerformanceRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
