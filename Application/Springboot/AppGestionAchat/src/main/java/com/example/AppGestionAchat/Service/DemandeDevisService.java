package com.example.AppGestionAchat.Service;

import com.example.AppGestionAchat.Entity.DemandeDevis;
import com.example.AppGestionAchat.Repository.DemandeDevisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemandeDevisService {

    private final DemandeDevisRepository demandeDevisRepository;

    @Autowired
    public DemandeDevisService(DemandeDevisRepository demandeDevisRepository) {
        this.demandeDevisRepository = demandeDevisRepository;
    }

    public List<DemandeDevis> findAllByDevisId(Integer devisId) {
        return demandeDevisRepository.findAllByDevisId(devisId);
    }
}
