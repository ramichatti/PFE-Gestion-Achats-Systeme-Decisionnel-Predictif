package com.example.AppGestionAchat.Controller;

import com.example.AppGestionAchat.Entity.Fournisseur;
import com.example.AppGestionAchat.Repository.FournisseurRepository;
import com.example.AppGestionAchat.Service.FournisseurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/fournisseur")
@CrossOrigin(origins = "http://localhost:4200")
public class FournisseurController {

    @Autowired
    private FournisseurService fournisseurService;

    @Autowired
    private FournisseurRepository fournisseurRepository;

    @PostMapping("/create")
    public Fournisseur createFournisseur(@RequestBody Fournisseur fournisseur) {
        return fournisseurService.createFournisseur(fournisseur);
    }

    @GetMapping("/getAllFournisseurs")
    public List<Fournisseur> getAllFournisseur() {
        return fournisseurRepository.findAll();
    }

    @GetMapping("/getFournisseursActif")
    public List<Fournisseur> getFournisseurActif() {
        return fournisseurRepository.findAllNonBlockedFournisseurs();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Fournisseur>> findByFamilleFournisseur(@RequestParam("famille") String famille) {
        List<Fournisseur> fournisseurs = fournisseurRepository.findByFamilleFournisseur(famille);
        return ResponseEntity.ok(fournisseurs);
    }

    @DeleteMapping("/deleteFournisseur/{fournisseurId}")
    public ResponseEntity<?> deleteFournisseur(@PathVariable Integer fournisseurId) {
        try {
            fournisseurService.deleteFournisseur(fournisseurId);
            return ResponseEntity.ok().body("Fournisseur deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete Fournisseur");
        }
    }

    @PutMapping("/updateFournisseur")
    public ResponseEntity<Fournisseur> updateFournisseur(@RequestBody Fournisseur fournisseur) {
        fournisseurService.updateFournisseur(fournisseur);
        return new ResponseEntity<>(fournisseur, HttpStatus.OK);
    }




}
