import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit{
  email: string | undefined;
  SuccessMessage : string = '';
  errorMessage : string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.loadImageFromStorage();
    this.getImage(1);
    this.loadInformationSociete();

  }

  submit() {
    this.http.post<any>(`http://localhost:8080/password/reinitialiserMotDePasse?email=${this.email}`, {})
      .subscribe(() => {
        this.SuccessMessage = 'Un e-mail de réinitialisation de mot de passe a été envoyé à votre adresse e-mail';
        setTimeout(() => {
          this.SuccessMessage = '';
        }, 2000);

        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 2000);
      }, 
      (error) => {
        this.errorMessage = 'Désolé, l\'email saisi n\'existe pas dans notre système !';
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
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
