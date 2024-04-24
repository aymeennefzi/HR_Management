import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionemployeeComponent } from './missionemployee.component';

describe('MissionemployeeComponent', () => {
  let component: MissionemployeeComponent;
  let fixture: ComponentFixture<MissionemployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionemployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MissionemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
