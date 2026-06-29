package com.uade.tpo.e_commerce.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VentaDto {
    private Long id;
    private Long productoId;
    private String nombreProducto;
    private String imagenProducto;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
    private LocalDateTime fechaVenta;
}