import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {
    // Écoute l'événement storage pour détecter les modifications dans le localStorage
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  canActivate(): boolean {
    // Vérifie si le rôle existe dans le localStorage
    const role = localStorage.getItem('role');

    if (role === null) {
      this.router.navigate(['/login']); // Navigue vers la page de connexion si le rôle n'est pas présent
      return false;
    }

    return true;
  }

  // Fonction pour gérer les changements dans le localStorage
  private handleStorageChange(event: StorageEvent) {
    if (event.key === 'role' && event.newValue === null) {
      // Si la clé 'role' est supprimée (localStorage vidée), naviguer vers la page de connexion
      this.router.navigate(['/login']);
    }
  }
}
