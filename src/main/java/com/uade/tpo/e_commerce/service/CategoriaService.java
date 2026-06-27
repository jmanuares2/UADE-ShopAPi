package com.uade.tpo.e_commerce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.dto.CategoriaDto;
import com.uade.tpo.e_commerce.model.Categoria;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.repository.CategoriaRepository;
import com.uade.tpo.e_commerce.repository.ProductoRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<CategoriaDto> getAllCategorias() {
        return categoriaRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CategoriaDto getCategoriaById(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada con id: " + id));

        return mapToDto(categoria);
    }

    public CategoriaDto saveCategoria(CategoriaDto dto) {
        validarCategoria(dto);

        Categoria cat = Categoria.builder()
                .nombre(dto.getNombre())
                .build();

        Categoria saved = categoriaRepository.save(cat);
        return mapToDto(saved);
    }

    public CategoriaDto updateCategoria(Long id, CategoriaDto dto) {
        validarCategoria(dto);

        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada con id: " + id));

        categoria.setNombre(dto.getNombre());

        Categoria updated = categoriaRepository.save(categoria);
        return mapToDto(updated);
    }

    public void deleteCategoriaById(Long id) {
        deleteCategoriaById(id, null);
    }

    public void deleteCategoriaById(Long id, Long reemplazoId) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria no encontrada con id: " + id));

        List<Producto> productosAsociados = productoRepository.findByCategoriaId(id);

        if (!productosAsociados.isEmpty()) {
            if (reemplazoId == null) {
                throw new IllegalArgumentException(
                        "La categoria tiene productos asociados. Debe indicar un reemplazoId.");
            }

            if (id.equals(reemplazoId)) {
                throw new IllegalArgumentException("La categoria de reemplazo debe ser distinta a la eliminada.");
            }

            Categoria reemplazo = categoriaRepository.findById(reemplazoId)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Categoria de reemplazo no encontrada con id: " + reemplazoId));

            productosAsociados.forEach(producto -> producto.setCategoria(reemplazo));
            productoRepository.saveAll(productosAsociados);
        }

        categoriaRepository.delete(categoria);
    }

    private void validarCategoria(CategoriaDto dto) {
        if (dto.getNombre() == null || dto.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre de la categoria es obligatorio");
        }
    }

    private CategoriaDto mapToDto(Categoria c) {
        return CategoriaDto.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .build();
    }
}
