import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueDemandeAchatComponent } from './historique-demande-achat.component';

describe('HistoriqueDemandeAchatComponent', () => {
  let component: HistoriqueDemandeAchatComponent;
  let fixture: ComponentFixture<HistoriqueDemandeAchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoriqueDemandeAchatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoriqueDemandeAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
