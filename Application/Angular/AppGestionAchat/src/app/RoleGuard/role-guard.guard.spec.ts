import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { RoleGuard } from './role-guard.guard';
// Correction de l'importation du nom de la classe

describe('RoleGuard', () => { // Correction du nom de la classe
  const executeGuard: CanActivateFn = (route, state) => 
      TestBed.inject(RoleGuard).canActivate( ); // Utilisez TestBed.inject() pour obtenir l'instance du service

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
