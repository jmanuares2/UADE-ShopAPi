package com.uade.tpo.e_commerce.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce.dto.ResenaRequestDto;
import com.uade.tpo.e_commerce.dto.ResenaResponseDto;
import com.uade.tpo.e_commerce.dto.ResenaResumenDto;
import com.uade.tpo.e_commerce.service.ResenaService;

@RestController
@RequestMapping("/api/resenas")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    // Público: cualquiera puede ver las reseñas de un producto.
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<ResenaResponseDto>> getResenasByProducto(@PathVariable Long productoId) {
        return new ResponseEntity<>(resenaService.getResenasByProducto(productoId), HttpStatus.OK);
    }

    // Público: promedio de estrellas y cantidad de reseñas de un producto.
    @GetMapping("/producto/{productoId}/resumen")
    public ResponseEntity<ResenaResumenDto> getResumenByProducto(@PathVariable Long productoId) {
        return new ResponseEntity<>(resenaService.getResumenByProducto(productoId), HttpStatus.OK);
    }

    // Protegido: crea o actualiza (upsert) la reseña del usuario logueado para ese producto.
    @PostMapping("/{productoId}")
    public ResponseEntity<ResenaResponseDto> guardarResena(Principal principal, @PathVariable Long productoId,
            @RequestBody ResenaRequestDto dto) {
        String email = principal.getName();
        ResenaResponseDto resena = resenaService.guardarResena(email, productoId, dto);
        return new ResponseEntity<>(resena, HttpStatus.OK);
    }

    // Protegido: el dueño de la reseña o un ADMIN pueden eliminarla.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarResena(Principal principal, @PathVariable Long id) {
        String email = principal.getName();
        resenaService.eliminarResena(email, id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}