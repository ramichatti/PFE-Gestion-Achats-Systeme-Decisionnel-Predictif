package com.example.AppGestionAchat.Controller;

import com.example.AppGestionAchat.Entity.Commande;
import com.example.AppGestionAchat.Entity.Devis;
import com.example.AppGestionAchat.Service.CommandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/commande")
@CrossOrigin(origins = "http://localhost:4200")
public class CommandeController {
    @Autowired
    private CommandeService commandeService;

    @PostMapping("/passer/{idDevis}")
    public ResponseEntity<Object> passerCommande(@PathVariable Integer idDevis) {
        try {
            commandeService.passerCommande(idDevis);
            return new ResponseEntity<>(Collections.singletonMap("message", "Commande passée avec succès"), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Collections.singletonMap("error", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.singletonMap("error", "Une erreur s'est produite lors du traitement de la commande"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/encours")
    public ResponseEntity<List<Commande>> getAllCommandesEnCours() {
        List<Commande> commandes = commandeService.findAllEnCoursDeLivraison();
        return new ResponseEntity<>(commandes, HttpStatus.OK);
    }

    @GetMapping("/commandes/{userId}/en-cours-livraison")
    public List<Commande> findAllCommandeByUserIdAndStatus(@PathVariable Integer userId) {
        return commandeService.findAllCommandeByUserIdAndStatus(userId);
    }

    @GetMapping("/commandes/{userId}/livrée")
    public List<Commande> findAllCommandeByUserIdAndStatusRecu(@PathVariable Integer userId) {
        return commandeService.findAllCommandeByUserIdAndStatusRecu(userId);
    }

    @PostMapping("/reception/{idCommande}/{avis}")
    public ResponseEntity<?> receptionCommande(@PathVariable Integer idCommande,
                                               @PathVariable Integer avis) {
        try {
            commandeService.mettreReception(idCommande, avis);
            return ResponseEntity.ok(Map.of("message", "La réception de la commande a été effectuée avec succès."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Erreur lors de la réception de la commande : " + e.getMessage()));
        }
    }

    @GetMapping("/recues")
    public List<Commande> getCommandesRecues() {
        return commandeService.getAllCommandesRecues();
    }

    @GetMapping("/{nom}")
    public  List<Commande> trouverCommandeParId(@PathVariable String nom) {
        return commandeService.trouverCommandeParIdEtStatut(nom);
    }

    @GetMapping("/{userId}/{id}")
    public ResponseEntity<?> getCommandeByFournisseurIdAndIdAndStatus(@PathVariable Integer userId, @PathVariable Integer id) {
        Commande commande = commandeService.findCommandeByFournisseurIdAndIdAndStatus(userId, id);
        if (commande != null) {
            return ResponseEntity.ok(commande);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La commande n'a pas été trouvée.");
        }
    }

    @GetMapping("/fournisseur/{nom}")
    public ResponseEntity<List<Commande>> getCommandesByFournisseurnomAndStatus(@PathVariable String nom) {
        List<Commande> commandes = commandeService.findByFournisseurnomAndStatusIn(nom);
        if (!commandes.isEmpty()) {
            return ResponseEntity.ok(commandes);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
