package com.example.AppGestionAchat.Controller;

import com.example.AppGestionAchat.DTO.DevisUpdateDTO;
import com.example.AppGestionAchat.Entity.DemandeAchat;
import com.example.AppGestionAchat.Entity.DemandeDevis;
import com.example.AppGestionAchat.Entity.Devis;
import com.example.AppGestionAchat.Service.DevisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/demande_devis")
@CrossOrigin(origins = "http://localhost:4200")
public class DevisController {

    @Autowired
    private DevisService devisService;

    @GetMapping("/en_cours/{userId}")
    public List<Devis> getAllDevisEnCoursByUserId(@PathVariable Integer userId) {
        return devisService.findAllDevisEnCoursByUserId(userId);
    }


    @GetMapping("/accepté/{userId}")
    public List<Devis> findAllDevisEnAccepteByUserId(@PathVariable Integer userId) {
        return devisService.findAllDevisEnAccepteByUserId(userId);
    }

    @PutMapping("/devis/{devisId}")
    public ResponseEntity<Devis> updateDevisAndDemandeDevis(@PathVariable Integer devisId,
                                                            @RequestBody DevisUpdateDTO devisUpdateDTO) {
        Devis updated = devisService.updateDevisAndDemandeDevis(devisId, devisUpdateDTO.getUpdatedDevis(), devisUpdateDTO.getUpdatedDemandeDevis());
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/cree")
    public List<Devis> getAllDevisCree() {
        return devisService.findAllDevisCree();
    }

    @PostMapping("/archive")
    public ResponseEntity<String> archiverDevis(@RequestBody List<Devis> devisList) {
        try {
            devisService.passerEnArchive(devisList);
            return new ResponseEntity<>("Devis archivés avec succès", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Une erreur s'est produite lors de l'archivage des devis", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/archive-or-cloture")
    public List<Devis> getDevisByStatusArchiveOrCloture() {
        return devisService.getDevisByStatusArchiveOrCloture();
    }

    @GetMapping("/{nom}")
    public List<Devis> trouverDvisParId(@PathVariable String nom) {
        return devisService.trouverDevisParIdEtStatut(nom);
    }

    @GetMapping("/users/{userId}/devis/{devisId}")
    public ResponseEntity<?> getDevisByUserIdAndDevisId(@PathVariable Integer userId, @PathVariable Integer devisId) {
        Devis devis = devisService.findDevisByFournisseurIdAndId(userId, devisId);
        if (devis != null) {
            return ResponseEntity.ok(devis);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/devis/{nom}")
    public ResponseEntity<List<Devis>> getDevisByNomAndStatut(@PathVariable String nom) {
        List<Devis> devis = devisService.findBynomAndStatut(nom);
        if (!devis.isEmpty()) {
            return ResponseEntity.ok(devis);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
