package com.example.AppGestionAchat.Entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ligne_commande")
public class LigneCommande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "ligne_commande_sequence", sequenceName = "ligne_commande_sequence", allocationSize = 1)
    @Column(name = "ligne_commande_id")
    private Integer idLigneCommande;

    @Column(name = "quantite", nullable = false)
    private int quantite;

    @Column(name = "prix_unitaire", nullable = false)
    private float prixUnitaire;

    private float remise;

    private float TVA;

    private float TTC;

    @Column(name = "montant_tva")
    private float montantTVA;

    @Column(name = "montant_ht")
    private float montantHT;

    @Column(name = "produit_name")
    private String produitName;

    @Column(name = "produit_id") // Correction de la case
    private Integer produit_id;

    private String categorie;

    private String reference;


    @ManyToOne
    @JoinColumn(name = "commande_id")
    @JsonBackReference
    private Commande commande;

}
