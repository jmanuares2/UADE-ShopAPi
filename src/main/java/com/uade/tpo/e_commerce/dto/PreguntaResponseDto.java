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
public class PreguntaResponseDto {

    private Long id;
    private Long productoId;
    private Long usuarioId;
    private String usuarioNombre;
    private String texto;
    private String respuesta;
    private boolean respondida;
    private LocalDateTime fechaPregunta;
    private LocalDateTime fechaRespuesta;
}