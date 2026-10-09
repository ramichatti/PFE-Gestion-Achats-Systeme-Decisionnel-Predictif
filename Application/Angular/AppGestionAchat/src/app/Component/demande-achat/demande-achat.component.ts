import { Component, OnInit } from '@angular/core';
import { DemandeAchatService } from '../../Service/DemandeAchatService/demande-achat.service';
import { AuthService } from '../../Service/Auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-demande-achat',
  templateUrl: './demande-achat.component.html',
  styleUrls: ['./demande-achat.component.css']
})
export class DemandeAchatComponent implements OnInit {
  
  serviceDepartement : string = '';
  dateDemande: string = '';
  quantite = 0;
  produitID: number | undefined;
  userId: number | null | undefined;
  nomDemandeurParDefaut: string = '';
  prenomDemandeurParDefaut: string = '';
  requestStatus: string | undefined;
  selectedProduct: any = ''; // Change type to any
  products: any[] = []; 
  demandes: any[] = [];
  demandeForm: NgForm | null = null;
  alertMessage: string | undefined;
  alertType: string | undefined;
  showAlertMessage: boolean | undefined;
  demandeIdToDelete:number | null=null ;
  deleteConfirmationModal: any;
  successMessageDelete: string | undefined;
  errorMessageDelete: string | undefined;
  successMessageAjoute: string | undefined;
  errorMessageAjoute: string | undefined;

  constructor(
    private demandeAchatService: DemandeAchatService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId() || null;
    this.nomDemandeurParDefaut = this.authService.getFirstName() || '';
    this.prenomDemandeurParDefaut = this.authService.getLastName() || '';
    this.serviceDepartement = this.authService.getDept() || ''; // Récupérer le département depuis le localStorage
    this.setDateDemande(); 
    this.loadProducts(); 
    if (this.userId) {
      this.loadDemandesByUserId(this.userId);
    }

  }

  loadDemandesByUserId(userId: number) {
    this.demandeAchatService.getDemandesByUserId(userId)
      .subscribe(
        (demandes: any[]) => {
          this.demandes = demandes.reverse();
        },
        (error: any) => {
          console.error('Erreur lors du chargement des demandes de l\'utilisateur :', error);
        }
      );
  }

  setDateDemande() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    this.dateDemande = `${yyyy}-${mm}-${dd}`;
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
    if (!this.products || this.products.length === 0) {
      console.error("Products not loaded yet.");
      return;
    }
  
    const selectedProductName = this.selectedProduct?.nom;

    if (selectedProductName) {
      const foundProduct = this.products.find(product => product.nom === selectedProductName);
      if (foundProduct) {
        this.produitID = foundProduct.produitId;
      } else {
        console.error("Selected product not found in the list.");
      }
    } else {
      console.error("Selected product is invalid.");
    }
  }

  resetFormFields() {
    this.quantite = 0;
    this.produitID = undefined;
    this.selectedProduct = '';
  }

  submitForm() {
    const formattedDate = this.dateDemande ? new Date(this.dateDemande).toISOString().split('T')[0] : '';

    const requestBody = {
      nom: this.nomDemandeurParDefaut,
      prenom: this.prenomDemandeurParDefaut,
      dept: this.serviceDepartement,
      date: formattedDate,
      qte: this.quantite,
      produit: {
        produitId: this.produitID
      },
      produitName: this.selectedProduct?.nom, 
      user: {
        userId: this.userId
      },
      statut: 'En cours de traitement'
    };

    this.demandeAchatService.createDemandeAchat(requestBody).subscribe(
      response => {
        this.demandes.unshift(response);
        this.requestStatus = 'success';
        this.resetFormFields();
        this.closeModal();
        this.successMessageAjoute = "Demande passée avec succès";
        setTimeout(() => {
          this.successMessageAjoute = undefined;
        }, 2000);
      },
      error => {
        console.error('Error submitting request:', error);
        this.requestStatus = 'error';
        this.errorMessageAjoute = "Erreur lors de l'ajout de la demande, Veuillez réessayer !";
        setTimeout(() => {
          this.errorMessageAjoute = undefined;
        }, 2000);
      }
    );
  }

  closeModal() {
    const modalElement: HTMLElement | null = document.getElementById('confirmationModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      const modalBackdrop: HTMLElement | null = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
    }
  }

  showAlert(message: string, success: boolean) {
    this.alertMessage = message;
    this.alertType = success ? 'success' : 'danger';
    this.showAlertMessage = true;

    setTimeout(() => {
      this.hideAlert();
    }, 3000);
  }

  hideAlert() {
    this.showAlertMessage = false;
    this.alertMessage = '';
  }

  confirmDeleteDemandeAchat(demandeId: number) {
    this.demandeIdToDelete = demandeId;
  }

  deleteConfirmed() {
    if (this.demandeIdToDelete !== null) {
      this.demandeAchatService.deleteDemandeAchat(this.demandeIdToDelete).subscribe(
        () => {
          // Suppression de la demande de la liste
          this.demandes = this.demandes.filter(demande => demande.demandeId !== this.demandeIdToDelete);
          console.log('Demande supprimée avec succès');
          this.showAlert("Demande supprimée avec succès !", true);
          this.successMessageDelete = "Demande supprimée avec succès";
          setTimeout(() => {
            this.successMessageDelete = undefined;
          }, 2000);
          // Recharger les demandes par ID après la suppression
          if (this.userId) {
            this.loadDemandesByUserId(this.userId);
          }
        },
        error => {
          console.error('Erreur lors de la suppression de la demande:', error);
          this.showAlert("Erreur lors de la suppression de la demande.", false);
          this.errorMessageDelete = "Impossible de supprimer la demande car elle n'a pas encore de résultat associé !";
          setTimeout(() => {
            this.errorMessageDelete = undefined;
          }, 2000);
        }
      );
    }
    this.demandeIdToDelete = null;
  }

 
}
