package com.example.AppGestionAchat.Entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Table(name = "commande")
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "commande_id")
    private Integer idCommande;

    @Column(name = "prix", nullable = false)
    private float prix;

    @Column(name = "totalTva", nullable = false)
    private float totalTva;

    @Column(name = "totalHt", nullable = false)
    private float totalHt;

    private String status;

    @Column(name = "commande_date")
    @Temporal(TemporalType.DATE)
    private Date commandeDate;

    @Column(name = "livraison_date")
    @Temporal(TemporalType.DATE)
    private Date livraison;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;

    @Column(name = "avis")
    private Integer avis;

    @ManyToOne // Relation ManyToOne vers Devis
    @JoinColumn(name = "devis_id")
    private Devis devis; // Référence vers le devis associé à cette commande

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<LigneCommande> lignesCommande;
}
