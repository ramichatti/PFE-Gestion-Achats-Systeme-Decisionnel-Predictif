import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CanActivate } from '@angular/router';

import { ResponsableGuard } from './responsable.guard'; // Importez votre garde

describe('ResponsableGuard', () => {
  let guard: CanActivate;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [ResponsableGuard] // Ajoutez votre garde aux fournisseurs
    });
    guard = TestBed.inject(ResponsableGuard); // Injectez le garde
  });

  it('should be created', () => {
    expect(guard).toBeTruthy(); // Vérifiez que le garde a été créé avec succès
  });
});
