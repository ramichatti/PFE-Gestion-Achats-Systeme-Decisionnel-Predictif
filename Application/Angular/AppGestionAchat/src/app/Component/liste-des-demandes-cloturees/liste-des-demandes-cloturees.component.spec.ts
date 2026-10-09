import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDesDemandesClotureesComponent } from './liste-des-demandes-cloturees.component';

describe('ListeDesDemandesClotureesComponent', () => {
  let component: ListeDesDemandesClotureesComponent;
  let fixture: ComponentFixture<ListeDesDemandesClotureesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListeDesDemandesClotureesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeDesDemandesClotureesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
