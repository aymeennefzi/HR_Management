import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormdialogComponentComponent } from './formdialog-component.component';

describe('FormdialogComponentComponent', () => {
  let component: FormdialogComponentComponent;
  let fixture: ComponentFixture<FormdialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormdialogComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormdialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
