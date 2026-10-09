import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDesDevisClotureesComponent } from './liste-des-devis-cloturees.component';

describe('ListeDesDevisClotureesComponent', () => {
  let component: ListeDesDevisClotureesComponent;
  let fixture: ComponentFixture<ListeDesDevisClotureesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListeDesDevisClotureesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeDesDevisClotureesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
