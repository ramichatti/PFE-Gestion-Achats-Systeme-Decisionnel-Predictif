import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-reception-commande',
  templateUrl: './reception-commande.component.html',
  styleUrl: './reception-commande.component.css'
})
export class ReceptionCommandeComponent implements OnInit {
  commandesEnCoursDeLivraison: any[] = [];
  selectedCommande: any;
  ligneCommande: any[] = [];
  successMessage: string | undefined;
  errorMessage: string | undefined;
  searchTerm: any;
  userImages: { [key: number]: SafeUrl } = {};
  fournisseurs: any[] = [];

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getCommandesEnCoursDeLivraison();
    this.loadFournisseurs();
  }

  getCommandesEnCoursDeLivraison(): void {
    this.http.get<any[]>('http://localhost:8080/commande/encours')
      .subscribe(
        (commandes) => {
          this.commandesEnCoursDeLivraison = commandes;
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

  receptionCommande(avis: number): void {

    if (this.selectedStars === 0) {
        this.errorMessage = 'Veuillez  valuer cette commande en attribuant au moins une  toile';
        setTimeout(() => {
            this.errorMessage = undefined;
        }, 2000);
        return;
    }
  
    if (this.selectedCommande && this.selectedCommande.idCommande) {
        const idCommande = this.selectedCommande.idCommande;
        
        this.http.post<any>(`http://localhost:8080/commande/reception/${idCommande}/${avis}`, {})
            .subscribe(
                (response) => {
                    console.log('Commande re ue avec succ s:', response);
                    this.getCommandesEnCoursDeLivraison();
                    this.successMessage = 'Commande re ue avec succ s';
                    setTimeout(() => {
                        this.successMessage = undefined;
                    }, 2000);
                },
                (error) => {
                    console.error('Erreur lors de la r ception de la commande:', error);
                    this.errorMessage = 'Erreur lors de la r ception de la commande';
                    setTimeout(() => {
                        this.errorMessage = undefined;
                    }, 2000);
                }
            );
    }
}


  selectedStars: number = 0;

  updateStars(event: MouseEvent): void {
    const labelElement = event.target as HTMLLabelElement;
    if (labelElement.tagName === 'LABEL') {
      let selectedValue = parseInt(labelElement.htmlFor.replace('star', ''));
      
      // V rifier si la valeur s lectionn e est d j   gale   z ro
      if (selectedValue === 0) {
        this.selectedStars = 0;
      } else {
        // Mettre   jour la valeur de selectedStars avec la valeur s lectionn e
        this.selectedStars = selectedValue;
      }
      
      const labels = document.querySelectorAll('.feedback-stars label');
      labels.forEach((label, index) => {
        if (index < selectedValue) {
          label.classList.add('selected');
        } else {
          label.classList.remove('selected');
        }
      });
    }
  }
  

  searchCommandesByFournisseur(): void {
    if (this.searchTerm) {
      // S parer le nom et le pr nom   partir du terme de recherche
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
      console.error('Veuillez saisir le nom et pr nom du fournisseur.');
    }
  }
  
  refresh() {
    this.getCommandesEnCoursDeLivraison();
    this.searchTerm = '';
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

  
}