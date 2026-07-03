package com.uade.tpo.e_commerce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.dto.NotificacionCantidadDto;
import com.uade.tpo.e_commerce.dto.NotificacionResponseDto;
import com.uade.tpo.e_commerce.model.Notificacion;
import com.uade.tpo.e_commerce.model.Pregunta;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.NotificacionRepository;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class NotificacionService {

    private static final int LARGO_MAX_RESUMEN = 60;

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
        if (esNotificacionASiMismo(vendedor, comprador)) {
            return;
        }

        String mensaje = String.format("%s compró %d x \"%s\"",
                nombreParaMostrar(comprador), cantidad, producto.getNombre());

        guardar(vendedor, mensaje, "VENTA", producto.getId());
    }

    /**
     * Notifica al vendedor (dueño del producto) que le hicieron una pregunta nueva.
     */
    public void crearNotificacionPregunta(Producto producto, Usuario comprador, String textoPregunta) {
        Usuario vendedor = producto.getCreador();
        if (esNotificacionASiMismo(vendedor, comprador)) {
            return;
        }

        String mensaje = String.format("%s te preguntó sobre \"%s\": %s",
                nombreParaMostrar(comprador), producto.getNombre(), resumir(textoPregunta));

        guardar(vendedor, mensaje, "PREGUNTA", producto.getId());
    }

    /**
     * Notifica al usuario que hizo la pregunta que el vendedor ya la respondió.
     */
    public void crearNotificacionRespuesta(Pregunta pregunta) {
        Usuario comprador = pregunta.getUsuario();
        Usuario vendedor = pregunta.getProducto().getCreador();
        if (esNotificacionASiMismo(comprador, vendedor)) {
            return;
        }

        String mensaje = String.format("Te respondieron tu pregunta sobre \"%s\": %s",
                pregunta.getProducto().getNombre(), resumir(pregunta.getRespuesta()));

        guardar(comprador, mensaje, "RESPUESTA", pregunta.getProducto().getId());
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

    private void guardar(Usuario destinatario, String mensaje, String tipo, Long productoId) {
        Notificacion notificacion = Notificacion.builder()
                .usuario(destinatario)
                .mensaje(mensaje)
                .tipo(tipo)
                .productoId(productoId)
                .build();
        notificacionRepository.save(notificacion);
    }

    private boolean esNotificacionASiMismo(Usuario destinatario, Usuario origen) {
        return destinatario == null || origen == null || destinatario.getId().equals(origen.getId());
    }

    private String nombreParaMostrar(Usuario usuario) {
        String nombreCompleto = ((usuario.getNombre() != null ? usuario.getNombre() : "") + " "
                + (usuario.getApellido() != null ? usuario.getApellido() : "")).trim();
        return nombreCompleto.isEmpty() ? usuario.getEmail() : nombreCompleto;
    }

    private String resumir(String texto) {
        if (texto == null) return "";
        return texto.length() > LARGO_MAX_RESUMEN ? texto.substring(0, LARGO_MAX_RESUMEN) + "..." : texto;
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