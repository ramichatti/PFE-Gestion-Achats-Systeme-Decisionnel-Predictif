import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CanActivate } from '@angular/router';

import { AdminGuard } from './admin.guard'; // Importez votre garde

describe('AdminGuard', () => {
  let guard: CanActivate;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AdminGuard] // Ajoutez votre garde aux fournisseurs
    });
    guard = TestBed.inject(AdminGuard); // Injectez le garde
  });

  it('should be created', () => {
    expect(guard).toBeTruthy(); // Vérifiez que le garde a été créé avec succès
  });
});
