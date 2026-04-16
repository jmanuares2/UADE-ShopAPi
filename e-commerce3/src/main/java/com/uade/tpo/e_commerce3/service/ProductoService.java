package com.uade.tpo.e_commerce3.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.ProductoRequestDto;
import com.uade.tpo.e_commerce3.dto.ProductoResponseDto;
import com.uade.tpo.e_commerce3.exception.ForbiddenOperationException;
import com.uade.tpo.e_commerce3.exception.PrecioNegativoException;
import com.uade.tpo.e_commerce3.exception.ProductoNotFoundException;
import com.uade.tpo.e_commerce3.model.Categoria;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.Role;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.CategoriaRepository;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<ProductoResponseDto> getAllProductos() {
        return productoRepository.findAllByOrderByNombreAsc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProductoResponseDto getProductoById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado con id: " + id));
        return mapToDto(producto);
    }

    public void deleteProductoById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado con id: " + id));

        Usuario usuarioAutenticado = obtenerUsuarioAutenticado();
        validarPermisoSobreProducto(producto, usuarioAutenticado);

        productoRepository.deleteById(id);
    }

    public ProductoResponseDto saveProducto(ProductoRequestDto dto) {
        validarProducto(dto);

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada con id: " + dto.getCategoriaId()));

        Usuario creador = obtenerUsuarioAutenticado();

        Producto producto = Producto.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .precio(dto.getPrecio())
                .stock(dto.getStock())
                .imagenUrl(dto.getImagenUrl())
                .talle(dto.getTalle())
                .color(dto.getColor())
                .categoria(categoria)
                .creador(creador)
                .build();

        Producto guardado = productoRepository.save(producto);
        return mapToDto(guardado);
    }

    public ProductoResponseDto updateProducto(Long id, ProductoRequestDto dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado con id: " + id));

        Usuario usuarioAutenticado = obtenerUsuarioAutenticado();
        validarPermisoSobreProducto(producto, usuarioAutenticado);

        validarProducto(dto);

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada con id: " + dto.getCategoriaId()));

        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setImagenUrl(dto.getImagenUrl());
        producto.setTalle(dto.getTalle());
        producto.setColor(dto.getColor());
        producto.setCategoria(categoria);

        return mapToDto(productoRepository.save(producto));
    }

    public List<ProductoResponseDto> getProductosByCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private void validarProducto(ProductoRequestDto dto) {
        if (dto.getNombre() == null || dto.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre del producto es obligatorio");
        }

        if (dto.getDescripcion() == null || dto.getDescripcion().trim().isEmpty()) {
            throw new RuntimeException("La descripcion del producto es obligatoria");
        }

        if (dto.getPrecio() == null || dto.getPrecio() < 0) {
            throw new PrecioNegativoException("El precio no puede ser negativo");
        }

        if (dto.getStock() == null || dto.getStock() < 0) {
            throw new RuntimeException("El stock no puede ser negativo");
        }

        if (dto.getImagenUrl() == null || dto.getImagenUrl().trim().isEmpty()) {
            throw new RuntimeException("La imagen del producto es obligatoria");
        }

        if (dto.getTalle() == null || dto.getTalle().trim().isEmpty()) {
            throw new RuntimeException("El talle del producto es obligatorio");
        }

        if (dto.getColor() == null || dto.getColor().trim().isEmpty()) {
            throw new RuntimeException("El color del producto es obligatorio");
        }

        if (dto.getCategoriaId() == null) {
            throw new RuntimeException("La categoria es obligatoria");
        }
    }

    private Usuario obtenerUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));
    }

    private void validarPermisoSobreProducto(Producto producto, Usuario usuarioAutenticado) {
        boolean esAdmin = usuarioAutenticado.getRole() == Role.ADMIN;
        boolean esCreador = producto.getCreador().getId().equals(usuarioAutenticado.getId());

        if (!esAdmin && !esCreador) {
            throw new ForbiddenOperationException("No tenes permisos para modificar este producto");
        }
    }

    private ProductoResponseDto mapToDto(Producto p) {
        return ProductoResponseDto.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .descripcion(p.getDescripcion())
                .precio(p.getPrecio())
                .stock(p.getStock())
                .imagenUrl(p.getImagenUrl())
                .talle(p.getTalle())
                .color(p.getColor())
                .categoriaId(p.getCategoria().getId())
                .categoriaNombre(p.getCategoria().getNombre())
                .creadorId(p.getCreador().getId())
                .creadorNombre(p.getCreador().getNombre() + " " + p.getCreador().getApellido())
                .build();
    }
}
