package com.uade.tpo.e_commerce.dto;

import lombok.Data;

@Data
public class PerfilRequestDto {
    private String nombre;
    private String apellido;
    private String email;
    private String passwordActual;
    private String passwordNueva;
}
