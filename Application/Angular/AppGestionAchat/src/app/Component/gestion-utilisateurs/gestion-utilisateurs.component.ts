import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-gestion-utilisateurs',
  templateUrl: './gestion-utilisateurs.component.html',
  styleUrls: ['./gestion-utilisateurs.component.css']
})
export class GestionUtilisateursComponent implements OnInit {
  users: any[] = [];
  nom: string = '';
  prenom: string = '';
  adresse: string = '';
  contact: string = '';
  mdp: string = '';
  role: string = ''; // Initialize role here
  email: string = '';
  dept: string = '';
  successMessageDelete: string | undefined;
  errorMessageDelete: string | undefined;
  successMessageAjoute: string | undefined;
  errorMessageAjoute: string | undefined;
  successMessageUpdate: string | undefined;
  errorMessageUpdate: string | undefined;
  nomRecherche: string = '';
  fournisseurs: any[] = [];
  fournisseurId: number | null | undefined;
  selectedFournisseur: any;

  selectedUser: any = {}; // Variable to store the selected user for update

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.successMessageDelete = undefined;
    this.errorMessageDelete = undefined;
    this.successMessageAjoute = undefined;
    this.errorMessageAjoute = undefined;
    this.successMessageUpdate = undefined;
    this.errorMessageUpdate = undefined;
  }

  convertImageToUrl(imageData: string): SafeUrl {
    // Convertir les données binaires en une URL d'image sécurisée
    const imageUrl = 'data:image/jpeg;base64,' + imageData; // Vous devrez peut-être ajuster le type de l'image en fonction de vos données
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
}

  ngOnInit(): void {
    this.loadUsers();
    this.loadFournisseurs();
  }

  loadUsers() {
    this.http.get<any[]>('http://localhost:8080/user/getAllUsers')
      .subscribe(
        (users) => {
          this.users = users.reverse();
        },
        (error) => {
          console.error('Error loading users:', error);
        }
      );
  }

  // Load fournisseurs
  loadFournisseurs() {
    this.http.get<any[]>('http://localhost:8080/fournisseur/getAllFournisseurs')
      .subscribe(
        (fournisseurs) => {
          this.fournisseurs = fournisseurs;
        },
        (error) => {
          console.error('Erreur lors du chargement des fournisseurs :', error);
        }
      );
  }

  // addUser
  addUser() {
    let deptValue = null; // Valeur par défaut pour le département
  
    // Si le rôle de l'utilisateur est "USER", utilisez la valeur du département, sinon laissez-la comme null
    if (this.role === 'USER') {
      deptValue = this.dept;
    }

    let fournisseurId = null; // Initialiser l'ID du fournisseur à null par défaut

    // Si le rôle de l'utilisateur est "FOURNISSEUR" et un fournisseur est sélectionné, utilisez l'ID du fournisseur
    if (this.role === 'FOURNISSEUR' && this.selectedFournisseur) {
      fournisseurId = this.selectedFournisseur.id_fournisseur; // Assurez-vous de remplacer 'id' par le nom de la propriété contenant l'ID du fournisseur
  }
  
    const newUser = {
      first_name: this.nom,
      last_name: this.prenom,
      adresse: this.adresse,
      contact: this.contact,
      password: this.mdp,
      email: this.email,
      role: this.role,
      dept: deptValue,
      fournisseur: {
        id_fournisseur: fournisseurId
      },
      
    };
  
    this.http.post<any>('http://localhost:8080/user/addUser', newUser)
      .subscribe(
        (response) => {
          console.log('New user added successfully:', response);
          this.successMessageAjoute = 'Utilisateur ajouté avec succès';
          setTimeout(() => {
            this.successMessageAjoute = undefined;
          }, 2000);
          this.loadUsers();
          this.clearForm();
        },
        (error) => {
          console.error('Error adding user:', error);
          this.errorMessageAjoute = "L'adresse email existe déjà !";
          setTimeout(() => {
            this.errorMessageAjoute = undefined;
          }, 2000);
        }
      );
  }
  

  // Delete User
  deleteUser(userId: number) {
    this.http.delete(`http://localhost:8080/user/deleteUser/${userId}`, { responseType: 'text' })
      .subscribe(
        (response) => {
          console.log('User deleted successfully:', response);
          const index = this.users.findIndex(user => user.userId === userId);
          if (index !== -1) {
            this.users.splice(index, 1);
          }
          this.successMessageDelete = 'Utilisateur supprimé avec succès';
          setTimeout(() => {
            this.successMessageDelete = undefined;
          }, 2000);
        },
        (error) => {
          console.error('Error deleting user:', error);
          this.errorMessageDelete = "Impossible de supprimer cet utilisateur car il a des transactions en cours !";
          setTimeout(() => {
            this.errorMessageDelete = undefined;
          }, 2000);
        }
      );
  }

  // Reset all form fields
  clearForm() {
    this.nom = '';
    this.prenom = '';
    this.adresse = '';
    this.contact = '';
    this.mdp = '';
    this.email = '';
    this.role = 'User'; // Reset role to default value
  }

  // Search User
  searchUser() {
    if (this.nomRecherche.trim() === '') {
      this.loadUsers();
      return;
    }
    const params = new HttpParams().set('firstName', this.nomRecherche.trim());
    this.http.get<any[]>('http://localhost:8080/user/search', { params })
      .subscribe(
        (users) => {
          this.users = users;
        },
        (error) => {
          console.error('Error searching users:', error);
        }
      );
  }

  selectUserForUpdate(user: any) {
    this.selectedUser = { ...user };
  
    if (this.selectedUser.role === 'USER') {
      this.selectedUser.dept = user.dept;
    } else {
      this.selectedUser.dept = '';
    }

    // Vérifiez si le rôle de l'utilisateur est 'FOURNISSEUR' et assurez-vous que l'ID du fournisseur est sélectionné
    if (this.selectedUser.role === 'FOURNISSEUR' && this.selectedUser.fournisseur && this.selectedUser.fournisseur.id_fournisseur) {
      // Assurez-vous que le fournisseur associé à l'utilisateur est sélectionné dans le champ de sélection
      this.selectedFournisseur = this.fournisseurs.find(fournisseur => fournisseur.id_fournisseur === this.selectedUser.fournisseur.id_fournisseur);
    } else {
      // Réinitialisez le fournisseur sélectionné si le rôle n'est pas 'FOURNISSEUR' ou s'il n'y a pas de fournisseur associé à l'utilisateur
      this.selectedFournisseur = null;
    }
}

  
  // Update User
  updateUser() {
    // Si le rôle de l'utilisateur n'est pas 'USER', assurez-vous que le département est vide
    if (this.selectedUser.role !== 'USER') {
      this.selectedUser.dept = '';
    }
  
    // Si le rôle de l'utilisateur n'est pas 'FOURNISSEUR', définissez fournisseur_id sur null
    // if (this.selectedUser.role !== 'FOURNISSEUR') {
    //   this.selectedUser.fournisseur = null;
    // }
  
    // Vérifiez si la propriété fournisseur est définie dans selectedUser avant de la supprimer
    if ('fournisseur' in this.selectedUser && this.selectedFournisseur) {
      this.selectedUser.fournisseur = this.selectedFournisseur;
    }
  
    this.http.put<any>('http://localhost:8080/user/updateUser', this.selectedUser)
      .subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          this.successMessageUpdate = "Utilisateur mis à jour avec succès";
          setTimeout(() => {
            this.successMessageUpdate = undefined;
          }, 2000);
          // Masquer la fenêtre modale de mise à jour après une mise à jour réussie
          this.loadUsers(); // Recharger les utilisateurs après la mise à jour
        },
        (error) => {
          console.error('Error updating user:', error);
          this.errorMessageUpdate = "Erreur lors de la mise à jour de l'utilisateur. L'adresse e-mail est déjà utilisée par un autre utilisateur !";
          setTimeout(() => {
            this.errorMessageUpdate = undefined;
          }, 2000);
        }
      );
  }
  



refresh() {
  this.loadUsers();
  this.nomRecherche = '';
}

updateUserStatus(userId: number) {
  
  this.http.put<any>(`http://localhost:8080/user/status/${userId}`, {})
    .subscribe(
      (response) => {
        console.log('User updated successfully:', response);
        this.successMessageUpdate = "Utilisateur mis à jour avec succès";
        setTimeout(() => {
          this.successMessageUpdate = undefined;
        }, 2000);
        this.loadUsers();
      },
      (error) => {
        console.error('Error updating user:', error);
        this.errorMessageUpdate = "Erreur lors de la mise à jour de l'utilisateur. L'adresse e-mail est déjà utilisée par un autre utilisateur !";
        setTimeout(() => {
          this.errorMessageUpdate = undefined;
        }, 2000);
      }
    );
}




}
