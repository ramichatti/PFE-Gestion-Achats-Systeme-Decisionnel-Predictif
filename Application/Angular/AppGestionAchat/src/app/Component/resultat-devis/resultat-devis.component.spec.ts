import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatDevisComponent } from './resultat-devis.component';

describe('ResultatDevisComponent', () => {
  let component: ResultatDevisComponent;
  let fixture: ComponentFixture<ResultatDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultatDevisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultatDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
