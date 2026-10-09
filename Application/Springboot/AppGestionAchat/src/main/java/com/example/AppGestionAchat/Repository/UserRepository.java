package com.example.AppGestionAchat.Repository;

import com.example.AppGestionAchat.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    User findByEmail(String email);
    @Query("SELECT u FROM User u WHERE u.first_name = :firstName")
    List<User> findByFirstName(String firstName);

    @Query("SELECT u.image FROM User u WHERE u.fournisseur.id_fournisseur = ?1")
    byte[] getUserImageByFournisseurId(Integer fournisseurId);

    @Query("SELECT u FROM User u WHERE u.fournisseur.id_fournisseur = ?1")
    User findByFournisseurId(Integer fournisseurId);

}
