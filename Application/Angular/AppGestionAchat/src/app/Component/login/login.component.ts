import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../Service/Auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadImageFromStorage();
    this.getImage(1);
    this.loadInformationSociete();
    
  }


  checkUserRoleAndRedirect(): void {
    const userRole = this.authService.getRole(); // Récupère le rôle de l'utilisateur depuis le localStorage
    if (userRole) {
      // Si un rôle est trouvé dans le localStorage, redirige vers la page d'accueil correspondante
      switch (userRole) {
        case 'DIRECTEUR_ACHAT':
          this.router.navigate(['/admin/accueil']);
          break;
        case 'FOURNISSEUR':
          this.router.navigate(['/fournisseur/accueil']);
          break;
        case 'RESPONSABLE_ACHAT':
          this.router.navigate(['/responsable/accueil']);
          break;
        case 'USER':
          this.router.navigate(['/user/accueil']);
          break;
        default:
          // Gestion de cas d'un rôle inattendu
          this.router.navigate(['/login']);
          break;
      }
    } else {
      // Si aucun rôle n'est trouvé dans le localStorage, redirige vers la page de connexion
      this.router.navigate(['/login']);
    }
  }
  

  onSubmit() {
    
    // console.log("Username:", this.email);
    // console.log("Password:", this.password);

    this.authService.loginUser({ email: this.email, password: this.password }).subscribe({
      next: (data: any) => {
        if (data && data.role) {
          if (data.role === 'DIRECTEUR_ACHAT') {
            this.router.navigate(['/admin/accueil']);
          } 
          else if (data.role === 'FOURNISSEUR') 
          {
            this.router.navigate(['/fournisseur/accueil']);
          } 
          else if (data.role === 'RESPONSABLE_ACHAT') 
          {
            this.router.navigate(['/responsable/accueil']);
          } 
          else if (data.role === 'USER') 
          {
            this.router.navigate(['/user/accueil']);
          } else {
            this.errorMessage = 'Invalid role received'; // Handle unexpected role
          }
        } else {
          this.errorMessage = 'Invalid response from server'; // Handle unexpected response
        }
      },
      error: (error) => {
        if (error.status === 403) {
          this.errorMessage = 'Votre compte est bloqué. Veuillez contacter l\'administrateur.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 2000); 
        }else{
          this.errorMessage = 'Adresse e-mail ou mot de passe incorrect !';
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
        }
        
      }
    });
  }

  information_societe: any = {};
  imageUrl: string | ArrayBuffer | null = null;
  



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
            if (response) { // Vérifiez si la réponse est définie
              const reader = new FileReader();
              reader.readAsDataURL(response);
              reader.onload = () => {
                this.imageUrl = reader.result as string;
                console.log('Image URL:', this.imageUrl); // Afficher l'URL de l'image dans la console
                localStorage.setItem('imageUrl', this.imageUrl);
              };
            } else {
              console.error('La réponse de l\'API est vide.');
            }
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

}