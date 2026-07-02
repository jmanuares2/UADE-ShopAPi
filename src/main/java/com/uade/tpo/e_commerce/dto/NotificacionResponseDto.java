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
public class NotificacionResponseDto {

    private Long id;
    private String mensaje;
    private String tipo;
    private Long productoId;
    private boolean leida;
    private LocalDateTime fechaCreacion;
}