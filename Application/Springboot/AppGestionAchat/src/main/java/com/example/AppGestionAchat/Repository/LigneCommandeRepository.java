package com.example.AppGestionAchat.Repository;

import com.example.AppGestionAchat.Entity.LigneCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LigneCommandeRepository extends JpaRepository<LigneCommande, Integer> {

    @Query("SELECT lc FROM LigneCommande lc WHERE lc.commande.idCommande = :commandeId")
    List<LigneCommande> findAllByCommandeId(@Param("commandeId") Integer commandeId);
}
