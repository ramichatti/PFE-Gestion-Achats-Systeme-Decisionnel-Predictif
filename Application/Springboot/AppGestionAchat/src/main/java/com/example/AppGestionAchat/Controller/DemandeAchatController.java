package com.example.AppGestionAchat.Controller;

import com.example.AppGestionAchat.Entity.DemandeAchat;
import com.example.AppGestionAchat.Repository.DemandeRepository;
import com.example.AppGestionAchat.Service.DemandeAchatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/demandes")
@CrossOrigin(origins = "http://localhost:4200")
public class DemandeAchatController {

    @Autowired
    private DemandeAchatService demandeAchatService;

    @Autowired
    private DemandeRepository demandeAchatRepository;

    @PostMapping("/create")
    public ResponseEntity<DemandeAchat> createDemandeAchat(@RequestBody DemandeAchat demandeAchat) {
        DemandeAchat createdDemandeAchat = demandeAchatService.createDemandeAchat(demandeAchat);
        return new ResponseEntity<>(createdDemandeAchat, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public List<DemandeAchat> trouverDemandesPourUtilisateur(@PathVariable Integer userId) {
        return demandeAchatService.trouverDemandesPourUtilisateur(userId);
    }

    @GetMapping("/user_historique/{userId}")
    public List<DemandeAchat> trouverDemandesPourUtilisateurRC(@PathVariable Integer userId) {
        return demandeAchatService.trouverDemandesPourUtilisateurRC(userId);
    }

    @GetMapping("/en_cours")
    public ResponseEntity<List<DemandeAchat>> getAllDemandesEnCours() {
        List<DemandeAchat> demandesEnCours = demandeAchatService.getAllDemandesEnCours();
        return new ResponseEntity<>(demandesEnCours, HttpStatus.OK);
    }

    @GetMapping("/accepté")
    public ResponseEntity<List<DemandeAchat>> getAllDemandesAccepte() {
        List<DemandeAchat> demandesAccepte = demandeAchatService.getAllDemandesAccepte();
        return new ResponseEntity<>(demandesAccepte, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteDemandeAchat(@PathVariable Integer id) {
        demandeAchatService.deleteDemandeAchat(id);
    }

    @PutMapping("/update-statut/{id}")
    public ResponseEntity<?> updateDemandeAchatStatut(@PathVariable Integer id, @RequestParam String newStatut) {
        try {
            demandeAchatService.updateStatut(id, newStatut);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/refusees-et-cloturees")
    public ResponseEntity<List<DemandeAchat>> getDemandesRefuseesEtCloturees() {
        List<DemandeAchat> demandes = demandeAchatService.findDemandesRefuseesEtCloturees();
        return new ResponseEntity<>(demandes, HttpStatus.OK);
    }

    @GetMapping("/{first_name}")
    public  List<DemandeAchat> trouverDemandeParId(@PathVariable String first_name) {
        return demandeAchatService.trouverDemandeParIdEtStatut(first_name);
    }

    @GetMapping("/{userId}/{produitName}")
    public DemandeAchat findByProduitName(@PathVariable Integer userId, @PathVariable String produitName) {
        return demandeAchatService.findByProduitName(userId, produitName);
    }

    @GetMapping("/acceptees-ou-en-cours")
    public ResponseEntity<List<DemandeAchat>> getDemandesAccepteesOuEnCours() {
        List<DemandeAchat> demandes = demandeAchatRepository.findDemandesAccepteesOuDevisEnCours();
        return new ResponseEntity<>(demandes, HttpStatus.OK);
    }
}