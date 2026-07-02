package com.uade.tpo.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uade.tpo.e_commerce.model.Notificacion;
import com.uade.tpo.e_commerce.model.Usuario;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    List<Notificacion> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario);

    long countByUsuarioAndLeidaFalse(Usuario usuario);

    @Modifying
    @Query("UPDATE Notificacion n SET n.leida = true WHERE n.usuario = :usuario AND n.leida = false")
    void marcarTodasComoLeidas(@Param("usuario") Usuario usuario);
}