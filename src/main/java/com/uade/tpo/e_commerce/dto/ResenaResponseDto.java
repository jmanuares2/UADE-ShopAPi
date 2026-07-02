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
public class ResenaResponseDto {

    private Long id;
    private Long usuarioId;
    private String usuarioNombre;
    private Long productoId;
    private Integer puntuacion;
    private String comentario;
    private LocalDateTime fechaCreacion;
}