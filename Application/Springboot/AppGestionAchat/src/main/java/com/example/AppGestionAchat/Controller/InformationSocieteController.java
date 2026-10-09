package com.example.AppGestionAchat.Controller;

import com.example.AppGestionAchat.Entity.InformationSociete;
import com.example.AppGestionAchat.Entity.User;
import com.example.AppGestionAchat.Repository.InformationSocieteRepository;
import com.example.AppGestionAchat.Service.InformationSocieteService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/societe")
@CrossOrigin(origins = "http://localhost:4200")
public class InformationSocieteController {

    @Autowired
    private InformationSocieteService informationSocieteService;

    @Autowired
    private InformationSocieteRepository InformationSocieteRepository;

    @GetMapping("/getAllInformationSociete")
    public List<InformationSociete> getAllInformationSociete() {
        return informationSocieteService.GetAllInformationSociete();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateEntity(@PathVariable Integer id,
                                               @RequestParam("nom") String nom,
                                               @RequestParam("adresse") String adresse,
                                               @RequestParam("tel") String tel,
                                               @RequestParam("email") String email,
                                               @RequestParam("matricule_fiscale") String matricule_fiscale,
                                               @RequestParam("bio") String bio,
                                               @RequestParam(value = "image", required = false) MultipartFile image) throws IOException{

            InformationSociete entity = InformationSocieteRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Entity not found with id: " + id));
            entity.setNom(nom);
            entity.setAdresse(adresse);
            entity.setTel(tel);
            entity.setEmail(email);
            entity.setMatricule_fiscale(matricule_fiscale);
            entity.setBio(bio);
            if (image != null) {
                entity.setImage(image);
            }

            InformationSocieteRepository.save(entity);
            return ResponseEntity.status(HttpStatus.OK).body("{\"message\": \"Entity updated successfully.\"}");
    }

    @GetMapping("/viewImage/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Integer id) {
        byte[] imageData = informationSocieteService.getImageDataById(id);
        if (imageData != null) {
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageData);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
