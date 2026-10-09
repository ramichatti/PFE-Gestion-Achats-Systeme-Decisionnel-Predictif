package com.example.AppGestionAchat.Repository;
import com.example.AppGestionAchat.Entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Integer> {

    @Query("SELECT u FROM Produit u WHERE u.categorie = :categorie")
    List<Produit> findByCategorie(String categorie);
}
