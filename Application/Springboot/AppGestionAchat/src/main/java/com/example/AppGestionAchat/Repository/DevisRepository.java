package com.example.AppGestionAchat.Repository;

import com.example.AppGestionAchat.Entity.DemandeAchat;
import com.example.AppGestionAchat.Entity.Devis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DevisRepository extends JpaRepository<Devis, Integer> {

    @Query("SELECT d FROM Devis d WHERE d.fournisseur.id_fournisseur = (SELECT u.fournisseur.id_fournisseur FROM User u WHERE u.userId = :userId) AND d.status = 'En cours de création'")
    List<Devis> findAllDevisEnCoursByUserId(@Param("userId") Integer userId);

    @Query("SELECT d FROM Devis d WHERE d.status = 'Créé'")
    List<Devis> findByStatusCree();

    @Query("SELECT d FROM Devis d WHERE d.fournisseur.id_fournisseur = (SELECT u.fournisseur.id_fournisseur FROM User u WHERE u.userId = :userId) AND d.status <> 'En cours de création'")
    List<Devis> findAllDevisByUserId(@Param("userId") Integer userId);

    @Query("SELECT d FROM Devis d WHERE d.status = 'Archive' OR d.status = 'Cloturé'")
    List<Devis> findByStatusArchiveOrCloture();

    @Query("SELECT d FROM Devis d WHERE d.fournisseur.nom = :nom AND (d.status = 'Archive' OR d.status = 'Clôture')")
    List<Devis> findByIdAndStatut(@Param("nom") String nom);

    @Query("SELECT d FROM Devis d WHERE d.fournisseur.id_fournisseur = (SELECT u.fournisseur.id_fournisseur FROM User u WHERE u.userId = :userId) AND d.id = :id AND d.status IN ('Accepté', 'Crée', 'Archivé', 'Clôturé')")
    Devis findByFournisseurIdAndIdEqualTo(@Param("userId") Integer userId, @Param("id") Integer id);

    @Query("SELECT d FROM Devis d WHERE d.fournisseur.nom = :nom AND d.status = 'Crée' ")
    List<Devis> findBynomAndStatut(@Param("nom") String nom);


}