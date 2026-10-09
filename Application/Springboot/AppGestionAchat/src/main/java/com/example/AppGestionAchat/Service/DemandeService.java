package com.example.AppGestionAchat.Service;

import com.example.AppGestionAchat.Entity.*;
import com.example.AppGestionAchat.Repository.DemandeDevisRepository;
import com.example.AppGestionAchat.Repository.DemandeRepository;
import com.example.AppGestionAchat.Repository.DevisRepository;
import com.example.AppGestionAchat.Repository.InformationSocieteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
public class DemandeService {

    @Autowired
    private InformationSocieteRepository informationSocieteRepository;

    @Autowired
    private DemandeDevisRepository demandeDevisRepository;

    @Autowired
    private DevisRepository devisRepository;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private DemandeRepository demandeAchatRepository;


    @Transactional
    public void envoyerDemande(List<DemandeAchat> demandes, List<Fournisseur> fournisseurs) {
        for (Fournisseur fournisseur : fournisseurs) {
            // Créer un nouveau devis pour ce fournisseur
            Devis devis = new Devis();
            devis.setFournisseur(fournisseur);
            devis.setDevisDate(new Date());
            devis.setStatus("En cours de création");
            devisRepository.save(devis);

            // Récupérer l'identifiant du devis nouvellement inséré
            Integer devisId = devis.getIdDevis();

            // Enregistrer chaque demande d'achat dans la table DemandeDevis avec le même identifiant de devis
            for (DemandeAchat demande : demandes) {
                // Supposez que la classe DemandeAchat ait une relation avec Produit
                Produit produit = demande.getProduit();

                DemandeDevis demandeDevis = new DemandeDevis();
                demandeDevis.setDemandeAchat(demande);
                demandeDevis.setDevis(devis);
                demandeDevis.setQuantite(demande.getQte());
                demandeDevis.setProduitName(demande.getProduitName());
                demandeDevis.setProduit_id(produit.getProduitId());
                // Ajouter la catégorie et la référence depuis l'objet Produit
                if (produit != null) {
                    demandeDevis.setCategorie(produit.getCategorie());
                    demandeDevis.setReference(produit.getReference());
                }
                demandeDevisRepository.save(demandeDevis);

                demande.setStatut("Devis en cours");
                demandeAchatRepository.save(demande);

            }
            InformationSociete informationSociete = informationSocieteRepository.findById(1).orElse(null);
            String lienConnexion = "http://localhost:4200/login"; // Lien de connexion local pour votre application Angular

            // Construction du message d'e-mail
            String sujet = "Nouvelle demande de devis";
            String contenu = "Bonjour " + fournisseur.getNom() + " " + fournisseur.getPrenom() + ",\n\n";
            contenu += "Une nouvelle demande de devis a été créée sur notre plateforme, Veuillez consulter votre compte pour plus de détails.\n\n";
            contenu += "Lien de connexion : " + lienConnexion + "\n\n";
            contenu += "Cordialement,\n" + informationSociete.getNom();

            // Envoyer un e-mail au fournisseur
            envoyerEmail(fournisseur.getEmail(), sujet, contenu);
        }
    }

    private void envoyerEmail(String destinataire, String sujet, String contenu) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinataire);
        message.setSubject(sujet);
        message.setText(contenu);
        javaMailSender.send(message);
    }


}