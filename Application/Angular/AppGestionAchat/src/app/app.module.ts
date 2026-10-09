import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Component/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarUserComponent } from './Component/navbar-user/navbar-user.component';
import { UserComponent } from './Component/user/user.component';
import { DemandeAchatComponent } from './Component/demande-achat/demande-achat.component';

import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './Component/admin/admin.component';
import { NavbarAdminComponent } from './Component/navbar-admin/navbar-admin.component';
import { CommonModule } from '@angular/common';
import { GestionUtilisateursComponent } from './Component/gestion-utilisateurs/gestion-utilisateurs.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProduitComponent } from './Component/produit/produit.component';
import { GestionFournisseurComponent } from './Component/gestion-fournisseur/gestion-fournisseur.component';
import { ProfileComponent } from './Component/profile/profile.component';
import { AccueilComponent } from './Component/accueil/accueil.component';
import { NavbarResponsableComponent } from './Component/navbar-responsable/navbar-responsable.component';
import { ResponsableComponent } from './Component/responsable/responsable.component';
import { DemandeConsulterComponent } from './Component/demande-consulter/demande-consulter.component';
import { DemandeDevisComponent } from './Component/demande-devis/demande-devis.component';
import { NavbarFournisseurComponent } from './Component/navbar-fournisseur/navbar-fournisseur.component';
import { FournisseurComponent } from './Component/fournisseur/fournisseur.component';
import { CreerDevisComponent } from './Component/creer-devis/creer-devis.component';
import { ConsulterDevisComponent } from './Component/consulter-devis/consulter-devis.component';
import { ResultatDevisComponent } from './Component/resultat-devis/resultat-devis.component';
import { HistoriqueDemandeAchatComponent } from './Component/historique-demande-achat/historique-demande-achat.component';
import { CommandeComponent } from './Component/commande/commande.component';
import { CommandeFournisseurComponent } from './Component/commande-vente1/commande-fournisseur.component';
import { CommandeVente2Component } from './Component/commande-vente2/commande-vente2.component';
import { ReceptionCommandeComponent } from './Component/reception-commande/reception-commande.component';
import { ListeDesDemandesClotureesComponent } from './Component/liste-des-demandes-cloturees/liste-des-demandes-cloturees.component';
import { ListeDesDevisClotureesComponent } from './Component/liste-des-devis-cloturees/liste-des-devis-cloturees.component';
import { ListeDesCommandesClotureesComponent } from './Component/liste-des-commandes-cloturees/liste-des-commandes-cloturees.component';
import { ForgetPasswordComponent } from './Component/forget-password/forget-password.component';
import { AdminGuard } from './guard/admin.guard';
import { UserGuard } from './guard/user.guard';
import { ResponsableGuard } from './guard/responsable.guard';
import { FournisseurGuard } from './guard/fournisseur.guard';
import { RoleGuard } from './RoleGuard/role-guard.guard';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { Dashboard1Component } from './Component/dashboard1/dashboard1.component';
import { PredictionComponent } from './Component/prediction/prediction.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarUserComponent,
    UserComponent,
    DemandeAchatComponent,
    AdminComponent,
    NavbarAdminComponent,
    GestionUtilisateursComponent,
    ProduitComponent,
    GestionFournisseurComponent,
    ProfileComponent,
    AccueilComponent,
    NavbarResponsableComponent,
    ResponsableComponent,
    DemandeConsulterComponent,
    DemandeDevisComponent,
    NavbarFournisseurComponent,
    FournisseurComponent,
    CreerDevisComponent,
    ConsulterDevisComponent,
    ResultatDevisComponent,
    HistoriqueDemandeAchatComponent,
    CommandeComponent,
    CommandeFournisseurComponent,
    CommandeVente2Component,
    ReceptionCommandeComponent,
    ListeDesDemandesClotureesComponent,
    ListeDesDevisClotureesComponent,
    ListeDesCommandesClotureesComponent,
    ForgetPasswordComponent,
    Dashboard1Component,
    PredictionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({
      showForeground:true,
    }),
  ],
  providers: [
    provideClientHydration(),
    AdminGuard,
    UserGuard,
    ResponsableGuard,
    FournisseurGuard,
    RoleGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
