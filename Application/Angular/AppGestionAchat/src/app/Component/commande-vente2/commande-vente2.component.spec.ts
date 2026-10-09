import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeVente2Component } from './commande-vente2.component';

describe('CommandeVente2Component', () => {
  let component: CommandeVente2Component;
  let fixture: ComponentFixture<CommandeVente2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommandeVente2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommandeVente2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
