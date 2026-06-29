package com.uade.tpo.e_commerce.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.e_commerce.model.Venta;
import com.uade.tpo.e_commerce.model.Usuario;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByUsuarioOrderByFechaVentaDesc(Usuario usuario);
}