package com.example.AppGestionAchat.DTO;

import com.example.AppGestionAchat.Entity.DemandeDevis;
import com.example.AppGestionAchat.Entity.Devis;
import lombok.Data;

import java.util.List;

@Data
public class DevisUpdateDTO {
    private Devis updatedDevis;
    private List<DemandeDevis> updatedDemandeDevis;
}
