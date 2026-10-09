import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Service/Auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class FournisseurGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.authService.getRole(); // Supposons que cette méthode retourne le rôle de l'utilisateur
    if (userRole === 'FOURNISSEUR') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
