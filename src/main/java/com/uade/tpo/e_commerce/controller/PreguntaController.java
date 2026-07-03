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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce.dto.PreguntaRequestDto;
import com.uade.tpo.e_commerce.dto.PreguntaResponseDto;
import com.uade.tpo.e_commerce.dto.RespuestaRequestDto;
import com.uade.tpo.e_commerce.service.PreguntaService;

@RestController
@RequestMapping("/api/preguntas")
public class PreguntaController {

    @Autowired
    private PreguntaService preguntaService;

    // Público: cualquiera puede ver las preguntas y respuestas de un producto.
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<PreguntaResponseDto>> getPreguntasByProducto(@PathVariable Long productoId) {
        return new ResponseEntity<>(preguntaService.getPreguntasByProducto(productoId), HttpStatus.OK);
    }

    // Protegido: cualquier usuario logueado puede preguntar sobre un producto.
    @PostMapping("/{productoId}")
    public ResponseEntity<PreguntaResponseDto> crearPregunta(Principal principal, @PathVariable Long productoId,
            @RequestBody PreguntaRequestDto dto) {
        String email = principal.getName();
        return new ResponseEntity<>(preguntaService.crearPregunta(email, productoId, dto), HttpStatus.CREATED);
    }

    // Protegido: sólo el vendedor dueño del producto (o un ADMIN) puede responder.
    @PutMapping("/{id}/responder")
    public ResponseEntity<PreguntaResponseDto> responderPregunta(Principal principal, @PathVariable Long id,
            @RequestBody RespuestaRequestDto dto) {
        String email = principal.getName();
        return new ResponseEntity<>(preguntaService.responderPregunta(email, id, dto), HttpStatus.OK);
    }

    // Protegido: el autor de la pregunta o un ADMIN pueden eliminarla.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPregunta(Principal principal, @PathVariable Long id) {
        String email = principal.getName();
        preguntaService.eliminarPregunta(email, id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}