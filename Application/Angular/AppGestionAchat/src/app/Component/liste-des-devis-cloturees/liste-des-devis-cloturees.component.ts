import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-liste-des-devis-cloturees',
  templateUrl: './liste-des-devis-cloturees.component.html',
  styleUrls: ['./liste-des-devis-cloturees.component.css']
})
export class ListeDesDevisClotureesComponent implements OnInit {

  devis: any[] = [];
  selectedDevis: any | null = null;
  demandeDevisList: any[] = [];
  demandeDevis: any | null = null;
  idRecherche: any;
  demande: any[] = [];
  userImages: { [key: number]: SafeUrl } = {};
  fournisseurs: any[] = [];
  
  constructor(private http: HttpClient , private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadDevis();
    this.loadDemandeDevis();
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


  loadDevis() {
    this.http.get<any[]>('http://localhost:8080/demande_devis/archive-or-cloture')
      .subscribe(
        (devis) => {
          this.devis = devis.reverse();
        },
        (error) => {
          console.error('Error loading devis:', error);
        }
      );
  }

  selectDevis(devis: any) {
    this.selectedDevis = devis;
    this.loadDemandeDevis(); // Chargement des demandes de devis à chaque sélection de devis
  }

  loadDemandeDevis() {
    if (this.selectedDevis !== null && this.selectedDevis.idDevis) {
      this.http.get<any[]>(`http://localhost:8080/ligne_devis/devis/${this.selectedDevis.idDevis}`)
        .subscribe(
          (demandeDevis) => {
            this.demandeDevis = demandeDevis;
            this.demandeDevisList = demandeDevis;
          },
          (error) => {
            console.error('Error loading demande devis:', error);
          }
        );
    }
  }

  searchDevis() {
    if (this.idRecherche.trim() === '') {
      this.loadDevis();
      return;
    }
    
    
    const searchId: string = this.idRecherche.trim();// Convertir l'ID en nombre entier
    
    if (!searchId) {
      console.error('Invalid ID input');
      return;
    }
  
      this.http.get<any[]>('http://localhost:8080/demande_devis/' + searchId)
      .subscribe(
        (demandes) => {
          if (demandes === null || demandes.length === 0) {
            this.devis = []; // Si aucune demande n'est trouvée, vider la liste des devis
            return;
          }
          this.devis = demandes; // Mettre à jour la liste des devis avec les résultats de la recherche
        },
        (error) => {
          console.error('Error searching devis:', error);
          alert('Une erreur s\'est produite lors de la recherche des devis.');
        }
      );
    }
  
  refresh() {
    this.loadDevis();
    this.idRecherche = '';
  }
}
