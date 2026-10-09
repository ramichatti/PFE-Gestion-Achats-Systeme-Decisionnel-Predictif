package com.example.AppGestionAchat.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="demande_devis")
public class DemandeDevis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "quantite")
    private Integer quantite;

    @Column(name = "Prix_unitaire", nullable = false)
    private float Prix_unitaire;

    @Column(name = "Remise", nullable = false)
    private float Remise;

    @Column(name = "TVA", nullable = false)
    private float TVA;

    @Column(name = "TTC", nullable = false)
    private float TTC;

    @Column(name = "montanttva", nullable = false)
    private float montanttva;

    @Column(name = "montantht", nullable = false)
    private float montantht;

    @Column(name = "produit_name") // Correction de la case
    private String produitName;

    @Column(name = "produit_id") // Correction de la case
    private Integer produit_id;

    private String categorie;
    private String reference;

    // Getters et setters pour la propriété 'categorie'
    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    // Getters et setters pour la propriété 'reference'
    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    @ManyToOne
    @JoinColumn(name = "demande_id")
    private DemandeAchat demandeAchat;

    @ManyToOne
    @JoinColumn(name = "devis_id")
    private Devis devis;



}
