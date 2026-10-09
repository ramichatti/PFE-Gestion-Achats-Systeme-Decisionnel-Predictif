package com.example.AppGestionAchat.Controller;

import com.example.AppGestionAchat.Entity.LigneCommande;
import com.example.AppGestionAchat.Service.LigneCommandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ligne_commande")
@CrossOrigin(origins = "http://localhost:4200")
public class LigneCommandeController {
    @Autowired
    private LigneCommandeService ligneCommandeService;

    @GetMapping("/{commandeId}")
    public List<LigneCommande> getLignesCommandeByCommandeId(@PathVariable Integer commandeId) {
        return ligneCommandeService.findAllByCommandeId(commandeId);
    }
}
