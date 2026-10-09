import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-resultat-devis',
  templateUrl: './resultat-devis.component.html',
  styleUrl: './resultat-devis.component.css'
})
export class ResultatDevisComponent implements OnInit {

  devis: any[] = []; // Initialisation de la variable devis
  selectedDevis: any | null = null; // Initialisation à null
  demandeDevis: any | null = null;
  userId: number | undefined;
  demandeDevisList: any[] = [];
  idRecherche: any;
  demande:any[]=[];
  information_societe: any = {};
  imageUrl: string | ArrayBuffer | null = null;
  
  constructor(private http: HttpClient) {}

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
      this.http.get<any[]>(`http://localhost:8080/demande_devis/accepté/${this.userId}`)
        .subscribe(
          (devis) => {
            this.devis = devis.reverse();;
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
      this.loadDevis(); // Si l'ID de recherche est vide, charger tous les devis
      return;
    }
    
    const searchId: number = parseInt(this.idRecherche.trim(), 10); // Convertir l'ID en nombre entier
    
    if (isNaN(searchId)) {
      console.error('Invalid ID input');
      return;
    }
    
    this.http.get<any[]>(`http://localhost:8080/demande_devis/users/${this.userId}/devis/${searchId}`)
      .subscribe(
        (demande) => {
          if (demande === null || demande.length === 0) {
            this.devis = []; // Vider la liste des devis
          } else {
            this.devis = [demande]; // Mettre à jour la liste des devis avec le résultat de la recherche
          }
        },
        (error) => {
          console.error('Error searching devis:', error);
          this.devis = [];
          
        }
      );
  }
  
  

  refresh() {
    this.loadDevis();
    this.idRecherche = '';
  }

  imprimerPDF() {
    const doc = new jsPDF();

    // Header
    const nomFournisseur = "CLIENT : " +this.information_societe.nom.toUpperCase();
    const adresseFournisseur ="ADRESSE : " + this.information_societe.adresse.toUpperCase(); // Modifier en fonction de votre adresse
    const numeroDevis = "N° DEVIS : " + this.selectedDevis.idDevis;
    const dateDevis = "DATE DEVIS : " + new Date(this.selectedDevis.devisDate).toLocaleDateString('fr-FR');
    const dateLivraison = "DATE LIVRAISON : " + new Date(this.selectedDevis.livraison).toLocaleDateString('fr-FR');

    doc.setFontSize(20); // Ajustement de la taille de police
    const titleWidth = doc.getTextWidth("DEVIS");
    doc.text("DEVIS", (doc.internal.pageSize.getWidth() - titleWidth) / 2, 15); // Centrage du titre

    // Fonction pour diviser une chaîne de caractères en plusieurs lignes
    function splitTextIntoLines(text: string, maxWidth: number) {
      const words = text.split(' ');
      let lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = doc.getTextWidth(currentLine + ' ' + word);
          
          if (width < maxWidth) {
              currentLine += ' ' + word;
          } else {
              lines.push(currentLine);
              currentLine = word;
          }
      }

      lines.push(currentLine);
      return lines;
    }

    // Adresse du fournisseur divisée en plusieurs lignes
    const addressLines = splitTextIntoLines(adresseFournisseur, doc.internal.pageSize.getWidth() - 40); // Ajuster la largeur en fonction des marges

    // Dessiner chaque ligne de l'adresse
    doc.setFontSize(12);
    for (let i = 0; i < addressLines.length; i++) {
      doc.text(addressLines[i], 20, 60 + (i * 10)); // Ajuster la position verticale selon la hauteur de ligne
    }
    
    doc.text(nomFournisseur, 20, 50);
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

  // Charger les informations de la société
  loadInformationSociete() {
    this.http.get<any>('http://localhost:8080/societe/getAllInformationSociete')
      .subscribe(
        (response) => {
          if (response && response.length > 0) {
            this.information_societe = response[0];
            this.getImage(this.information_societe.id); // Appeler la méthode pour récupérer l'image
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
