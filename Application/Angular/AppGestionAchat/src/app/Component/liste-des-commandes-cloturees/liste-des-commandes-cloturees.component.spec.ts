import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDesCommandesClotureesComponent } from './liste-des-commandes-cloturees.component';

describe('ListeDesCommandesClotureesComponent', () => {
  let component: ListeDesCommandesClotureesComponent;
  let fixture: ComponentFixture<ListeDesCommandesClotureesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListeDesCommandesClotureesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeDesCommandesClotureesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
