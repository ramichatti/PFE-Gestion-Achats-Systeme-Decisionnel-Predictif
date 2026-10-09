package com.example.AppGestionAchat.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "devis")
public class Devis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "devis_id")
    private Integer idDevis;

    @Column(name = "prix", nullable = false)
    private float prix;

    @Column(name = "totalTva", nullable = false)
    private float totalTva;

    @Column(name = "totalHt", nullable = false)
    private float totalHt;

    private String status;

    @Column(name = "devis_date") // Renommez le champ en "devis_date"
    @Temporal(TemporalType.DATE)
    private Date devisDate;

    @Column(name = "devis_livraison") // Renommez le champ en "devis_date"
    @Temporal(TemporalType.DATE)
    private Date livraison;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;


}
