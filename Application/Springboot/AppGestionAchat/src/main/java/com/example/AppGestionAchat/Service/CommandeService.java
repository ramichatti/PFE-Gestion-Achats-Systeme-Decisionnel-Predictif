package com.example.AppGestionAchat.Service;

import com.example.AppGestionAchat.Entity.*;
import com.example.AppGestionAchat.Repository.*;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommandeService {
    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private DevisRepository devisRepository;

    @Autowired
    private DemandeDevisRepository demandeDevisRepository;

    @Autowired
    private LigneCommandeRepository ligneCommandeRepository;

    @Autowired
    private FournisseurRepository fournisseurRepository;

    @Autowired
    private  DemandeRepository demandeAchatRepository;


    @Autowired
    private InformationSocieteRepository informationSocieteRepository;

    @Autowired
    private UserRepository userRepository;


    @Transactional
    public void passerCommande(Integer idDevis) {
        Devis devis = devisRepository.findById(idDevis)
                .orElseThrow(() -> new IllegalArgumentException("Devis non trouvé avec l'ID: " + idDevis));

        // Mettre à jour le statut du devis en "Commandé"
        devis.setStatus("Accepté");
        devisRepository.save(devis);

        // Crée une nouvelle commande à partir du devis
        Commande commande = new Commande();
        commande.setPrix(devis.getPrix());
        commande.setTotalTva(devis.getTotalTva());
        commande.setTotalHt(devis.getTotalHt());
        commande.setStatus("En cours de livraison");
        commande.setLivraison(devis.getLivraison());
        commande.setCommandeDate(new Date());
        commande.setFournisseur(devis.getFournisseur());
        commande.setDevis(devis);

        // Récupérer les demandes de devis associées à ce devis en utilisant l'id_devis
        List<DemandeDevis> demandesDevis = demandeDevisRepository.findByDevisIdDevis(idDevis);

        // Sauvegarde la nouvelle commande dans la base de données
        commande = commandeRepository.save(commande);

        // Crée et ajoute les lignes de commande à partir des demandes de devis
        for (DemandeDevis demandeDevis : demandesDevis) {

            LigneCommande ligneCommande = new LigneCommande();

            ligneCommande.setQuantite(demandeDevis.getQuantite());
            ligneCommande.setPrixUnitaire(demandeDevis.getPrix_unitaire());
            ligneCommande.setRemise(demandeDevis.getRemise());
            ligneCommande.setTVA(demandeDevis.getTVA());
            ligneCommande.setTTC(demandeDevis.getTTC());
            ligneCommande.setMontantTVA(demandeDevis.getMontanttva());
            ligneCommande.setMontantHT(demandeDevis.getMontantht());
            ligneCommande.setProduitName(demandeDevis.getProduitName());
            ligneCommande.setCategorie(demandeDevis.getCategorie());
            ligneCommande.setReference(demandeDevis.getReference());
            ligneCommande.setProduit_id(demandeDevis.getProduit_id());
            ligneCommande.setCommande(commande);

            // Ajoute la ligne de commande à la commande
            ligneCommandeRepository.save(ligneCommande);
        }

        // Mettre à jour le statut de la demande d'achat en "En livraison"
        for (DemandeDevis demandeDevis : demandesDevis) {
            DemandeAchat demandeAchat = demandeAchatRepository.findById(demandeDevis.getDemandeAchat().getDemandeId()).orElse(null);
            if (demandeAchat != null) {
                demandeAchat.setStatut("En cours de livraison");
                demandeAchatRepository.save(demandeAchat);
            } else {
                // Gérer si la demande d'achat associée n'est pas trouvée
            }
        }



        // Envoyer l'email de confirmation
        sendConfirmationEmail(commande.getIdCommande());

    }
    private void sendConfirmationEmail(Integer idCommande) {
        Commande commande = commandeRepository.findById(idCommande).orElse(null);
        if (commande != null) {
            Integer fournisseurId = commande.getFournisseur().getId_fournisseur(); // Supposons que le fournisseur soit une entité
            Fournisseur fournisseur = fournisseurRepository.findById(fournisseurId).orElse(null);
            InformationSociete informationSociete = informationSocieteRepository.findById(1).orElse(null);
            if (fournisseur != null) {
                String emailFournisseur = fournisseur.getEmail();

                MimeMessage message = emailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message);
                try {
                    String lienConnexion = "http://localhost:4200/login";
                    helper.setTo(emailFournisseur);
                    helper.setSubject("Commande confirmée");
                    String contenu = "Bonjour " + fournisseur.getNom() + " " + fournisseur.getPrenom() + ",\n\n";
                    contenu += "Votre commande a été confirmée avec succès, Veuillez consulter votre compte pour plus de détails.\n\n";
                    contenu += "Lien de connexion : " + lienConnexion + "\n\n";
                    contenu += "Cordialement,\n" + informationSociete.getNom();
                    helper.setText(contenu);
                } catch (MessagingException e) {
                    e.printStackTrace();
                    // Gérer l'exception si l'e-mail ne peut pas être envoyé
                }
                emailSender.send(message);
            } else {
                // Gérer si le fournisseur n'est pas trouvé
            }
        } else {
            // Gérer si la commande n'est pas trouvée
        }
    }

    public List<Commande> findAllEnCoursDeLivraison() {
        return commandeRepository.findAllEnCours("En cours de livraison");
    }

    public List<Commande> findAllCommandeByUserIdAndStatus(Integer userId) {
        return commandeRepository.findAllCommandeByUserIdAndStatus(userId);
    }

    @Transactional
    public void mettreReception(Integer idCommande, Integer avis) {
        // Récupérer la commande à partir de son identifiant
        Commande commande = commandeRepository.findById(idCommande)
                .orElseThrow(() -> new IllegalArgumentException("Commande non trouvée avec l'ID: " + idCommande));

        // Mettre à jour le statut de la commande
        commande.setStatus("Reçu");
        commande.setAvis(avis);
        commandeRepository.save(commande);

        // Récupérer le devis associé à la commande
        Devis devis = commande.getDevis();

        // Mettre à jour le statut du devis
        devis.setStatus("Clôture");
        devisRepository.save(devis);

        // Récupérer la liste des demandes d'achat associées au devis
        List<DemandeDevis> demandesDevis = demandeDevisRepository.findByDevisIdDevis(devis.getIdDevis());

        // Mettre à jour le statut de chaque demande d'achat associée
        for (DemandeDevis demandeDevis : demandesDevis) {
            DemandeAchat demandeAchat = demandeDevis.getDemandeAchat();
            if (demandeAchat != null) {
                // Mettre à jour le statut de la demande d'achat
                demandeAchat.setStatut("Clôture");
                demandeAchatRepository.save(demandeAchat);
            }
        }
    }


    public List<Commande> findAllCommandeByUserIdAndStatusRecu(Integer userId) {
        return commandeRepository.findAllCommandeByUserIdAndStatusRecu(userId);
    }

    public List<Commande> getAllCommandesRecues() {
        return commandeRepository.findByStatus("Reçu");
    }

    public  List<Commande> trouverCommandeParIdEtStatut(String nom) {
        return commandeRepository.findByIdAndStatut(nom);
    }

    public Commande findCommandeByFournisseurIdAndIdAndStatus(Integer userId, Integer id) {
        return commandeRepository.findByFournisseurIdAndIdAndStatusIn(userId, id);
    }

    public List<Commande> findByFournisseurnomAndStatusIn(String nom) {
        return commandeRepository.findByFournisseurnomAndStatusIn(nom);
    }
}
