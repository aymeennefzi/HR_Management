import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignUsertoMissionComponent } from './assign-userto-mission.component';

describe('AssignUsertoMissionComponent', () => {
  let component: AssignUsertoMissionComponent;
  let fixture: ComponentFixture<AssignUsertoMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignUsertoMissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignUsertoMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
