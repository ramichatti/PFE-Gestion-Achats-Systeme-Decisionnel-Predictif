package com.example.AppGestionAchat.Service;

import com.example.AppGestionAchat.Entity.InformationSociete;
import com.example.AppGestionAchat.Repository.InformationSocieteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;



@Service
public class InformationSocieteService {

    @Autowired
    private InformationSocieteRepository informationSocieteRepository;

    public List<InformationSociete> GetAllInformationSociete() {
        return informationSocieteRepository.findAll();
    }

    public InformationSociete updateInformationSociete(Integer id, InformationSociete updatedInfo) {
        Optional<InformationSociete> existingInfoOptional = informationSocieteRepository.findById(id);
        if (existingInfoOptional.isPresent()) {
            InformationSociete existingInfo = existingInfoOptional.get();
            // Mettre à jour les champs nécessaires
            existingInfo.setNom(updatedInfo.getNom());
            existingInfo.setAdresse(updatedInfo.getAdresse());
            existingInfo.setTel(updatedInfo.getTel());
            existingInfo.setEmail(updatedInfo.getEmail());
            existingInfo.setMatricule_fiscale(updatedInfo.getMatricule_fiscale());
            existingInfo.setBio(updatedInfo.getBio());



            // Enregistrer les modifications
            return informationSocieteRepository.save(existingInfo);
        } else {
            throw new EntityNotFoundException("L'InformationSociete avec l'ID spécifié n'existe pas : " + id);
        }
    }

    public byte[] getImageDataById(Integer id) {
        Optional<InformationSociete> imageEntityOptional = informationSocieteRepository.findById(id);
        return imageEntityOptional.map(InformationSociete::getImage).orElse(null);
    }

}
