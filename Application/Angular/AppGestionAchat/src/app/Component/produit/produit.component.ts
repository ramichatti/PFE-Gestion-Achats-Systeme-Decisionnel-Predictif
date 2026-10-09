import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Service/Auth/auth.service';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {

  produits: any[] = [];
  nom: string = '';
  reference: string = '';
  categorie: string = '';
  description: string = '';
  successMessageAjoute : string | undefined;
  errorMessageAjoute : string | undefined;
  userId: number | null | undefined;
  successMessageDelete: string | undefined;
  errorMessageDelete: string | undefined;
  successMessageUpdate: string | undefined;
  errorMessageUpdate: string | undefined;
  selectedProduit: any = {};
  searchcategorie: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadProduits(); // Appel de la méthode pour charger les produits au chargement du composant
  }

  loadProduits() {
    this.http.get<any[]>('http://localhost:8080/produit/getAllProducts')
      .subscribe(
        (produits) => {
          this.produits = produits.reverse();
        },
        (error) => {
          console.error('Erreur lors du chargement des produits :', error);
        }
      );
  }

  ajouterProduit() {
    const nouveauProduit = {
      nom: this.nom,
      reference: this.reference,
      categorie: this.categorie,
      description: this.description,
      user: {
        userId: this.userId
      }
    };

    this.http.post('http://localhost:8080/produit/create', nouveauProduit)
      .subscribe(
        (response) => {
          console.log('Produit ajouté avec succès :', response);
          this.successMessageAjoute = "Produit ajouté avec succès";
          setTimeout(() => {
            this.successMessageAjoute = undefined;
          }, 2000);
          this.loadProduits(); // Recharger les produits après l'ajout d'un nouveau produit
          this.reinitialiserFormulaire();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du produit :', error);
          this.errorMessageAjoute = "Erreur lors de l\'ajout du produit, Veuillez vérifier le nom ou la référence, car elle doit être unique dans le formulaire !";
          setTimeout(() => {
            this.errorMessageAjoute = undefined;
          }, 2000);
        }
      );
  }

  reinitialiserFormulaire() {
    this.nom = '';
    this.reference = '';
    this.categorie = '';
    this.description = '';
  }

  setDefaultDescription() {
    switch (this.categorie) {
      case 'Tissus':
        this.description = ' Une variété de matériaux textiles utilisés pour fabriquer des vêtements, des accessoires et des articles ménagers.';
        break;
      case 'Accessoires de couture':
        this.description = 'Une gamme d\'outils et de fournitures essentiels pour la couture, tels que fils, aiguilles, épingles, rubans à mesurer, etc.';
        break;
      case 'Matériel de coupe':
        this.description = 'Les outils nécessaires pour couper et préparer les tissus avant la couture, comme des ciseaux, des lames de cutter, des tables de coupe, etc.';
        break;
      case 'Équipement de finition':
        this.description = ' Les outils et équipements utilisés pour donner une apparence soignée et professionnelle aux articles finis, comprenant des fers à repasser, des tables à repasser, des machines à vapeur, etc.';
        break;
      default:
        this.description = ''; // Réinitialisez la description si aucune catégorie n'est sélectionnée
    }
  }

  searchProduct() {
    if (this.searchcategorie.trim() === '') {
      this.loadProduits();
      return;
    }
    const params = new HttpParams().set('categorie', this.searchcategorie.trim());
    this.http.get<any[]>('http://localhost:8080/produit/search', { params })
      .subscribe(
        (produit) => { // Correction ici
          this.produits = produit;
        },
        (error) => {
          console.error('Error searching users:', error);
        }
      );
  }

  // Delete Produit
  deleteProduit(produitId: number) {
    this.http.delete(`http://localhost:8080/produit/deleteProduit/${produitId}`, { responseType: 'text' })
      .subscribe(
        (response) => {
          console.log('User deleted successfully:', response);
          const index = this.produits.findIndex(produits => produits.produitId === produitId);
          if (index !== -1) {
            this.produits.splice(index, 1);
          }
          this.successMessageDelete = 'Produit supprimé avec succès';
          setTimeout(() => {
            this.successMessageDelete = undefined;
          }, 2000);
        },
        (error) => {
          console.error('Error deleting user:', error);
          this.errorMessageDelete = "Erreur lors de la suppression du produit car il y a une transaction en cours !";
          setTimeout(() => {
            this.errorMessageDelete = undefined;
          }, 2000);
        }
      );
  }

  selectProduitForUpdate(produit: any) {
    this.selectedProduit = { ...produit }; // Copier le produit sélectionné pour éviter de modifier directement l'objet original
    this.setDefaultCategoryDescription(); // Appeler la fonction pour mettre à jour la catégorie et la description
  }

  updateProduit() {
    this.http.put<any>('http://localhost:8080/produit/updateProduit', this.selectedProduit)
      .subscribe(
        (response) => {
          console.log('Produit mis à jour avec succès :', response);
          this.successMessageUpdate = "Produit mis à jour avec succès";
          setTimeout(() => {
            this.successMessageUpdate = undefined;
          }, 2000);
          this.loadProduits();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du produit :', error);
          this.errorMessageUpdate = "Erreur lors de la mise à jour du produit car le nom ou la référence existe déjà !";
          setTimeout(() => {
            this.errorMessageUpdate = undefined;
          }, 2000);
        }
      );
  }

  setDefaultCategoryDescription() {
    switch (this.selectedProduit.categorie) {
      case 'Tissus':
        this.selectedProduit.description = 'Une variété de matériaux textiles utilisés pour fabriquer des vêtements, des accessoires et des articles ménagers.';
        break;
      case 'Accessoires de couture':
        this.selectedProduit.description = 'Une gamme d\'outils et de fournitures essentiels pour la couture, tels que fils, aiguilles, épingles, rubans à mesurer, etc.';
        break;
      case 'Matériel de coupe':
        this.selectedProduit.description = 'Les outils nécessaires pour couper et préparer les tissus avant la couture, comme des ciseaux, des lames de cutter, des tables de coupe, etc.';
        break;
      case 'Équipement de finition':
        this.selectedProduit.description = 'Les outils et équipements utilisés pour donner une apparence soignée et professionnelle aux articles finis, comprenant des fers à repasser, des tables à repasser, des machines à vapeur, etc.';
        break;
      default:
        this.selectedProduit.description = ''; // Réinitialiser la description si aucune catégorie n'est sélectionnée
    }
  }

  refresh() {
    this.loadProduits();
    this.searchcategorie = '';
  }
}
