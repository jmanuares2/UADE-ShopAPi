package com.uade.tpo.e_commerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Resena;
import com.uade.tpo.e_commerce.model.Usuario;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {

    @Query("SELECT r FROM Resena r JOIN FETCH r.usuario WHERE r.producto.id = :productoId ORDER BY r.fechaCreacion DESC")
    List<Resena> findByProductoIdOrderByFechaCreacionDesc(@Param("productoId") Long productoId);

    Optional<Resena> findByUsuarioAndProducto(Usuario usuario, Producto producto);

    @Query("SELECT COALESCE(AVG(r.puntuacion), 0) FROM Resena r WHERE r.producto.id = :productoId")
    Double findPromedioByProductoId(@Param("productoId") Long productoId);

    long countByProductoId(Long productoId);
}