import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = "http://localhost:8080/user/login";
  private userIdKey = 'userId'; 
  private firstNameKey = 'firstName'; 
  private lastNameKey = 'lastName'; 
  private emailKey = 'email'; 
  private adresseKey = 'adresse'; 
  private contactKey = 'contact'; 
  private roleKey = 'role'; 
  private deptKey = 'departement'; // Ajout de la clé pour le département
  private isTabClosed = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private httpClient: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('visibilitychange', () => this.onVisibilityChange());
      window.addEventListener('beforeunload', () => this.onBeforeUnload());
    }
  }

  loginUser(credentials: { email: string, password: string }) {
    return this.httpClient.post<any>(this.baseUrl, credentials).pipe(
      tap(response => {
        if (response && response.id && response.first_name && response.last_name && response.email) {
          this.setUserIdInLocalStorage(response.id);
          this.setFirstNameInLocalStorage(response.first_name);
          this.setLastNameInLocalStorage(response.last_name);
          this.setEmailInLocalStorage(response.email);
          this.setAdresseInLocalStorage(response.adresse);
          this.setContactInLocalStorage(response.contact);
          this.setRoleInLocalStorage(response.role);
          this.setDeptInLocalStorage(response.dept); // Ajout de l'enregistrement du département
        }
      })
    );
  } 

  getUserId(): number | null {
    return this.getUserIdFromLocalStorage();
  }

  getFirstName(): string | null {
    return this.getFirstNameFromLocalStorage();
  }

  getLastName(): string | null {
    return this.getLastNameFromLocalStorage();
  }

  getEmail(): string | null {
    return this.getEmailFromLocalStorage();
  }

  getAdresse(): string | null {
    return this.getAdresseFromLocalStorage();
  }

  getContact(): string | null {
    return this.getContactFromLocalStorage();
  }

  getRole(): string | null {
    return this.getRoleFromLocalStorage();
  }

  getDept(): string | null { // Méthode pour récupérer le département
    return this.getDeptFromLocalStorage();
  }

  private getUserIdFromLocalStorage(): number | null {
    if (typeof localStorage !== 'undefined') {
      const userId = localStorage.getItem(this.userIdKey);
      return userId ? +userId : null;
    }
    return null;
  }

  private getFirstNameFromLocalStorage(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.firstNameKey);
    }
    return null;
  }

  private getLastNameFromLocalStorage(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.lastNameKey);
    }
    return null;
  }

  private getEmailFromLocalStorage(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.emailKey);
    }
    return null;
  }

  private setUserIdInLocalStorage(userId: number): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.userIdKey, userId.toString());
    }
  }

  private setFirstNameInLocalStorage(firstName: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.firstNameKey, firstName);
    }
  }

  private setLastNameInLocalStorage(lastName: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.lastNameKey, lastName);
    }
  }

  private setEmailInLocalStorage(email: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.emailKey, email);
    }
  }

  private getAdresseFromLocalStorage(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.adresseKey);
    }
    return null;
  }

  private getContactFromLocalStorage(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.contactKey);
    }
    return null;
  }

  private setAdresseInLocalStorage(adresse: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.adresseKey, adresse);
    }
  }

  private setContactInLocalStorage(contact: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.contactKey, contact);
    }
  }

  private getRoleFromLocalStorage(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.roleKey);
    }
    return null;
  }

  private setRoleInLocalStorage(role: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.roleKey, role);
    }
  }

  private getDeptFromLocalStorage(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.deptKey);
    }
    return null;
  }

  private setDeptInLocalStorage(dept: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.deptKey, dept);
    }
  }

  updateUserInfo(updatedProfile: { adresse: string, contact: string}): void { // Mise à jour de la méthode pour inclure le département
    // Mettre à jour localement les informations de contact et d'adresse
    this.setAdresseInLocalStorage(updatedProfile.adresse);
    this.setContactInLocalStorage(updatedProfile.contact);

  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      // Supprimer toutes les clés du local storage associées à l'utilisateur
      localStorage.removeItem(this.userIdKey);
      localStorage.removeItem(this.firstNameKey);
      localStorage.removeItem(this.lastNameKey);
      localStorage.removeItem(this.emailKey);
      localStorage.removeItem(this.adresseKey);
      localStorage.removeItem(this.contactKey);
      localStorage.removeItem(this.roleKey);
      localStorage.removeItem(this.deptKey);
    }
  }

    private onVisibilityChange(): void {
      if (document.visibilityState === 'hidden') {
        // La page est rafraîchie ou fermée
        this.isTabClosed = true;
      } else {
        // La page est active, réinitialiser le drapeau
        this.isTabClosed = false;
      }
    }
  
    private onBeforeUnload(): void {
      // Effacer les données du local storage uniquement si l'onglet est fermé
      if (this.isTabClosed) {
        localStorage.removeItem('role');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('adresse');
        localStorage.removeItem('departement');
        localStorage.removeItem('contact');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
      }
    }
}
