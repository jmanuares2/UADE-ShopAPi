package com.uade.tpo.e_commerce.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.dto.PreguntaRequestDto;
import com.uade.tpo.e_commerce.dto.PreguntaResponseDto;
import com.uade.tpo.e_commerce.dto.RespuestaRequestDto;
import com.uade.tpo.e_commerce.exception.ForbiddenOperationException;
import com.uade.tpo.e_commerce.exception.ProductoNotFoundException;
import com.uade.tpo.e_commerce.model.Pregunta;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Role;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.PreguntaRepository;
import com.uade.tpo.e_commerce.repository.ProductoRepository;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PreguntaService {

    @Autowired
    private PreguntaRepository preguntaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private NotificacionService notificacionService;

    public List<PreguntaResponseDto> getPreguntasByProducto(Long productoId) {
        return preguntaRepository.findByProductoIdOrderByFechaPreguntaDesc(productoId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public PreguntaResponseDto crearPregunta(String email, Long productoId, PreguntaRequestDto dto) {
        if (dto.getTexto() == null || dto.getTexto().isBlank()) {
            throw new IllegalArgumentException("La pregunta no puede estar vacía");
        }

        Usuario usuario = getUsuarioPorEmail(email);
        Producto producto = getProductoPorId(productoId);

        Pregunta pregunta = Pregunta.builder()
                .producto(producto)
                .usuario(usuario)
                .texto(dto.getTexto().trim())
                .build();

        Pregunta guardada = preguntaRepository.save(pregunta);

        // Le avisamos al vendedor que tiene una pregunta nueva. No debe romper la creación de la pregunta si falla.
        try {
            notificacionService.crearNotificacionPregunta(producto, usuario, guardada.getTexto());
        } catch (Exception e) {
            System.err.println("No se pudo crear la notificación de pregunta: " + e.getMessage());
        }

        return toResponseDto(guardada);
    }

    public PreguntaResponseDto responderPregunta(String email, Long preguntaId, RespuestaRequestDto dto) {
        if (dto.getRespuesta() == null || dto.getRespuesta().isBlank()) {
            throw new IllegalArgumentException("La respuesta no puede estar vacía");
        }

        Usuario usuario = getUsuarioPorEmail(email);
        Pregunta pregunta = preguntaRepository.findById(preguntaId)
                .orElseThrow(() -> new IllegalArgumentException("Pregunta no encontrada con id: " + preguntaId));

        boolean esDueno = pregunta.getProducto().getCreador().getId().equals(usuario.getId());
        boolean esAdmin = usuario.getRole() == Role.ADMIN;

        if (!esDueno && !esAdmin) {
            throw new ForbiddenOperationException("Sólo el vendedor dueño del producto puede responder esta pregunta");
        }

        pregunta.setRespuesta(dto.getRespuesta().trim());
        pregunta.setFechaRespuesta(LocalDateTime.now());
        Pregunta guardada = preguntaRepository.save(pregunta);

        // Le avisamos al comprador que ya le respondieron.
        try {
            notificacionService.crearNotificacionRespuesta(guardada);
        } catch (Exception e) {
            System.err.println("No se pudo crear la notificación de respuesta: " + e.getMessage());
        }

        return toResponseDto(guardada);
    }

    public void eliminarPregunta(String email, Long preguntaId) {
        Usuario usuario = getUsuarioPorEmail(email);
        Pregunta pregunta = preguntaRepository.findById(preguntaId)
                .orElseThrow(() -> new IllegalArgumentException("Pregunta no encontrada con id: " + preguntaId));

        boolean esAutor = pregunta.getUsuario().getId().equals(usuario.getId());
        boolean esAdmin = usuario.getRole() == Role.ADMIN;

        if (!esAutor && !esAdmin) {
            throw new ForbiddenOperationException("No tenés permiso para eliminar esta pregunta");
        }

        preguntaRepository.delete(pregunta);
    }

    private PreguntaResponseDto toResponseDto(Pregunta p) {
        return PreguntaResponseDto.builder()
                .id(p.getId())
                .productoId(p.getProducto().getId())
                .usuarioId(p.getUsuario().getId())
                .usuarioNombre(p.getUsuario().getNombre() + " " + p.getUsuario().getApellido())
                .texto(p.getTexto())
                .respuesta(p.getRespuesta())
                .respondida(p.getRespuesta() != null && !p.getRespuesta().isBlank())
                .fechaPregunta(p.getFechaPregunta())
                .fechaRespuesta(p.getFechaRespuesta())
                .build();
    }

    private Usuario getUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con email: " + email));
    }

    private Producto getProductoPorId(Long productoId) {
        return productoRepository.findById(productoId)
                .orElseThrow(() -> new ProductoNotFoundException(productoId));
    }
}