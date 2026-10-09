package com.example.AppGestionAchat.Repository;

import com.example.AppGestionAchat.Entity.DemandeDevis;
import com.example.AppGestionAchat.Entity.Devis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandeDevisRepository extends JpaRepository<DemandeDevis, Integer> {

    @Query("SELECT dd FROM DemandeDevis dd WHERE dd.devis.id = :devisId")
    List<DemandeDevis> findAllByDevisId(@Param("devisId") Integer devisId);

    List<DemandeDevis> findByDevisIdDevis(Integer idDevis);
}