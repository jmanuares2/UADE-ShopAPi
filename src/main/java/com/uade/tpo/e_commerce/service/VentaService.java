package com.uade.tpo.e_commerce.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.dto.VentaDto;
import com.uade.tpo.e_commerce.model.Carrito;
import com.uade.tpo.e_commerce.model.ItemCarrito;
import com.uade.tpo.e_commerce.model.Venta;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.VentaRepository;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public void guardarVentaDesdeCarrito(Usuario usuario, Carrito carrito) {
        for (ItemCarrito itemCarrito : carrito.getItems()) {
            Venta venta = Venta.builder()
                    .usuario(usuario)
                    .producto(itemCarrito.getProducto())
                    .cantidad(itemCarrito.getCantidad())
                    .precioUnitario(itemCarrito.getPrecioUnitario())
                    .fechaVenta(LocalDateTime.now())
                    .build();
            ventaRepository.save(venta);
        }
    }

    public List<VentaDto> getMisCompras() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ventaRepository.findByUsuarioOrderByFechaVentaDesc(usuario).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public void eliminarVenta(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada en el historial"));

        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada en el historial"));

        if (!venta.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("No tienes permiso para eliminar este item");
        }

        ventaRepository.delete(venta);
    }

    public void limpiarHistorial() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Venta> historial = ventaRepository.findByUsuarioOrderByFechaVentaDesc(usuario);
        ventaRepository.deleteAll(historial);
    }

    private VentaDto mapToDto(Venta pv) {
        return VentaDto.builder()
                .id(pv.getId())
                .productoId(pv.getProducto().getId())
                .nombreProducto(pv.getProducto().getNombre())
                .imagenProducto(pv.getProducto().getImagenUrl())
                .cantidad(pv.getCantidad())
                .precioUnitario(pv.getPrecioUnitario())
                .subtotal(pv.getCantidad() * pv.getPrecioUnitario())
                .fechaVenta(pv.getFechaVenta())
                .build();
    }
}