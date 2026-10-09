import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-liste-des-demandes-cloturees',
  templateUrl: './liste-des-demandes-cloturees.component.html',
  styleUrl: './liste-des-demandes-cloturees.component.css'
})
export class ListeDesDemandesClotureesComponent implements OnInit {

  demandes: any[] = [];
  successMessage: string | undefined;
  errorMessage: string | undefined;
  idRecherche: any;
  users: any[] = [];

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadDemandes();
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any[]>('http://localhost:8080/user/getAllUsers')
      .subscribe(
        (users) => {
          this.users = users.reverse();
        },
        (error) => {
          console.error('Error loading users:', error);
        }
      );
  }

  convertImageToUrl(imageData: string): SafeUrl {
    // Convertir les données binaires en une URL d'image sécurisée
    const imageUrl = 'data:image/jpeg;base64,' + imageData; // Vous devrez peut-être ajuster le type de l'image en fonction de vos données
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
}
  

  loadDemandes() {
    this.http.get<any[]>('http://localhost:8080/demandes/refusees-et-cloturees')
      .subscribe(
        (demandes) => {
          this.demandes = demandes.reverse();// Inverser l'ordre des demandes après récupération
        },
        (error) => {
          console.error('Error loading demandes:', error);
        }
      );
  }

  searchDemande() {
    // Vérifie si l'entrée est vide
    if (this.idRecherche.trim() === '') {
      this.loadDemandes(); // Recharge toutes les demandes si l'entrée est vide
      return;
    }
    
    // Séparer les paramètres de recherche en fonction de la longueur de l'entrée saisie
    let searchParams: string[];
    if (this.idRecherche.trim().split(' ').length > 1) {
      searchParams = this.idRecherche.trim().split(' ');
    } else {
      searchParams = [this.idRecherche.trim()];
    }
  
    // Construire l'URL en fonction des paramètres de recherche
    let url: string = 'http://localhost:8080/demandes/';
    url += searchParams.join('/');
  
    // Effectuer la requête HTTP
    this.http.get<any[]>(url)
      .subscribe(
        (demandes) => {
          if (demandes === null || demandes.length === 0) {
            this.demandes = []; // Réinitialiser la liste des demandes si aucune n'est trouvée
            return;
          }
          this.demandes = demandes; // Mettre à jour la liste des demandes avec les résultats de la recherche
        },
        (error) => {
          console.error('Error searching demandes:', error);
        }
      );
  }
  
  refresh() {
    this.loadDemandes();
    this.idRecherche = '';
  }
  
}