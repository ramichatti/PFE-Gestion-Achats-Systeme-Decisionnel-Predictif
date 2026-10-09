import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Service/Auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent implements OnInit {
  email: string | null;
  role: string | null;
  nom: string | null;
  prenom: string | null;
  information_societe: any = {};
  successMessage: string | undefined;
  errorMessage: string | undefined;

  image: File | undefined;
  imageUrl: string | ArrayBuffer | null = null;
  imageId: number | null = null;
  userImage: any;
  newImage: any;
  
  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {
    this.email = this.authService.getEmail(); // Récupérer l'e-mail lors de l'initialisation du composant
    this.nom = this.authService.getFirstName();
    this.prenom = this.authService.getLastName();
    this.role = this.authService.getRole();
  }

  ngOnInit(): void {
    this.loadImageFromStorage();
    this.loadInformationSociete();
    this.fetchUserImage();
  }

  

  // Charger les informations de la société
  loadInformationSociete() {
    this.http.get<any>('http://localhost:8080/societe/getAllInformationSociete')
      .subscribe(
        (response) => {
          if (response && response.length > 0) {
            this.information_societe = response[0];
            this.getImage(this.information_societe.id); // Appeler la méthode pour récupérer l'image
          } else {
            console.error('La réponse de l\'API ne contient aucune donnée.');
          }
        },
        (error) => {
          console.error('Erreur lors du chargement des informations société :', error);
        }
      );
  }

  getImage(idImage: number) {
    if (idImage) {
      this.http.get('http://localhost:8080/societe/viewImage/' + idImage, { responseType: 'blob' })
        .subscribe(
          (response) => {
            const reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onload = () => {
              this.imageUrl = reader.result as string;
              console.log('Image URL:', this.imageUrl); // Afficher l'URL de l'image dans la console
              localStorage.setItem('imageUrl', this.imageUrl);
            };
          },
          (error) => {
            console.error('Erreur lors du chargement de l\'image :', error);
          }
        );
    }
  }


  // Mettre à jour les informations de la société
  updateInformationSociete() {
    const formData = new FormData();
    formData.append('nom', this.information_societe.nom);
    formData.append('adresse', this.information_societe.adresse);
    formData.append('tel', this.information_societe.tel);
    formData.append('email', this.information_societe.email);
    formData.append('matricule_fiscale', this.information_societe.matricule_fiscale);
    formData.append('bio', this.information_societe.bio);
    if (this.image) {
      formData.append('image', this.image, this.image.name);
    }

    this.http.put<any>('http://localhost:8080/societe/update/' + this.information_societe.id, formData)
      .subscribe(
        (response) => {
          this.information_societe = response;
          this.successMessage = 'La mise à jour des informations de la société a été réalisée avec succès';
          this.loadInformationSociete();
          setTimeout(() => {
            this.successMessage = undefined;
          }, 2000);

          // Naviguer vers Accueil en forçant le rechargement du composant
          setTimeout(() => {
            this.router.navigate(['/admin/accueil'], { skipLocationChange: false }).then(() => {
              window.location.reload();
            });
          }, 1000);

        },
        (error) => {
          console.error('Erreur lors de la mise à jour des informations société :', error);
          this.errorMessage = 'Erreur lors de la mise à jour des informations société';
          setTimeout(() => {
            this.errorMessage = undefined;
          }, 2000);
        }
      );
  }

  // Gérer la sélection de fichier
  onFileSelected(event: any): void {
    this.image = event.target.files[0];
  }

  loadImageFromStorage() {
    const storedImageUrl = localStorage.getItem('imageUrl');
    console.log('Stored Image URL:', storedImageUrl); // Log l'URL de l'image stockée dans le localStorage
    if (storedImageUrl) {
      this.imageUrl = storedImageUrl;
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

  
  
  logout() {
    this.authService.logout(); // Appel de la méthode logout du service d'authentification
  }
  
  
  
}
