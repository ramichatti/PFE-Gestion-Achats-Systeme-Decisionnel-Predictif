import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarResponsableComponent } from './navbar-responsable.component';

describe('NavbarResponsableComponent', () => {
  let component: NavbarResponsableComponent;
  let fixture: ComponentFixture<NavbarResponsableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarResponsableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
