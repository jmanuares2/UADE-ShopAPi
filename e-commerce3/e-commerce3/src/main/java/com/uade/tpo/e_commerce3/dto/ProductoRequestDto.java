package com.uade.tpo.e_commerce3.dto;

import java.util.List;
import lombok.Data;

@Data
public class ProductoRequestDto {
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private List<Long> categoriaIds;
    private List<String> imagenes;
}
