package com.example.AppGestionAchat.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="produit")
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "produit_id") // Définir le nom de la colonne
    private Integer produitId; // Changer le nom de la variable pour respecter les conventions Java

    @Column(unique = true)
    private String nom;

    @Column(unique = true)
    private String reference;

    private String categorie;

    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @OneToMany(mappedBy = "produit", cascade = CascadeType.ALL)
    private Set<DemandeAchat> demandeAchats;

}
