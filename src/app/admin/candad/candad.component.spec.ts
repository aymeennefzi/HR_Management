import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandadComponent } from './candad.component';

describe('CandadComponent', () => {
  let component: CandadComponent;
  let fixture: ComponentFixture<CandadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CandadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
