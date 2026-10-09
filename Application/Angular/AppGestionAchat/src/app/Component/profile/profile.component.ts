import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../Service/Auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { NavbarAdminComponent } from '../navbar-admin/navbar-admin.component';
import { NavbarUserComponent } from '../navbar-user/navbar-user.component';
import { NavbarFournisseurComponent } from '../navbar-fournisseur/navbar-fournisseur.component';
import { NavbarResponsableComponent } from '../navbar-responsable/navbar-responsable.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any = {};
  successMessageUpdate: string | undefined;
  errorMessageUpdate: string | undefined;
  userImage: any;
  newImage: any;

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserProfile();
    this.fetchUserImage();
    
  }

  private fetchUserProfile(): void {
    this.userProfile = {
      userId: this.authService.getUserId(),
      firstName: this.authService.getFirstName(),
      lastName: this.authService.getLastName(),
      email: this.authService.getEmail(),
      role: this.authService.getRole(),
      adresse: this.authService.getAdresse(),
      contact: this.authService.getContact()
    };
  }

  updateUser() {
    const updatedProfile = {
      adresse: this.userProfile.adresse,
      contact: this.userProfile.contact
    };
  
    // Mettre à jour localement les informations de contact et d'adresse
    this.authService.updateUserInfo(updatedProfile);
  
    // Envoyer la mise à jour au serveur avec l'ID de l'utilisateur
    const userId = this.userProfile.userId; // Récupérer l'ID de l'utilisateur
    this.http.put<any>(`http://localhost:8080/user/updateProfile/${userId}`, updatedProfile)
      .subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          // this.successMessageUpdate = "Utilisateur mis à jour avec succès";
          // setTimeout(() => {
          //   this.successMessageUpdate = undefined;
          // }, 2000);
        },
        (error) => {
          console.error('Error updating user:', error);
          // this.errorMessageUpdate = "Erreur lors de la mise à jour de l'utilisateur";
          // setTimeout(() => {
          //   this.errorMessageUpdate = undefined;
          // }, 2000);
        }
      );
  }
  closeModal() {
    const modal = document.getElementById('UpdateModal');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.parentNode?.removeChild(modalBackdrop);
      }
    }
  }

  private fetchUserImage(): void {
    const userId = this.authService.getUserId();
    // Appel HTTP pour récupérer l'image de profil de l'utilisateur
    this.http.get(`http://localhost:8080/user/${userId}/image`, { responseType: 'blob' })
      .subscribe(
        (response: Blob) => {
          // Convertir la réponse blob en URL d'objet
          const reader = new FileReader();
          reader.readAsDataURL(response);
          reader.onloadend = () => {
            // Stocker l'URL de l'image dans la variable userImage
            this.userImage = reader.result;
          };
        },
        (error) => {
          console.error('Error fetching user image:', error);
          // Gérer les erreurs de récupération de l'image de l'utilisateur
        }
      );
  }
  

  updateUserImage(): void {
    const userId = this.userProfile.userId;
    const formData = new FormData();
    formData.append('file', this.newImage);

    this.http.put<any>(`http://localhost:8080/user/${userId}/updateImage`, formData)
      .subscribe(
        (response) => {
          console.log('User image updated successfully:', response);
          // Handle success
        },
        (error) => {
          console.error('Error updating user image:', error);
          // Handle error
        }
      );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        this.newImage = file;
        this.userImage = reader.result as string;
    };
}
  
}
