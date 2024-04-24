import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MymissionsComponent } from './mymissions.component';

describe('MymissionsComponent', () => {
  let component: MymissionsComponent;
  let fixture: ComponentFixture<MymissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MymissionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MymissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
