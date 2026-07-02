package com.uade.tpo.e_commerce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.dto.NotificacionCantidadDto;
import com.uade.tpo.e_commerce.dto.NotificacionResponseDto;
import com.uade.tpo.e_commerce.model.Notificacion;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.NotificacionRepository;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Crea la notificación de venta para el vendedor (el dueño del producto).
     * Si el comprador es el mismo vendedor, no se notifica a sí mismo.
     */
    public void crearNotificacionVenta(Producto producto, Usuario comprador, Integer cantidad) {
        Usuario vendedor = producto.getCreador();

        if (vendedor == null || vendedor.getId().equals(comprador.getId())) {
            return;
        }

        String nombreComprador = (comprador.getNombre() != null ? comprador.getNombre() : "")
                + " " + (comprador.getApellido() != null ? comprador.getApellido() : "");
        nombreComprador = nombreComprador.trim();
        if (nombreComprador.isEmpty()) {
            nombreComprador = comprador.getEmail();
        }

        String mensaje = String.format("%s compró %d x \"%s\"", nombreComprador, cantidad, producto.getNombre());

        Notificacion notificacion = Notificacion.builder()
                .usuario(vendedor)
                .mensaje(mensaje)
                .tipo("VENTA")
                .productoId(producto.getId())
                .build();

        notificacionRepository.save(notificacion);
    }

    public List<NotificacionResponseDto> getMisNotificaciones() {
        Usuario usuario = getUsuarioAutenticado();
        return notificacionRepository.findByUsuarioOrderByFechaCreacionDesc(usuario).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public NotificacionCantidadDto getCantidadNoLeidas() {
        Usuario usuario = getUsuarioAutenticado();
        long cantidad = notificacionRepository.countByUsuarioAndLeidaFalse(usuario);
        return NotificacionCantidadDto.builder().cantidad(cantidad).build();
    }

    public void marcarComoLeida(Long id) {
        Usuario usuario = getUsuarioAutenticado();
        Notificacion notificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notificación no encontrada con id: " + id));

        if (!notificacion.getUsuario().getId().equals(usuario.getId())) {
            throw new IllegalArgumentException("No tenés permiso para modificar esta notificación");
        }

        notificacion.setLeida(true);
        notificacionRepository.save(notificacion);
    }

    public void marcarTodasComoLeidas() {
        Usuario usuario = getUsuarioAutenticado();
        notificacionRepository.marcarTodasComoLeidas(usuario);
    }

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    }

    private NotificacionResponseDto toResponseDto(Notificacion n) {
        return NotificacionResponseDto.builder()
                .id(n.getId())
                .mensaje(n.getMensaje())
                .tipo(n.getTipo())
                .productoId(n.getProductoId())
                .leida(n.isLeida())
                .fechaCreacion(n.getFechaCreacion())
                .build();
    }
}