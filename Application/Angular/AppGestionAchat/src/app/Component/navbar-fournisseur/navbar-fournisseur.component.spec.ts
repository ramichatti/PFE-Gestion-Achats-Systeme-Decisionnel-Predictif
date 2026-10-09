import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarFournisseurComponent } from './navbar-fournisseur.component';

describe('NavbarFournisseurComponent', () => {
  let component: NavbarFournisseurComponent;
  let fixture: ComponentFixture<NavbarFournisseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarFournisseurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
