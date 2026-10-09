package com.example.AppGestionAchat.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="utilisateur") // Changer "user" à "utilisateur" pour éviter les conflits avec les mots réservés SQL
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id") // Définir le nom de la colonne
    private Integer userId; // Changer le nom de la variable pour respecter les conventions Java

    private String first_name;

    private String last_name;

    private String password;

    @Column(unique = true)
    private String email;

    private String dept;

    private Integer contact;

    private String role;

    private String adresse;

    private boolean Bloquer;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;

    @OneToOne
    @JoinColumn(name = "fournisseur_id", referencedColumnName = "id_fournisseur") // Mapping de la colonne fournisseur_id avec l'ID du fournisseur
    private Fournisseur fournisseur; // Ajout de la référence au fournisseur


}