import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-consulter-devis',
  templateUrl: './consulter-devis.component.html',
  styleUrl: './consulter-devis.component.css'
})
export class ConsulterDevisComponent implements OnInit {

  devis: any[] = []; // Initialisation de la variable devis
  selectedDevis: any | null = null; // Initialisation à null
  demandeDevisList: any[] = [];
  demandeDevis: any | null = null;
  successMessage: string | undefined;
  errorMessage: string | undefined;
  nomRecherche: any;
  userImages: { [key: number]: SafeUrl } = {};
  fournisseurs: any[] = [];

  @ViewChild('successModal') successModal: any;
  @ViewChild('successModal1') successModal1: any;
  
  constructor(private http: HttpClient, private sanitizer: DomSanitizer,private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadDevis(); // Chargement des devis au démarrage du composant
    this.loadDemandeDevis();
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

  loadDevis() {
    this.http.get<any[]>('http://localhost:8080/demande_devis/cree') // Correction de l'URL
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
  }

  loadDemandeDevis(){
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

  passerCommande() {
    if (this.selectedDevis !== null && this.selectedDevis.idDevis) {
      this.http.post('http://localhost:8080/commande/passer/' + this.selectedDevis.idDevis, null, { responseType: 'text' })
        .subscribe(
          (response: string) => {
            console.log('Commande passée avec succès:', response);
            this.loadDevis();
            this.modalService.dismissAll('Commande passée avec succès');
            this.closeModal();
            // Afficher le message de succès après la fermeture du modal
            this.successMessage = "Commande passée avec succès";
            setTimeout(() => {
            this.successMessage = undefined;
          }, 2000);
            
          },
          (error) => {
            console.error('Error passing commande:', error);
            this.errorMessage = "Error passing commande !";
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
  openSuccessModal1() {
    this.modalService.open(this.successModal1, { centered: true });
  }
  closeModal() {
    const modalElement: HTMLElement | null = document.getElementById('VoirDevis');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      const modalBackdrop: HTMLElement | null = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
    }
  }

  archiverDevis() {
    if (this.selectedDevis !== null && this.selectedDevis.idDevis) {
      this.http.post('http://localhost:8080/demande_devis/archive', [this.selectedDevis], { responseType: 'text' })
        .subscribe(
          (response) => {
            console.log('Devis archivés avec succès:', response);
            this.loadDevis();
            this.modalService.dismissAll('Devis archivé avec succès');
            this.closeModal();
            this.successMessage = "Devis archivés avec succès";
            setTimeout(() => {
            this.successMessage = undefined;
          }, 2000);
          },
          (error) => {
            console.error('Error archiving devis:', error);
            this.errorMessage = "Error archiving devis ";
            setTimeout(() => {
            this.errorMessage = undefined;
          }, 2000);
            
          }
        );
    }
  }

  searchDevis() {
    if (this.nomRecherche.trim() === '') {
      this.loadDevis();
      return;
    }
    
    // Construire l'URL en fonction du nom de recherche
    let url: string = 'http://localhost:8080/demande_devis/devis/';
    url += this.nomRecherche.trim();
    
    // Effectuer la requête HTTP
    this.http.get<any[]>(url)
      .subscribe(
        (devis) => {
          if (devis === null || devis.length === 0) {
            this.devis = []; // Réinitialiser la liste des devis si aucun n'est trouvé
            return;
          }
          this.devis = devis; // Mettre à jour la liste des devis avec les résultats de la recherche
        },
        (error) => {
          
          this.devis = []; 
        }
      );
  }

  refresh() {
    this.loadDevis();
    this.nomRecherche = '';
  }

  imprimerPDF() {
    const doc = new jsPDF();
  
    // Header
    const nomFournisseur = "FOURNISSEUR : " +this.selectedDevis.fournisseur.nom.toUpperCase() + ' ' + this.selectedDevis.fournisseur.prenom.toUpperCase();
    const adresseFournisseur ="ADRESSE : " + this.selectedDevis.fournisseur.adresse.toUpperCase(); // Modifier en fonction de votre adresse
    const numeroDevis = "N° DEVIS : " + this.selectedDevis.idDevis;
    const dateDevis = "DATE DEVIS : " + new Date(this.selectedDevis.devisDate).toLocaleDateString('fr-FR');
    const dateLivraison = "DATE LIVRAISON : " + new Date(this.selectedDevis.livraison).toLocaleDateString('fr-FR');
  
    doc.setFontSize(20); // Ajustement de la taille de police
    const titleWidth = doc.getTextWidth("DEVIS");
    doc.text("DEVIS", (doc.internal.pageSize.getWidth() - titleWidth) / 2, 15); // Centrage du titre
  
    doc.setFontSize(12);
    doc.text(nomFournisseur, 20, 50);
    doc.text(adresseFournisseur, 20, 60);
    doc.text(numeroDevis, doc.internal.pageSize.getWidth() - 80, 50);
    doc.text(dateDevis, doc.internal.pageSize.getWidth() - 80, 60);
    doc.text(dateLivraison, doc.internal.pageSize.getWidth() - 80, 70);
  
    // Appel à autoTable pour générer la table des produits
    autoTable(doc, {html: '#test', startY: 90});

    // Ajouter le total HT, TVA et TTC en bas de la table
    const totalHT = 'TOTAL HT : ' + this.selectedDevis.totalHt + ' TND';
    const totalTVA = 'TOTAL TVA : ' + this.selectedDevis.totalTva + ' TND';
    const totalTTC = 'TOTAL TTC : ' + this.selectedDevis.prix + ' TND';
    const lineHeight = 10;
    const pageHeight = doc.internal.pageSize.getHeight();
  
    doc.setFontSize(12);
    doc.text(totalHT, 20, pageHeight - lineHeight * 4);
    doc.text(totalTVA, 20, pageHeight - lineHeight * 3);
    doc.text(totalTTC, 20, pageHeight - lineHeight * 2); // Aligner le TTC à gauche
  
    // Signature
    const signature = "SIGNATURE";
    const signatureWidth = doc.getStringUnitWidth(signature);
    const signatureX = doc.internal.pageSize.getWidth() - signatureWidth - 40; // Aligner à droite avec une marge de 10
    doc.text(signature, signatureX, pageHeight - lineHeight * 4); // Positionner la signature à droite
  
  
    // Télécharger le fichier PDF
    doc.save('devis.pdf');
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