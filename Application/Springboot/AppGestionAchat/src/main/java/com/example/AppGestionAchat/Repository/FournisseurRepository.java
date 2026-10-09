package com.example.AppGestionAchat.Repository;

import com.example.AppGestionAchat.Entity.Fournisseur;
import com.example.AppGestionAchat.Entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FournisseurRepository extends JpaRepository<Fournisseur, Integer> {

    @Query("SELECT f FROM Fournisseur f WHERE f.famille_fournisseur = :famille_fournisseur")
    List<Fournisseur> findByFamilleFournisseur(String famille_fournisseur);

    @Query("SELECT f FROM Fournisseur f JOIN User u ON f.id_fournisseur = u.fournisseur.id_fournisseur WHERE u.Bloquer = false")
    List<Fournisseur> findAllNonBlockedFournisseurs();
}
