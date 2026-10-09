import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit{

  information_societe: any = {};
  image: File | undefined;
  imageUrl: string | ArrayBuffer | null = null;
  imageId: number | null = null;


  constructor( private http: HttpClient ,private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadInformationSociete();
    this.loadImageFromStorage();
    
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

  openGmailCompose() {
    const emailAddress = this.information_societe.email;
    const subject = `Demande d'informations - ${this.information_societe.nom}`;
    const body = ''; // You can add a body if needed
    const gmailLink = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(emailAddress)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailLink, '_blank');
  }

  scrollToAboutSection() {
    const aboutSection = this.elRef.nativeElement.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
