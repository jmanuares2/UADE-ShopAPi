package com.uade.tpo.e_commerce3.dto;

import lombok.Data;

@Data
public class CartItemRequestDto {
    private Long productoId;
    private Integer cantidad;
}
