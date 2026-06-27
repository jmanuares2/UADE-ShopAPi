package com.uade.tpo.e_commerce.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ItemCarritoDto {
    private Long id;
    private Long productoId;
    private String productoNombre;
    private Integer cantidad;
    private Double precioUnitario;
}
