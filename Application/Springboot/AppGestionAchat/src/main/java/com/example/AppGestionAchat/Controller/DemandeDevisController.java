package com.example.AppGestionAchat.Controller;

import com.example.AppGestionAchat.Entity.DemandeDevis;
import com.example.AppGestionAchat.Service.DemandeDevisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ligne_devis")
@CrossOrigin(origins = "http://localhost:4200")
public class DemandeDevisController {
    private final DemandeDevisService demandeDevisService;

    @Autowired
    public DemandeDevisController(DemandeDevisService demandeDevisService) {
        this.demandeDevisService = demandeDevisService;
    }

    @GetMapping("/devis/{devisId}")
    public List<DemandeDevis> findAllByDevisId(@PathVariable Integer devisId) {
        return demandeDevisService.findAllByDevisId(devisId);
    }
}
