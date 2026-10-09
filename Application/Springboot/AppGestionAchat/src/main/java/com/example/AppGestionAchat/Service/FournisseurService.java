package com.example.AppGestionAchat.Service;

import com.example.AppGestionAchat.Entity.Fournisseur;
import com.example.AppGestionAchat.Repository.FournisseurRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FournisseurService {

    @Autowired
    private FournisseurRepository fournisseurRepository;


    public Fournisseur createFournisseur(Fournisseur fournisseur) {
        return fournisseurRepository.save(fournisseur);
    }

    public List<Fournisseur> findByFamilleFournisseur(String familleFournisseur) {
        return fournisseurRepository.findByFamilleFournisseur(familleFournisseur);
    }

    @Transactional
    public void deleteFournisseur(Integer fournisseurId) {
        fournisseurRepository.deleteById(fournisseurId);
    }

    public Optional<Fournisseur> updateFournisseur(Fournisseur fournisseur) {
        return fournisseurRepository.findById(fournisseur.getId_fournisseur())
                .map(existingFournisseur -> {
                    existingFournisseur.setNom(fournisseur.getNom());
                    existingFournisseur.setPrenom(fournisseur.getPrenom());
                    existingFournisseur.setCin(fournisseur.getCin());
                    existingFournisseur.setAdresse(fournisseur.getAdresse());
                    existingFournisseur.setTel(fournisseur.getTel());
                    existingFournisseur.setEmail(fournisseur.getEmail());
                    existingFournisseur.setFamille_fournisseur(fournisseur.getFamille_fournisseur());
                    // Vous pouvez mettre à jour d'autres champs si nécessaire

                    return fournisseurRepository.save(existingFournisseur);
                });
    }


}
