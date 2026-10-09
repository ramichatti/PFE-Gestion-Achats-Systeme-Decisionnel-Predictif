package com.example.AppGestionAchat.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="fournisseur")
public class Fournisseur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_fournisseur") // Définir le nom de la colonne
    private Integer id_fournisseur;

    private String nom;

    private String prenom;

    private String adresse;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private Integer cin;

    private Integer tel;

    private String famille_fournisseur ;

}
