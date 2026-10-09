package com.example.AppGestionAchat.DTO;

import com.example.AppGestionAchat.Entity.DemandeAchat;
import com.example.AppGestionAchat.Entity.Fournisseur;
import lombok.Data;

import java.util.List;

@Data
public class DemandesFournisseursDTO {
    private List<DemandeAchat> demandes;
    private List<Fournisseur> fournisseurs;
}
