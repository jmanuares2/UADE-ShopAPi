package com.uade.tpo.e_commerce3.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductoResponseDto {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private List<CategoriaDto> categorias;
    private List<String> imagenes;
}
