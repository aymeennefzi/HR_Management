import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlldepartementsComponent } from './alldepartements.component';

describe('AlldepartementsComponent', () => {
  let component: AlldepartementsComponent;
  let fixture: ComponentFixture<AlldepartementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlldepartementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlldepartementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
