package com.uade.tpo.e_commerce3.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoriaDto {
    private Long id;
    private String nombre;
}
