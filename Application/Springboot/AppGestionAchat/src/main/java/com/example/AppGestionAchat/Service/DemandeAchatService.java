package com.example.AppGestionAchat.Service;

import com.example.AppGestionAchat.Entity.DemandeAchat;
import com.example.AppGestionAchat.Entity.InformationSociete;
import com.example.AppGestionAchat.Entity.Produit;
import com.example.AppGestionAchat.Entity.User;
import com.example.AppGestionAchat.Repository.DemandeRepository;
import com.example.AppGestionAchat.Repository.InformationSocieteRepository;
import com.example.AppGestionAchat.Repository.ProduitRepository;
import com.example.AppGestionAchat.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class DemandeAchatService {

    @Autowired
    private DemandeRepository demandeAchatRepository;

    @Autowired
    private ProduitRepository produitRepository; // Ajoutez l'injection de dépendance pour le repository du Produit

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InformationSocieteRepository informationSocieteRepository;

    public DemandeAchat createDemandeAchat(DemandeAchat demandeAchat) {
        // Récupérez l'entité Produit correspondante à partir de la base de données en fonction de son ID
        Produit produit = produitRepository.findById(demandeAchat.getProduit().getProduitId()).orElse(null);

        // Assurez-vous que l'entité Produit est présente
        if (produit != null) {
            // Associez l'entité Produit à l'entité DemandeAchat
            demandeAchat.setProduit(produit);
            // Enregistrez la demande d'achat dans la base de données
            return demandeAchatRepository.save(demandeAchat);
        } else {
            // Gérez le cas où l'entité Produit n'est pas trouvée
            throw new RuntimeException("Produit non trouvé pour l'ID spécifié: " + demandeAchat.getProduit().getProduitId());
        }
    }

    public List<DemandeAchat> trouverDemandesPourUtilisateur(Integer userId) {
        List<String> statuts = Arrays.asList("Accepté", "En cours de livraison", "En cours de traitement","Devis en cours");
        return demandeAchatRepository.findByUserUserIdAndStatutIn(userId, statuts);
    }

    public List<DemandeAchat> trouverDemandesPourUtilisateurRC(Integer userId) {
        List<String> statuts = Arrays.asList("Refusé", "Clôture");
        return demandeAchatRepository.findByUserUserIdAndStatutIn(userId, statuts);
    }

    @Transactional
    public void deleteDemandeAchat(Integer id) {
        demandeAchatRepository.deleteById(id);
    }

    public List<DemandeAchat> getAllDemandesEnCours() {
        return demandeAchatRepository.findAllByStatut("En cours de traitement");
    }

    public List<DemandeAchat> getAllDemandesAccepte() {
        return demandeAchatRepository.findAllByStatut("Accepté");
    }

    @Transactional
    public void updateStatut(Integer id, String newStatut) {
        DemandeAchat demandeAchat = demandeAchatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DemandeAchat not found with ID: " + id));

        if (!isValidStatut(newStatut)) {
            throw new IllegalArgumentException("Invalid status provided: " + newStatut);
        }

        demandeAchat.setStatut(newStatut);
        demandeAchatRepository.save(demandeAchat);

        // Retrieve the user associated with the DemandeAchat
        User user = demandeAchat.getUser();
        InformationSociete informationSociete = informationSocieteRepository.findById(1).orElse(null);

        // Check if user is not null
        if (user != null) {
            // Retrieve user's email
            String userEmail = user.getEmail();

            // Check if userEmail is not null or empty
            if (userEmail != null && !userEmail.isEmpty()) {
                // Construction du message d'e-mail
                String lienConnexion = "http://localhost:4200/login";

                String sujet = "Votre demande d'achat : " + newStatut;;
                String contenu = "Bonjour " + user.getLast_name() + " " + user.getFirst_name() + ",\n\n";
                contenu += "La demande d'achat avec le numéro " + id  + " a été " + newStatut + " sur notre plateforme.\n";
                contenu += "Veuillez consulter votre compte pour plus de détails.\n\n";
                contenu += "Lien de connexion : " + lienConnexion + "\n\n";
                contenu += "Cordialement,\n" + informationSociete.getNom();


                // Envoyer l'e-mail à l'utilisateur
                envoyerEmail(userEmail, sujet, contenu);
            } else {
                // Gérer le cas où l'e-mail de l'utilisateur est null ou vide
                throw new RuntimeException("L'e-mail de l'utilisateur est null ou vide.");
            }
        } else {
            // Gérer le cas où l'utilisateur associé à la demande d'achat est null
            throw new RuntimeException("Aucun utilisateur associé à la demande d'achat.");
        }
    }

    private void envoyerEmail(String destinataire, String sujet, String contenu) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinataire);
        message.setSubject(sujet);
        message.setText(contenu);
        javaMailSender.send(message);
    }

    // Optional: Define a method to validate allowed statuses
    private boolean isValidStatut(String statut) {
        // Replace with your logic to check allowed statuses (e.g., "En cours de traitement", "Accepté", "Refusé")
        return statut.equals("En cours de traitement") || statut.equals("Accepté") || statut.equals("Refusé");
    }

    public List<DemandeAchat> findDemandesRefuseesEtCloturees() {
        List<String> statuts = Arrays.asList("Refusé", "Cloturé");
        return demandeAchatRepository.findAllByStatuts(statuts);
    }

    public  List<DemandeAchat> trouverDemandeParIdEtStatut(String first_name) {
        return demandeAchatRepository.findByIdAndStatut(first_name);
    }

    public DemandeAchat findByProduitName(Integer userId, String produitName) {
        return demandeAchatRepository.findByProduitName(userId, produitName);
    }

}
