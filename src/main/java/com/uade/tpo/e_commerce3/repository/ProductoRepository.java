package com.uade.tpo.e_commerce3.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.uade.tpo.e_commerce3.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByNombreContaining(String nombre);
    List<Producto> findAllByOrderByNombreAsc();

    @Query("SELECT p FROM Producto p WHERE p.precio < :precio")
    List<Producto> findByPrecioLessThan(Double precio);

    List<Producto> findByCategoriaId(Long categoriaId);
}
