package com.example.AppGestionAchat.Controller;

import com.example.AppGestionAchat.Service.MotDePasseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/password")
@CrossOrigin(origins = "http://localhost:4200")
public class MotDePasseController {
    @Autowired
    private MotDePasseService motDePasseService;

    @PostMapping("/reinitialiserMotDePasse")
    public ResponseEntity<Object> reinitialiserMotDePasse(@RequestParam("email") String email) {
       if (motDePasseService.reinitialiserMotDePasse(email)) {
            String message = "Le mot de passe a été réinitialisé avec succès. Veuillez vérifier votre boîte de réception pour le nouveau mot de passe.";
            return ResponseEntity.status(HttpStatus.OK).body("{\"status\": \"success\", \"message\": \"" + message + "\"}");
        }
       else {
           String errorMessage = "Adresse e-mail invalide.";
           return ResponseEntity.badRequest().body("{\"status\": \"error\", \"message\": \"" + errorMessage + "\"}");
       }
    }

}
