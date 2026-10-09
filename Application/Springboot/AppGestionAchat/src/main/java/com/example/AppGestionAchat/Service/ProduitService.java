package com.example.AppGestionAchat.Service;

import com.example.AppGestionAchat.Entity.DemandeAchat;
import com.example.AppGestionAchat.Entity.Produit;
import com.example.AppGestionAchat.Entity.User;
import com.example.AppGestionAchat.Repository.ProduitRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProduitService {

    @Autowired
    private ProduitRepository produitRepository;

    public Produit createProduit(Produit produit) {
        return produitRepository.save(produit);
    }

    @Transactional
    public void deleteProduit(Integer produitId) {
       produitRepository.deleteById(produitId);
    }

    public List<Produit> findByCategorie(String categorie) {
        return produitRepository.findByCategorie(categorie);
    }

    public Optional<Produit> updateProduit(Produit produit) {
        return produitRepository.findById(produit.getProduitId())
                .map(existingProduit -> {
                    existingProduit.setNom(produit.getNom());
                    existingProduit.setReference(produit.getReference());
                    existingProduit.setCategorie(produit.getCategorie());
                    existingProduit.setDescription(produit.getDescription());
                    // Vous pouvez mettre à jour d'autres champs si nécessaire

                    return produitRepository.save(existingProduit);
                });
    }

}
