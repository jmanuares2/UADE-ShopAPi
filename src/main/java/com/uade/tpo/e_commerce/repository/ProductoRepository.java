package com.uade.tpo.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.uade.tpo.e_commerce.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByNombreContaining(String nombre);
    List<Producto> findByNombreContainingIgnoreCaseOrderByNombreAsc(String nombre);
    List<Producto> findAllByOrderByNombreAsc();

    @Query("SELECT p FROM Producto p WHERE p.precio < :precio")
    List<Producto> findByPrecioLessThan(Double precio);

    @Query("SELECT p FROM Producto p WHERE p.precio BETWEEN :precioMin AND :precioMax ORDER BY p.precio ASC")
    List<Producto> findByPrecioBetween(Double precioMin, Double precioMax);

    List<Producto> findByCategoriaId(Long categoriaId);

    List<Producto> findByCreadorIdOrderByNombreAsc(Long creadorId);
}
