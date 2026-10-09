import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-commande-vente2',
  templateUrl: './commande-vente2.component.html',
  styleUrl: './commande-vente2.component.css'
})
export class CommandeVente2Component implements OnInit {

  userId: number | null = null; // Initialisation à null
  commandes: any[] = []; // Tableau pour stocker les commandes
  selectedCommande: any;
  ligneCommande: any[] = [];
  idRecherche: any;
  information_societe: any = {};
  imageUrl: string | ArrayBuffer | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const userIdFromLocalStorage = localStorage.getItem('userId');
      if (userIdFromLocalStorage) {
        this.userId = Number(userIdFromLocalStorage);
        this.loadCommande();
      } else {
        console.error('userId is not available in localStorage');
      }
    } else {
      console.error('localStorage is not available');
    }

    this.loadInformationSociete()
  }

  loadCommande(): void {
    if (this.userId) {
      this.http.get<any[]>(`http://localhost:8080/commande/commandes/${this.userId}/livrée`) // correction: Backticks pour utiliser des templates de chaînes
        .subscribe(
          (data) => {
            this.commandes = data.reverse(); // Attribuer les données récupérées au tableau de commandes
          },
          (error) => {
            console.error('Error fetching commandes:', error);
          }
        );
    } else {
      console.error('userId is not available');
    }
  }

  selectCommande(commande: any) {
    this.selectedCommande = commande;
  }

  loadLigneCommande() {
    if (this.selectedCommande && this.selectedCommande.idCommande) {
      this.http.get<any[]>(`http://localhost:8080/ligne_commande/${this.selectedCommande.idCommande}`)
        .subscribe(
          (ligneCommande) => {
            this.ligneCommande = ligneCommande;
          },
          (error) => {
            console.error('Error loading ligne commande:', error);
          }
        );
    }
  }
  searchCommande() {
    if (this.idRecherche.trim() === '') {
      this.loadCommande(); // Si l'ID de recherche est vide, charger tous les devis
      return;
    }
    
    const searchId: number = parseInt(this.idRecherche.trim(), 10); // Convertir l'ID en nombre entier
    
    if (isNaN(searchId)) {
      console.error('Invalid ID input');
      return;
    }
  
    this.http.get<any[]>(`http://localhost:8080/commande/${this.userId}/${searchId}`)
      .subscribe(
        (demande) => {
          if (demande === null || demande.length === 0) {
            this.commandes = []; // Vider la liste des devis
          } else {
            this.commandes = [demande]; // Mettre à jour la liste des devis avec le résultat de la recherche
          }
        },
        (error) => {
          console.error('Error searching devis:', error);
          this.commandes = [];
        
        }
      );
  }
  
  refresh() {
    this.loadCommande();
    this.idRecherche = '';
  }

  // Charger les informations de la société
  loadInformationSociete() {
    this.http.get<any>('http://localhost:8080/societe/getAllInformationSociete')
      .subscribe(
        (response) => {
          if (response && response.length > 0) {
            this.information_societe = response[0];
            this.getImage(this.information_societe.id); 
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
}
