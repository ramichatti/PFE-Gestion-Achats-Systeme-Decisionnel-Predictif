import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerDevisComponent } from './creer-devis.component';

describe('CreerDevisComponent', () => {
  let component: CreerDevisComponent;
  let fixture: ComponentFixture<CreerDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreerDevisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreerDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
