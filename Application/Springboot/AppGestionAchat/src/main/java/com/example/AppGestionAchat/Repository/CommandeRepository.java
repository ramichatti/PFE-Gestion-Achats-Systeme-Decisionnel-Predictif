package com.example.AppGestionAchat.Repository;

import com.example.AppGestionAchat.Entity.Commande;
import com.example.AppGestionAchat.Entity.DemandeAchat;
import com.example.AppGestionAchat.Entity.Devis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Integer> {

    @Query("SELECT c FROM Commande c WHERE c.status = :status")
    List<Commande> findAllEnCours(@Param("status") String status);

    @Query("SELECT c FROM Commande c JOIN c.fournisseur f WHERE f.id_fournisseur = (SELECT u.fournisseur.id_fournisseur FROM User u WHERE u.userId = :userId) AND c.status = 'En cours de livraison'")
    List<Commande> findAllCommandeByUserIdAndStatus(@Param("userId") Integer userId);

    @Query("SELECT c FROM Commande c JOIN c.fournisseur f WHERE f.id_fournisseur = (SELECT u.fournisseur.id_fournisseur FROM User u WHERE u.userId = :userId) AND c.status = 'Reçu'")
    List<Commande> findAllCommandeByUserIdAndStatusRecu(@Param("userId") Integer userId);

    List<Commande> findByStatus(String status);

    @Query("SELECT c FROM Commande c WHERE c.fournisseur.nom = :nom AND (c.status = 'Reçu')")
    List<Commande> findByIdAndStatut(@Param("nom") String nom);

    @Query("SELECT c FROM Commande c WHERE c.fournisseur.id_fournisseur = (SELECT u.fournisseur.id_fournisseur FROM User u WHERE u.userId = :userId) AND c.id = :id AND c.status IN ('Reçu')")
    Commande findByFournisseurIdAndIdAndStatusIn(@Param("userId") Integer userId, @Param("id") Integer id);

    @Query("SELECT c FROM Commande c WHERE c.fournisseur.nom = :nom AND c.status IN ('En cours de livraison')")
    List<Commande> findByFournisseurnomAndStatusIn(@Param("nom") String nom);

}
