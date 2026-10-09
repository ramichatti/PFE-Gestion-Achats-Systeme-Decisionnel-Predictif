import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-demande-consulter',
  templateUrl: './demande-consulter.component.html',
  styleUrls: ['./demande-consulter.component.css'] // Correction: pluriel pour styleUrls
})
export class DemandeConsulterComponent implements OnInit {

  demandes: any[] = [];
  successMessage: string | undefined;
  errorMessage: string | undefined;
  

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadDemandes();
  }

  convertImageToUrl(imageData: string): SafeUrl {
    // Convertir les données binaires en une URL d'image sécurisée
    const imageUrl = 'data:image/jpeg;base64,' + imageData; // Vous devrez peut-être ajuster le type de l'image en fonction de vos données
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
}

  loadDemandes() {
    this.http.get<any[]>('http://localhost:8080/demandes/en_cours')
      .subscribe(
        (demandes) => {
          this.demandes = demandes;// Inverser l'ordre des demandes après récupération
        },
        (error) => {
          console.error('Error loading demandes:', error);
        }
      );
  }

  updateDemandeStatut(demandeId: number, newStatut: string) {

    this.http.put(`http://localhost:8080/demandes/update-statut/${demandeId}`, null, {
        params: { newStatut }
    }).subscribe(
        (response) => {
            // Reload the data after successful update
            this.loadDemandes();
            this.successMessage = 'Statut de la demande mis à jour avec succès !';
            setTimeout(() => {
              this.successMessage = undefined;
            }, 2000);
        },
        (error) => {
            console.error('Error updating demande statut:', error);
            this.errorMessage = 'Une erreur est survenue lors de la mise à jour du statut.';
            setTimeout(() => {
              this.errorMessage = undefined;
            }, 2000);
        }
    );
}



}
