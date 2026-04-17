package com.uade.tpo.e_commerce3.dto;

import com.uade.tpo.e_commerce3.model.Role;

import lombok.Data;

@Data
public class UsuarioRequestDto {
    private String nombreUsuario;
    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private Role role;
}
