import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login.component';
import { UserComponent } from './Component/user/user.component';
import { DemandeAchatComponent } from './Component/demande-achat/demande-achat.component';
import { AdminComponent } from './Component/admin/admin.component';
import { GestionUtilisateursComponent } from './Component/gestion-utilisateurs/gestion-utilisateurs.component';
import { ProduitComponent } from './Component/produit/produit.component';
import { GestionFournisseurComponent } from './Component/gestion-fournisseur/gestion-fournisseur.component';
import { ProfileComponent } from './Component/profile/profile.component';
import { AccueilComponent } from './Component/accueil/accueil.component';
import { ResponsableComponent } from './Component/responsable/responsable.component';
import { DemandeConsulterComponent } from './Component/demande-consulter/demande-consulter.component';
import { DemandeDevisComponent } from './Component/demande-devis/demande-devis.component';
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
import { Dashboard1Component } from './Component/dashboard1/dashboard1.component';
import { PredictionComponent } from './Component/prediction/prediction.component';



const routes: Routes = [
  { path: "login", component: LoginComponent},

  {path: 'mdp_oublie', component: ForgetPasswordComponent },
  
  {
    path: "user",component: UserComponent, children: [{ path: 'accueil', component: AccueilComponent },
                                                      { path: "profile", component: ProfileComponent},
                                                      { path: 'demande', component: DemandeAchatComponent },
                                                      { path: 'historique_demande_achat', component: HistoriqueDemandeAchatComponent },
                                                      { path: 'reception_commande', component: ReceptionCommandeComponent },
                                                      ]
                                                      , canActivate: [UserGuard,RoleGuard]    

  },

  {
    path: "admin",component: AdminComponent , children:  [{ path: 'accueil', component: AccueilComponent },
                                                          { path: 'gestion_utilisateur', component: GestionUtilisateursComponent },
                                                          { path: 'dashboard', component: Dashboard1Component },
                                                          { path: 'prediction', component: PredictionComponent },
                                                          { path: 'gestion_produit', component: ProduitComponent },
                                                          { path: 'gestion_fournisseur', component: GestionFournisseurComponent },
                                                          { path: "consulter_demande", component: DemandeConsulterComponent},
                                                          { path: "demande_devis", component: DemandeDevisComponent},
                                                          { path: "profile", component: ProfileComponent},
                                                          { path: "consulter_devis", component: ConsulterDevisComponent},
                                                          { path: "commande", component: CommandeComponent},
                                                          { path: "liste_demandes_cloturees", component: ListeDesDemandesClotureesComponent},
                                                          { path: "liste_devis_cloturees", component: ListeDesDevisClotureesComponent},
                                                          { path: "liste_commandes_cloturees", component: ListeDesCommandesClotureesComponent}]
                                                          , canActivate: [AdminGuard,RoleGuard]       
  },

  {
    path: "responsable",component: ResponsableComponent , children:  [{ path: 'accueil', component: AccueilComponent },
                                                                      { path: "profile", component: ProfileComponent},
                                                                      { path: "consulter_demande", component: DemandeConsulterComponent},
                                                                      { path: 'dashboard', component: Dashboard1Component },
                                                                      { path: 'prediction', component: PredictionComponent },
                                                                      { path: "demande_devis", component: DemandeDevisComponent},
                                                                      { path: "consulter_devis", component: ConsulterDevisComponent},
                                                                      { path: "commande", component: CommandeComponent},
                                                                      { path: "liste_demandes_cloturees", component: ListeDesDemandesClotureesComponent},
                                                                      { path: "liste_devis_cloturees", component: ListeDesDevisClotureesComponent},
                                                                      { path: "liste_commandes_cloturees", component: ListeDesCommandesClotureesComponent}]  
                                                                      , canActivate: [ResponsableGuard,RoleGuard]        
  },

  {
    path: "fournisseur",component: FournisseurComponent , children:  [{ path: 'accueil', component: AccueilComponent },
                                                                      { path: 'devis', component: CreerDevisComponent },
                                                                      { path: "profile", component: ProfileComponent},
                                                                      { path: 'resultat_devis', component: ResultatDevisComponent },
                                                                      { path: 'commandes_vente_encours', component: CommandeFournisseurComponent },
                                                                      { path: 'commandes_vente_livré', component:CommandeVente2Component }] 
                                                                      , canActivate: [FournisseurGuard,RoleGuard]      
  },

  { path: "**", component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
