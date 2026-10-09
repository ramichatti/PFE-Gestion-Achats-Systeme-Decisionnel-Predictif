import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  commandesEnCoursDeLivraison: any[] = [];
  selectedCommande: any;
  ligneCommande: any[] = [];
  searchTerm: any;
  userImages: { [key: number]: SafeUrl } = {};
  fournisseurs: any[] = [];

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getCommandesEnCoursDeLivraison();
    this.loadFournisseurs();
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

  getCommandesEnCoursDeLivraison(): void {
    this.http.get<any[]>('http://localhost:8080/commande/encours')
      .subscribe(
        (commandes) => {
          this.commandesEnCoursDeLivraison = commandes.reverse();
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

  receptionCommande(): void {
    if (this.selectedCommande && this.selectedCommande.idCommande) {
      this.http.post<any>(`http://localhost:8080/commande/reception/${this.selectedCommande.idCommande}`, {})
        .subscribe(
          (response) => {
            console.log('Commande reçue avec succès:', response);
            this.getCommandesEnCoursDeLivraison();
          },
          (error) => {
            console.error('Erreur lors de la réception de la commande:', error);
          }
        );
    }
  }
  searchCommandesByFournisseur(): void {
    if (this.searchTerm) {
      // Séparer le nom et le prénom à partir du terme de recherche
      const searchTermParts = this.searchTerm.split(' ');
      const nom = this.searchTerm;

      this.http.get<any[]>(`http://localhost:8080/commande/fournisseur/${nom}`)
        .subscribe(
          (commandes) => {
            this.commandesEnCoursDeLivraison = commandes;
          },
          (error) => {
            console.error('Error searching commandes:', error);
            this.commandesEnCoursDeLivraison=[];
          });
    } else {
      console.error('Veuillez saisir le nom et prénom du fournisseur.');
    }
  }
  
  refresh() {
    this.getCommandesEnCoursDeLivraison();
    this.searchTerm = '';
  }

  convertImageToUrl(imageData: string): SafeUrl {
    // Convertir les données binaires en une URL d'image sécurisée
    const imageUrl = 'data:image/jpeg;base64,' + imageData; // Vous devrez peut-être ajuster le type de l'image en fonction de vos données
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
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

}
