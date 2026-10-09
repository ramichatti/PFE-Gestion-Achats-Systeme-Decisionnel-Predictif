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
@Table(name="demande_achat")
public class DemandeAchat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "demande_id") // Définir le nom de la colonne
    private Integer demandeId; // Changer le nom de la variable pour respecter les conventions Java

    private String nom;

    private String prenom;

    private String dept;

    private String produitName;

    @Temporal(TemporalType.DATE)
    private Date date;

    private Integer qte;

    private String statut;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "produit_id", nullable = true)
    private Produit produit;

}