import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Service/Auth/auth.service';

@Component({
  selector: 'app-historique-demande-achat',
  templateUrl: './historique-demande-achat.component.html',
  styleUrls: ['./historique-demande-achat.component.css']
})
export class HistoriqueDemandeAchatComponent implements OnInit {

  demande: any[] = [];
  products: any[] = []; 
  userId!: number | null; // Pas besoin de 'undefined' ici
  
  // Déclarez selectedProduct comme étant du même type que vos produits
  selectedProduct: any; // Assurez-vous que le type correspond à celui de vos produits
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId() || null;
    if (this.userId !== null) { // Vérifiez que userId n'est pas null avant de charger les demandes
      this.loadDemandeAchatArchive(this.userId);
    }
    this.loadProducts(); 
    this.selectedProduct = '';
  }

  loadDemandeAchatArchive(userId: number) {
    this.http.get<any[]>(`http://localhost:8080/demandes/user_historique/${userId}`)
      .subscribe(
        (demande) => {
          this.demande = demande;
        },
        (error) => {
          console.error('Erreur lors du chargement des demandes d\'achat:', error);
        }
      );
  }

  loadProducts() {
    this.http.get<any[]>('http://localhost:8080/produit/getAllProducts')
      .subscribe(
        (products: any[]) => {
          this.products = products;
        },
        (error: any) => {
          console.error('Erreur lors du chargement des produits :', error);
        }
      );
  }
  
  onProductSelect() {
    if (this.selectedProduct) {
      const produitName = this.selectedProduct.nom;
      if (produitName.trim() === '') {
        this.loadDemandeAchatArchive(this.userId!); // Utilisez ! pour indiquer à TypeScript que userId n'est pas null
        return;
      }
      
      this.http.get<any[]>(`http://localhost:8080/demandes/${this.userId}/${produitName}`)
        .subscribe(
          (demande) => {
            if (demande !== null && Object.keys(demande).length > 0) {
              this.demande = [demande];
          } else {
              this.demande = []; // Affectez un tableau vide si aucune demande n'est trouvée
          }
          },
          (error) => {
            console.error('Erreur lors de la recherche des demandes d\'achat:', error);
          }
        );
    }
  }
  refresh() {
    this.loadDemandeAchatArchive(this.userId!);
    this.selectedProduct = '';
  }
}
