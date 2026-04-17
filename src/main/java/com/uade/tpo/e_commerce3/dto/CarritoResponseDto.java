package com.uade.tpo.e_commerce3.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CarritoResponseDto {
    private Long id;
    private Long usuarioId;
    private List<ItemCarritoDto> items;
    private Double montoTotal;
}
