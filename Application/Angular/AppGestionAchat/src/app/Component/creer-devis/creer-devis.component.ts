import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-creer-devis',
  templateUrl: './creer-devis.component.html',
  styleUrls: ['./creer-devis.component.css']
})
export class CreerDevisComponent implements OnInit {

  devis: any[] = [];
  userId: number | null = null; // Initialisation à null
  selectedDevis: any | null = null; // Initialisation à null
  demandeDevis: any | null = null; // Initialisation à null
  prixTotal: number | null = null; // Nouvelle propriété pour le prix total
  dateLivraison: Date | null = null;
  totalHt: any;
  totalTva: any;
  TTC: number | null = null;
  successMessage: string | undefined;
  errorMessage: string | undefined;
  information_societe: any = {};
  imageUrl: string | ArrayBuffer | null = null;
  dateError: boolean = false;
  validDateMessage: string = "La date est valide.";
  invalidDateMessage: string = "La date est non valide !";
  successMessage1: string | undefined;

  @ViewChild('successModal') successModal: any;
  constructor(private http: HttpClient ,private modalService: NgbModal) {}

  // Method to check if all TTC values are filled and the delivery date is entered
  areFieldsFilled(): boolean {
    // Check if dateLivraison is filled
    if (!this.dateLivraison) {
      return false;
    }

    // Check if all TTC values are filled
    for (const item of this.demandeDevis) {
      if (!item.TTC) {
        return false;
      }
    }

    return true;
  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const userIdFromLocalStorage = localStorage.getItem('userId');
      if (userIdFromLocalStorage) {
        this.userId = Number(userIdFromLocalStorage);
        this.loadDevis();
      } else {
        console.error('userId is not available in localStorage');
      }
    } else {
      console.error('localStorage is not available');
    }
    this.loadInformationSociete();
  }

  loadDevis() {
    if (this.userId !== null) {
      this.http.get<any[]>(`http://localhost:8080/demande_devis/en_cours/${this.userId}`)
        .subscribe(
          (devis) => {
            this.devis = devis;
          },
          (error) => {
            console.error('Error loading devis:', error);
          }
        );
    }
  }

  selectDevis(devis: any) {
    this.selectedDevis = devis;
  }

  loadDemandeDevis(){
    if (this.selectedDevis !== null && this.selectedDevis.idDevis) {
      this.http.get<any[]>(`http://localhost:8080/ligne_devis/devis/${this.selectedDevis.idDevis}`)
        .subscribe(
          (demandeDevis) => {
            this.demandeDevis = demandeDevis.reverse();
          },
          (error) => {
            console.error('Error loading demande devis:', error);
          }
        );
    }
  }

  calculateResult(item: any): void {
    const PU = parseFloat(item.PU || '0');
    const Remise = parseFloat(item.Remise || '0');
    const TVA = parseFloat(item.TVA || '0');
    const quantite = parseFloat(item.quantite || '0');

    const HTNet = (quantite * PU) - (quantite * PU * (Remise / 100));
    item.montantht = HTNet;
    item.montanttva = (HTNet * (TVA / 100));
    item.TTC = HTNet + (HTNet * (TVA / 100));

    this.calculateTotal();
    this.calculateTotalHT();
    this.calculateTotalTVA();
  }

  calculateTotal(): void {
    if (this.demandeDevis) {
      this.prixTotal = this.demandeDevis.reduce((total: number, item: any) => {
        return total + parseFloat(item.TTC || '0');
      }, 0);
    }
  }

  calculateTotalHT(): void {
    if (this.demandeDevis) {
      this.totalHt = this.demandeDevis.reduce((total1: number, item: any) => {
        return total1 + parseFloat(item.montantht || '0');
      }, 0);
    }
  }

  calculateTotalTVA(): void {
    if (this.demandeDevis) {
      this.totalTva = this.demandeDevis.reduce((total2: number, item: any) => {
        return total2 + parseFloat(item.montanttva || '0');
      }, 0);
    }
  }

  updateDevisAndDemandeDevis() {
    if (this.selectedDevis && this.demandeDevis && this.dateLivraison) {
      // Récupérer la date d'aujourd'hui
      const today = new Date();
      // Convertir la date de livraison en objet Date
      const deliveryDate = new Date(this.dateLivraison);
  
      // Vérifier si la date de livraison est antérieure à la date d'aujourd'hui
      if (deliveryDate < today) {
        console.error('La date de livraison ne peut pas être antérieure à la date d\'aujourd\'hui.');
        // Afficher un message d'erreur ou prendre toute autre mesure nécessaire
        return;
      }
  
      // Créer un objet pour mettre à jour le devis
      const updatedDevis = {
        id: this.selectedDevis.idDevis,
        livraison: this.dateLivraison,
        prix: this.prixTotal,
        totalTva: this.totalTva,
        totalHt: this.totalHt
      };
  
      // Mettre à jour les valeurs de montant TTC pour chaque item
      this.demandeDevis.forEach((item: any) => {
        this.calculateResult(item); // Assurez-vous que le TTC est correctement calculé pour chaque item
      });
  
      // Utiliser directement item.TTC dans updatedDemandeDevis
      const updatedDemandeDevis = this.demandeDevis.map((item: any) => {
        return {
          id: item.id,
          prix_unitaire: item.PU,
          remise: item.Remise,
          tva: item.TVA,
          ttc: item.TTC, // Utilisation de item.TTC mis à jour
          montanttva: item.montanttva,
          montantht: item.montantht
        };
      });
  
      const requestBody = {
        updatedDevis: updatedDevis,
        updatedDemandeDevis: updatedDemandeDevis
      };
  
      console.log(requestBody);
  
      this.http.put(`http://localhost:8080/demande_devis/devis/${this.selectedDevis.idDevis}`, requestBody)
        .subscribe(
          (response) => {
            console.log('Devis et demandes de devis mis à jour avec succès:', response);
            
            this.successMessage = "Devis envoyé avec succès";
          // Fermeture du modal successModal
             this.modalService.dismissAll('Devis envoyé');
          // Fermeture du modal FaireDevis
             this.closeModal();
          // Réinitialisation du message de succès après 2 secondes
          setTimeout(() => {
            this.successMessage = undefined;
          }, 2000);
            this.loadDevis();
          },
          (error) => {
            console.error('Erreur lors de la mise à jour du devis et des demandes de devis:', error);
            this.errorMessage = "Une erreur s'est produite lors de l'envoi du devis, Veuillez réessayer";
            setTimeout(() => {
              this.errorMessage = undefined;
            }, 2000);
          }
        );
    }
  }
  openSuccessModal() {
    this.modalService.open(this.successModal, { centered: true });
  }
  closeModal() {
    const modalElement: HTMLElement | null = document.getElementById('FaireDevis');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      const modalBackdrop: HTMLElement | null = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
    }
  }

  checkDateValidity(): void {
    // Si la date est vide, aucun message d'erreur n'est affiché
    if (!this.dateLivraison) {
        this.dateError = false;
        this.successMessage1 = undefined;
    } else {
        // Convertir la date de livraison en objet Date
        const deliveryDate = new Date(this.dateLivraison);
        // Récupérer la date d'aujourd'hui
        const today = new Date();
        // Vérifier si la date de livraison est antérieure à la date d'aujourd'hui
        if (deliveryDate < today) {
            // Afficher un message d'erreur si la date de livraison est antérieure à la date d'aujourd'hui
            console.error('La date de livraison ne peut pas être antérieure à la date d\'aujourd\'hui.');
            this.dateError = true;
            this.successMessage1 = undefined;
        } else {
            // Pas d'erreur si la date de livraison est égale ou postérieure à la date d'aujourd'hui
            this.dateError = false;
            this.successMessage1 = "La date est valide.";
        }
    }
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