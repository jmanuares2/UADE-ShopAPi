package com.uade.tpo.e_commerce3.exception;

public class UsuarioNotFoundException extends RuntimeException {

    public UsuarioNotFoundException(Long id) {
        super("Usuario no encontrado con id: " + id);
    }

    public UsuarioNotFoundException(String message) {
        super(message);
    }
}
