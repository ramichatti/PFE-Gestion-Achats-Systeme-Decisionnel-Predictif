package com.example.AppGestionAchat.Controller;

import com.example.AppGestionAchat.DTO.DemandesFournisseursDTO;
import com.example.AppGestionAchat.Service.DemandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/devis")
@CrossOrigin(origins = "http://localhost:4200")
public class DemandeController {
    @Autowired
    private DemandeService demandeService;

    @PostMapping("/envoyer")
    public void envoyerDemande(@RequestBody DemandesFournisseursDTO demandesFournisseursDTO) {
        demandeService.envoyerDemande(demandesFournisseursDTO.getDemandes(), demandesFournisseursDTO.getFournisseurs());
    }

}
