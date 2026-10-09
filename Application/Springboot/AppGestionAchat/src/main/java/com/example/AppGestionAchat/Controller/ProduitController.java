package com.example.AppGestionAchat.Controller;


import com.example.AppGestionAchat.Entity.Produit;
import com.example.AppGestionAchat.Entity.User;
import com.example.AppGestionAchat.Repository.ProduitRepository;
import com.example.AppGestionAchat.Service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produit")
@CrossOrigin(origins = "http://localhost:4200")
public class ProduitController {

    @Autowired
    private ProduitService produitService;

    @Autowired
    private ProduitRepository produitRepository;

    @PostMapping("/create")
    public Produit createProduit(@RequestBody Produit produit) {
        return produitService.createProduit(produit);
    }

    @GetMapping("/getAllProducts")
    public List<Produit> getAllProducts() {
        return produitRepository.findAll();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Produit>> searchUsersByFirstName(@RequestParam("categorie") String categorie) {
        List<Produit> Produits = produitRepository.findByCategorie(categorie);
        return ResponseEntity.ok(Produits);
    }

    @DeleteMapping("/deleteProduit/{produitId}")
    public ResponseEntity<?> deleteProduit(@PathVariable Integer produitId) {
        try {
            produitService.deleteProduit(produitId);
            return ResponseEntity.ok().body("Produit deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete Produit");
        }
    }

    @PutMapping("/updateProduit")
    public ResponseEntity<Produit> updateUser(@RequestBody Produit produit) {
        produitService.updateProduit(produit);
        return new ResponseEntity<>(produit, HttpStatus.OK);
    }

}
