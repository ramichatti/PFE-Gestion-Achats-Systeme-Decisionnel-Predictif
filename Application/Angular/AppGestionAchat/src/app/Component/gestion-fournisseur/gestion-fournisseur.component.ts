import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Service/Auth/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-gestion-fournisseur',
  templateUrl: './gestion-fournisseur.component.html',
  styleUrls: ['./gestion-fournisseur.component.css']
})
export class GestionFournisseurComponent implements OnInit {

  nom: string = '';
  prenom: string = '';
  cin: number | undefined;
  adresse: string = '';
  email: string = '';
  telephone: number | undefined;
  famille: string = '';
  userId: number | null | undefined;
  successMessageAjoute: string | undefined;
  errorMessageAjoute: string | undefined;
  successMessageUpdate: string | undefined;
  errorMessageUpdate: string | undefined;
  successMessageDelete: string | undefined;
  errorMessageDelete: string | undefined;
  fournisseurs: any[] = [];
  recherchefamille: any = '';
  selectedFournisseur: any = {};
  userImage: any;
  userImages: { [key: number]: SafeUrl } = {};


  constructor(private http: HttpClient, private authService: AuthService,  private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
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


  // Load fournisseurs
  loadFournisseurs() {
    this.http.get<any[]>('http://localhost:8080/fournisseur/getAllFournisseurs')
      .subscribe(
        (fournisseurs) => {
          this.fournisseurs = fournisseurs.reverse();
          this.fournisseurs.forEach(fournisseur => this.fetchUserImage(fournisseur.id_fournisseur));
        },
        (error) => {
          console.error('Erreur lors du chargement des fournisseurs :', error);
        }
      );
  }
  // ajouter Fournisseur
  ajouterFournisseur() {
    
    const nouveauFournisseur = {
      nom: this.nom,
      prenom: this.prenom,
      cin: this.cin,
      adresse: this.adresse,
      tel: this.telephone,
      email: this.email,
      famille_fournisseur: this.famille,
    };

    this.http.post<any>('http://localhost:8080/fournisseur/create', nouveauFournisseur)
      .subscribe(
        (response) => {
          console.log('Fournisseur ajouté avec succès :', response);
          this.successMessageAjoute = "Fournisseur ajouté avec succès";
          setTimeout(() => {
            this.successMessageAjoute = undefined;
          }, 2000);
          this.loadFournisseurs();
          this.reinitialiserFormulaire();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du fournisseur :', error);
          this.errorMessageAjoute = "Erreur lors de l'ajout du fournisseur, L'adresse e-mail ou le numéro de CIN existe déjà !";
          setTimeout(() => {
            this.errorMessageAjoute = undefined;
          }, 2000);
        }
      );
  }

  // reinitialiser Formulaire
  reinitialiserFormulaire() {
    this.nom = '';
    this.prenom = '';
    this.cin = undefined;
    this.adresse = '';
    this.telephone = undefined;
    this.famille = '';
    this.email = '';
  }

  // search Fournisseurs
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

  // delete Fournisseur
  deleteFournisseur(id_fournisseur: number) {
    this.http.delete(`http://localhost:8080/fournisseur/deleteFournisseur/${id_fournisseur}`, { responseType: 'text' })
      .subscribe(
        (response) => {
          console.log('Fournisseur supprimé avec succès:', response);
          this.successMessageDelete = "Fournisseur supprimé avec succès.";
          setTimeout(() => {
            this.successMessageDelete = undefined;
          }, 2000);
          const index = this.fournisseurs.findIndex(fournisseur => fournisseur.id_fournisseur === id_fournisseur);
          if (index !== -1) {
            this.fournisseurs.splice(index, 1);
          }
        },
        (error) => {
          console.error('Erreur lors de la suppression du fournisseur:', error);
          this.errorMessageDelete = "Impossible de supprimer le fournisseur actuellement. Des transactions en cours sont liées à ce fournisseur !";
          setTimeout(() => {
            this.errorMessageDelete = undefined;
          }, 2000);
        }
      );
  }

  selectFournisseurForUpdate(fournisseur: any) {
    this.selectedFournisseur = { ...fournisseur }; // Copier le fournisseur sélectionné pour éviter de modifier directement l'objet original
    // Vous pouvez également effectuer d'autres actions ici, telles que pré-remplir un formulaire de mise à jour avec les détails du fournisseur sélectionné
}

updateFournisseur() {
  console.log('Fournisseur à mettre à jour :', this.selectedFournisseur); // Vérification des données du fournisseur à mettre à jour
  this.http.put<any>('http://localhost:8080/fournisseur/updateFournisseur', this.selectedFournisseur)
    .subscribe(
      (response) => {
        console.log('Fournisseur mis à jour avec succès :', response);
        this.successMessageUpdate = "Fournisseur mis à jour avec succès";
          setTimeout(() => {
            this.successMessageUpdate = undefined;
          }, 2000);
        this.loadFournisseurs();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du fournisseur :', error);
        this.errorMessageUpdate = "Impossible de mettre à jour le fournisseur. Le numéro de CIN ou l'adresse e-mail existe déjà.";
        setTimeout(() => {
          this.errorMessageUpdate = undefined;
        }, 2000);
        
      }
    );
}



  refresh() {
    this.loadFournisseurs();
    this.recherchefamille = '';
  }
}
