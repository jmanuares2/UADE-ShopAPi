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

    public CategoriaDto saveCategoria(CategoriaDto dto) {
        Categoria cat = Categoria.builder()
                .nombre(dto.getNombre())
                .build();
        Categoria saved = categoriaRepository.save(cat);
        return mapToDto(saved);
    }

    public void deleteCategoriaById(Long id) {
        categoriaRepository.deleteById(id);
    }

    private CategoriaDto mapToDto(Categoria c) {
        return CategoriaDto.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .build();
    }
}
