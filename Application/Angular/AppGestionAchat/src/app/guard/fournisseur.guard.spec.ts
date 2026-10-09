import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CanActivate } from '@angular/router';

import { FournisseurGuard } from './fournisseur.guard'; // Importez votre garde

describe('FournisseurGuard', () => {
  let guard: CanActivate;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [FournisseurGuard] // Ajoutez votre garde aux fournisseurs
    });
    guard = TestBed.inject(FournisseurGuard); // Injectez le garde
  });

  it('should be created', () => {
    expect(guard).toBeTruthy(); // Vérifiez que le garde a été créé avec succès
  });
});
