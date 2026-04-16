package com.uade.tpo.e_commerce3.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.CategoriaDto;
import com.uade.tpo.e_commerce3.model.Categoria;
import com.uade.tpo.e_commerce3.repository.CategoriaRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<CategoriaDto> getAllCategorias() {
        return categoriaRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CategoriaDto getCategoriaById(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + id));

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
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + id));

        categoria.setNombre(dto.getNombre());

        Categoria updated = categoriaRepository.save(categoria);
        return mapToDto(updated);
    }

    public void deleteCategoriaById(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada con id: " + id);
        }

        categoriaRepository.deleteById(id);
    }

    private void validarCategoria(CategoriaDto dto) {
        if (dto.getNombre() == null || dto.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre de la categoría es obligatorio");
        }
    }

    private CategoriaDto mapToDto(Categoria c) {
        return CategoriaDto.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .build();
    }
}
