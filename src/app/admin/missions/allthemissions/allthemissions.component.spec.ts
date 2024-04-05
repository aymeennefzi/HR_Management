import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllthemissionsComponent } from './allthemissions.component';

describe('AllthemissionsComponent', () => {
  let component: AllthemissionsComponent;
  let fixture: ComponentFixture<AllthemissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllthemissionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllthemissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
