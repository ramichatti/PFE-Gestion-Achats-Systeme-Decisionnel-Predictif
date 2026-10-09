package com.example.AppGestionAchat.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="informationSociete")
public class InformationSociete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // Définir le nom de la colonne
    private Integer Id;

    private String nom;

    private String adresse;

    private String tel;

    private String email;

    private String matricule_fiscale;

    private String bio;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;

    public void setImage(MultipartFile file) throws IOException {
        this.image = file.getBytes();
    }


}
