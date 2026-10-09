package com.example.AppGestionAchat.Service;

import com.example.AppGestionAchat.Entity.DemandeAchat;
import com.example.AppGestionAchat.Entity.DemandeDevis;
import com.example.AppGestionAchat.Entity.Devis;
import com.example.AppGestionAchat.Repository.DemandeDevisRepository;
import com.example.AppGestionAchat.Repository.DevisRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLOutput;
import java.util.List;

@Service
public class DevisService {

    @Autowired
    private DevisRepository devisRepository;

    @Autowired
    private DemandeDevisRepository demandeDevisRepository;

    public List<Devis> findAllDevisEnCoursByUserId(Integer userId) {
        return devisRepository.findAllDevisEnCoursByUserId(userId);
    }

    public List<Devis> findAllDevisEnAccepteByUserId(Integer userId) {
        return devisRepository.findAllDevisByUserId(userId);
    }

    public Devis findById(Integer id) {
        return devisRepository.findById(id).orElse(null);
    }

    public Devis save(Devis devis) {
        return devisRepository.save(devis);
    }

    @Transactional
    public Devis updateDevisAndDemandeDevis(Integer devisId, Devis updatedDevis, List<DemandeDevis> updatedDemandeDevis) {
        Devis existingDevis = devisRepository.findById(devisId).orElse(null);
        if (existingDevis != null) {
            existingDevis.setLivraison(updatedDevis.getLivraison());
            existingDevis.setPrix(updatedDevis.getPrix());
            existingDevis.setTotalHt(updatedDevis.getTotalHt());
            existingDevis.setTotalTva(updatedDevis.getTotalTva());

            existingDevis.setStatus("Crée");
            devisRepository.save(existingDevis);

            // Mettre à jour les informations dans DemandeDevis
            for (DemandeDevis demandeDevis : updatedDemandeDevis) {
                DemandeDevis existingDemandeDevis = demandeDevisRepository.findById(demandeDevis.getId()).orElse(null);
                if (existingDemandeDevis != null) {
                    existingDemandeDevis.setPrix_unitaire(demandeDevis.getPrix_unitaire());
                    existingDemandeDevis.setRemise(demandeDevis.getRemise());
                    existingDemandeDevis.setTVA(demandeDevis.getTVA());
                    existingDemandeDevis.setTTC(demandeDevis.getTTC());
                    existingDemandeDevis.setMontantht(demandeDevis.getMontantht());
                    existingDemandeDevis.setMontanttva(demandeDevis.getMontanttva());

                    // Mettre à jour d'autres champs de DemandeDevis si nécessaire
                    demandeDevisRepository.save(existingDemandeDevis);
                }
            }
        }
        return existingDevis;
    }

    public List<Devis> findAllDevisCree() {
        return devisRepository.findByStatusCree();
    }

    @Transactional
    public void passerEnArchive(List<Devis> devisList) {
        for (Devis devis : devisList) {
            devis.setStatus("Archivé");
            devisRepository.save(devis);
        }
    }

    public List<Devis> getDevisByStatusArchiveOrCloture() {
        return devisRepository.findByStatusArchiveOrCloture();
    }

    public List<Devis>  trouverDevisParIdEtStatut(String nom) {
        return devisRepository.findByIdAndStatut(nom);
    }

    public Devis findDevisByFournisseurIdAndId(Integer userId, Integer id) {
        return devisRepository.findByFournisseurIdAndIdEqualTo(userId, id);
    }

    public List<Devis> findBynomAndStatut(String nom) {
        return devisRepository.findBynomAndStatut(nom);
    }
}
