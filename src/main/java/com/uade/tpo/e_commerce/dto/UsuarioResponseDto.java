package com.uade.tpo.e_commerce.dto;

import java.time.LocalDateTime;

import com.uade.tpo.e_commerce.model.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponseDto {

    private Long id;
    private String nombreUsuario;
    private String nombre;
    private String apellido;
    private String email;
    private Role role;
    private boolean activo;
    private LocalDateTime fechaBaja;
}
