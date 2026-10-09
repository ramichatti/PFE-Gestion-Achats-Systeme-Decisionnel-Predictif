package com.example.AppGestionAchat.Repository;

import com.example.AppGestionAchat.Entity.DemandeAchat;
import com.example.AppGestionAchat.Entity.Devis;
import com.example.AppGestionAchat.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandeRepository extends JpaRepository<DemandeAchat, Integer> {
    List<DemandeAchat> findByUserUserIdAndStatutIn(Integer userId, List<String> statuts);

    @Query("SELECT d FROM DemandeAchat d WHERE d.statut = :statut")
    List<DemandeAchat> findAllByStatut(@Param("statut") String statut);

    @Query("SELECT d FROM DemandeAchat d WHERE d.statut IN (:statuts)")
    List<DemandeAchat> findAllByStatuts(@Param("statuts") List<String> statuts);

    @Query("SELECT d FROM DemandeAchat d WHERE d.user.first_name = :first_name AND (d.statut = 'Refusé' OR d.statut = 'Clôture')")
    List<DemandeAchat> findByIdAndStatut(@Param("first_name") String first_name);
    @Query("SELECT d FROM DemandeAchat d WHERE d.user.userId = :userId AND d.produitName = :produitName")
    DemandeAchat findByProduitName(@Param("userId") Integer userId, @Param("produitName") String produitName);

    @Query("SELECT d FROM DemandeAchat d WHERE d.statut = 'Accepté' OR d.statut = 'Devis en cours'")
    List<DemandeAchat> findDemandesAccepteesOuDevisEnCours();
}
