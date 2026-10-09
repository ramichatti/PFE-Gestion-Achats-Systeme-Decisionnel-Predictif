import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Service/Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ResponsableGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.authService.getRole(); // Assurez-vous que votre service d'authentification possède cette méthode
    if (userRole === 'RESPONSABLE_ACHAT') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
