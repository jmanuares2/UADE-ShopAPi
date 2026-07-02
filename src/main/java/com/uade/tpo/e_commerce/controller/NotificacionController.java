package com.uade.tpo.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce.dto.NotificacionCantidadDto;
import com.uade.tpo.e_commerce.dto.NotificacionResponseDto;
import com.uade.tpo.e_commerce.service.NotificacionService;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    // Todas las notificaciones del usuario logueado, más recientes primero.
    @GetMapping
    public ResponseEntity<List<NotificacionResponseDto>> getMisNotificaciones() {
        return ResponseEntity.ok(notificacionService.getMisNotificaciones());
    }

    // Cantidad de notificaciones sin leer, para mostrar el badge en la campanita.
    @GetMapping("/no-leidas")
    public ResponseEntity<NotificacionCantidadDto> getCantidadNoLeidas() {
        return ResponseEntity.ok(notificacionService.getCantidadNoLeidas());
    }

    @PutMapping("/{id}/leer")
    public ResponseEntity<Void> marcarComoLeida(@PathVariable Long id) {
        notificacionService.marcarComoLeida(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/leer-todas")
    public ResponseEntity<Void> marcarTodasComoLeidas() {
        notificacionService.marcarTodasComoLeidas();
        return ResponseEntity.noContent().build();
    }
}