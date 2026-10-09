import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Service/Auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-responsable',
  templateUrl: './navbar-responsable.component.html',
  styleUrl: './navbar-responsable.component.css'
})
export class NavbarResponsableComponent implements OnInit{
  email: string | null;
  role: string | null;
  nom: string | null;
  prenom: string | null;
  information_societe: any = {};
  successMessage: string | undefined;
  errorMessage: string | undefined;
  userImage: any;

  image: File | undefined;
  imageUrl: string | ArrayBuffer | null = null;
  imageId: number | null = null;
  
  
  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {
    this.email = this.authService.getEmail(); // Récupérer l'e-mail lors de l'initialisation du composant
    this.nom = this.authService.getFirstName();
    this.prenom = this.authService.getLastName();
    this.role=this.authService.getRole();
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

