import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-liste-des-commandes-cloturees',
  templateUrl: './liste-des-commandes-cloturees.component.html',
  styleUrl: './liste-des-commandes-cloturees.component.css'
})
export class ListeDesCommandesClotureesComponent implements OnInit {
  commandesRecu: any[] = [];
  selectedCommande: any;
  ligneCommande: any[] = [];
  idRecherche: any;
  userImages: { [key: number]: SafeUrl } = {};
  fournisseurs: any[] = [];

  constructor(private http: HttpClient , private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getCommandesRecu();
    this.loadFournisseurs();
  }

  fetchUserImage(fournisseurId: number) {
    const url = `http://localhost:8080/user/image/${fournisseurId}`;
    const headers = new HttpHeaders({ 'Accept': 'image/jpeg' });
  
    this.http.get(url, { responseType: 'blob', headers: headers })
      .subscribe(
        (response: Blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(response);
  
          reader.onloadend = () => {
            const imageUrl = reader.result as string;
            const userImage = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
            this.userImages[fournisseurId] = userImage;
            console.log("Image retrieved for fournisseurId:", fournisseurId);
          };
        },
        (error) => {
          console.error('Error fetching user image:', error);
        }
      );
  }
  
  loadFournisseurs() {
    this.http.get<any[]>('http://localhost:8080/fournisseur/getAllFournisseurs')
      .subscribe(
        (fournisseurs) => {
          this.fournisseurs = fournisseurs;
          this.fournisseurs.forEach(fournisseur => this.fetchUserImage(fournisseur.id_fournisseur));
        },
        (error) => {
          console.error('Erreur lors du chargement des fournisseurs :', error);
        }
      );
  }

  getCommandesRecu(): void {
    this.http.get<any[]>('http://localhost:8080/commande/recues')
      .subscribe(
        (commandes) => {
          this.commandesRecu = commandes.reverse();
        },
        (error) => {
          console.error('Error loading commandes:', error);
        }
      );
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
      this.getCommandesRecu();
      return;
    }
    
    const searchId: string = this.idRecherche.trim();
    
    // Vérifier si l'ID de recherche n'est pas vide
    if (!searchId) {
      console.error('Invalid ID input');
      return;
    }
  
    this.http.get<any[]>('http://localhost:8080/commande/' + searchId)
      .subscribe(
        (commandes) => {
          if (!commandes || commandes.length === 0) {
            this.commandesRecu = []; // Réinitialiser le tableau commandesRecu à vide si la réponse est null ou vide
            return;
          }
          this.commandesRecu = commandes; // Mettre à jour le tableau commandesRecu avec les données retournées
        },
        (error) => {
          console.error('Error searching commandes:', error);
          alert('Une erreur s\'est produite lors de la recherche des commandes.');
        }
      );
  }
  
  
  refresh() {
    this.getCommandesRecu();
    this.idRecherche = '';
  }

}

