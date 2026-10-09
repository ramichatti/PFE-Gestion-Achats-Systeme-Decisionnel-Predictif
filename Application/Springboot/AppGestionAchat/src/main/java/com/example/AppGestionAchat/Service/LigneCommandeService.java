package com.example.AppGestionAchat.Service;

import com.example.AppGestionAchat.Entity.LigneCommande;
import com.example.AppGestionAchat.Repository.LigneCommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LigneCommandeService {
    @Autowired
    private LigneCommandeRepository ligneCommandeRepository;

    public List<LigneCommande> findAllByCommandeId(Integer commandeId) {
        return ligneCommandeRepository.findAllByCommandeId(commandeId);
    }
}
