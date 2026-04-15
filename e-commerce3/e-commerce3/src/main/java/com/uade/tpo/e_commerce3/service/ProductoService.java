package com.uade.tpo.e_commerce3.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.CategoriaDto;
import com.uade.tpo.e_commerce3.dto.ProductoRequestDto;
import com.uade.tpo.e_commerce3.dto.ProductoResponseDto;
import com.uade.tpo.e_commerce3.exception.PrecioNegativoException;
import com.uade.tpo.e_commerce3.exception.ProductoNotFoundException;
import com.uade.tpo.e_commerce3.model.Categoria;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.repository.CategoriaRepository;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<ProductoResponseDto> getAllProductos() {
        return productoRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProductoResponseDto getProductoById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado con id: " + id));
        return mapToDto(producto);
    }

    public void deleteProductoById(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new ProductoNotFoundException("Producto no encontrado con id: " + id);
        }
        productoRepository.deleteById(id);
    }

    public ProductoResponseDto saveProducto(ProductoRequestDto dto) {
        if (dto.getPrecio() < 0) {
            throw new PrecioNegativoException("El precio no puede ser negativo");
        }

        List<Categoria> categorias = categoriaRepository.findAllById(dto.getCategoriaIds());

        Producto producto = Producto.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .precio(dto.getPrecio())
                .stock(dto.getStock())
                // .imagenes(dto.getImagenes())
                .categorias(categorias)
                .build();

        Producto guardado = productoRepository.save(producto);
        return mapToDto(guardado);
    }

    public ProductoResponseDto updateProducto(Long id, ProductoRequestDto dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado con id: " + id));

        if (dto.getPrecio() < 0) {
            throw new PrecioNegativoException("El precio no puede ser negativo");
        }

        List<Categoria> categorias = categoriaRepository.findAllById(dto.getCategoriaIds());

        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        // producto.setImagenes(dto.getImagenes());
        producto.setCategorias(categorias);

        return mapToDto(productoRepository.save(producto));
    }

    private ProductoResponseDto mapToDto(Producto p) {
        List<CategoriaDto> catDtos = p.getCategorias().stream()
                .map(c -> CategoriaDto.builder().id(c.getId()).nombre(c.getNombre()).build())
                .collect(Collectors.toList());

        return ProductoResponseDto.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .descripcion(p.getDescripcion())
                .precio(p.getPrecio())
                .stock(p.getStock())
                // .imagenes(p.getImagenes())
                .categorias(catDtos)
                .build();
    }
}
