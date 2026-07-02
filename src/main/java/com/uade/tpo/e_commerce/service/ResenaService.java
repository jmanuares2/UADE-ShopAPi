package com.uade.tpo.e_commerce.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.e_commerce.dto.ResenaRequestDto;
import com.uade.tpo.e_commerce.dto.ResenaResponseDto;
import com.uade.tpo.e_commerce.dto.ResenaResumenDto;
import com.uade.tpo.e_commerce.exception.ForbiddenOperationException;
import com.uade.tpo.e_commerce.exception.ProductoNotFoundException;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Resena;
import com.uade.tpo.e_commerce.model.Role;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.ProductoRepository;
import com.uade.tpo.e_commerce.repository.ResenaRepository;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

@Service
@Transactional
public class ResenaService {

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<ResenaResponseDto> getResenasByProducto(Long productoId) {
        if (!productoRepository.existsById(productoId)) {
            throw new ProductoNotFoundException(productoId);
        }

        return resenaRepository.findByProductoIdOrderByFechaCreacionDesc(productoId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public ResenaResumenDto getResumenByProducto(Long productoId) {
        Double promedio = resenaRepository.findPromedioByProductoId(productoId);
        if (promedio == null) {
            promedio = 0.0;
        }
        long cantidad = resenaRepository.countByProductoId(productoId);
        return ResenaResumenDto.builder()
                .promedio(Math.round(promedio * 10.0) / 10.0) // redondeo a 1 decimal
                .cantidad(cantidad)
                .build();
    }

    public ResenaResponseDto guardarResena(String email, Long productoId, ResenaRequestDto dto) {
        if (dto.getPuntuacion() == null || dto.getPuntuacion() < 1 || dto.getPuntuacion() > 5) {
            throw new IllegalArgumentException("La puntuación debe ser un valor entre 1 y 5");
        }

        Usuario usuario = getUsuarioPorEmail(email);
        Producto producto = getProductoPorId(productoId);

        // Un usuario tiene una única reseña por producto: si ya existe, la actualiza (upsert).
        Optional<Resena> existente = resenaRepository.findByUsuarioAndProducto(usuario, producto);

        Resena resena = existente.orElseGet(() -> Resena.builder()
                .usuario(usuario)
                .producto(producto)
                .build());

        resena.setPuntuacion(dto.getPuntuacion());
        resena.setComentario(dto.getComentario());

        Resena guardada = resenaRepository.save(resena);
        return toResponseDto(guardada);
    }

    public void eliminarResena(String email, Long resenaId) {
        Usuario usuario = getUsuarioPorEmail(email);
        Resena resena = resenaRepository.findById(resenaId)
                .orElseThrow(() -> new IllegalArgumentException("Reseña no encontrada con id: " + resenaId));

        boolean esDuena = resena.getUsuario().getId().equals(usuario.getId());
        boolean esAdmin = usuario.getRole() == Role.ADMIN;

        if (!esDuena && !esAdmin) {
            throw new ForbiddenOperationException("No tenés permiso para eliminar esta reseña");
        }

        resenaRepository.delete(resena);
    }

    private ResenaResponseDto toResponseDto(Resena resena) {
        return ResenaResponseDto.builder()
                .id(resena.getId())
                .usuarioId(resena.getUsuario().getId())
                .usuarioNombre(resena.getUsuario().getNombre() + " " + resena.getUsuario().getApellido())
                .productoId(resena.getProducto().getId())
                .puntuacion(resena.getPuntuacion())
                .comentario(resena.getComentario())
                .fechaCreacion(resena.getFechaCreacion())
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