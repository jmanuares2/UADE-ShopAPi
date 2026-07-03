package com.uade.tpo.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.e_commerce.model.Pregunta;

@Repository
public interface PreguntaRepository extends JpaRepository<Pregunta, Long> {

    List<Pregunta> findByProductoIdOrderByFechaPreguntaDesc(Long productoId);
}