import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-demande-devis',
  templateUrl: './demande-devis.component.html',
  styleUrls: ['./demande-devis.component.css']
})
export class DemandeDevisComponent {

  demandes: any[] = [];
  fournisseurs: any[] = [];
  recherchefamille: any = '';
  successMessage: string | undefined;
  errorMessage: string | undefined;
  SelectMessage: string | undefined;
  selectedDemandes: any[] = [];
  userImages: { [key: number]: SafeUrl } = {};

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadFournisseurs();
    this.loadDemandes();
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

  loadDemandes() {
    this.http.get<any[]>('http://localhost:8080/demandes/acceptees-ou-en-cours')
      .subscribe(
        (demandes) => {
          this.demandes = demandes;
        },
        (error) => {
          console.error('Erreur lors du chargement des demandes :', error);
        }
      );
  }

  // Fonction pour désélectionner tous les fournisseurs et demandes
  deselectAll() {
    this.fournisseurs.forEach(fournisseur => fournisseur.selected = false);
    this.demandes.forEach(demande => demande.selected = false);
}
  

  sendDemande() {

    const selectedDemandes = this.demandes.filter(d => d.selected);
    const selectedFournisseurs = this.fournisseurs.filter(f => f.selected);

    if (selectedDemandes.length === 0 || selectedFournisseurs.length === 0) {
      console.error('Veuillez sélectionner au moins une demande et un fournisseur.');
      this.SelectMessage = 'Veuillez sélectionner au moins une demande et un fournisseur.';
      setTimeout(() => {
        this.SelectMessage = undefined;
      }, 2000);
      return;
    }

    this.http.post<any[]>('http://localhost:8080/devis/envoyer', { demandes: selectedDemandes, fournisseurs: selectedFournisseurs })
      .subscribe(
        () => {
          // console.log('Demande de devis envoyée avec succès.');
          this.successMessage = 'Demande de devis envoyée avec succès.';
          setTimeout(() => {
            this.successMessage = undefined;
          }, 2000);
          this.deselectAll();
          this.loadDemandes();
          
        },
        (error) => {
          // console.error('Erreur lors de l\'envoi de la demande de devis :', error);
          this.errorMessage = 'Erreur lors de l\'envoi de la demande de devis';
          setTimeout(() => {
            this.errorMessage = undefined;
          }, 2000);
        }
      );
  }

  searchFournisseurs() {
    if (!this.recherchefamille.trim()) {
      this.loadFournisseurs();
      return;
    }

    const params = new HttpParams().set('famille', this.recherchefamille.trim());
    this.http.get<any[]>('http://localhost:8080/fournisseur/search', { params })
      .subscribe(
        (fournisseurs) => {
          this.fournisseurs = fournisseurs;
        },
        (error) => {
          console.error('Erreur lors de la recherche des fournisseurs :', error);
        }
      );
  }

  refresh() {
    this.loadFournisseurs();
    this.recherchefamille = '';
  }

  

  // Méthode pour vérifier si au moins une demande est sélectionnée
  isAtLeastOneDemandeSelected(): boolean {
    return this.demandes.some(demande => demande.selected);
  }
}
