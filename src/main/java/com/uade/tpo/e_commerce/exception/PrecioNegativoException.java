package com.uade.tpo.e_commerce.exception;

public class PrecioNegativoException extends IllegalArgumentException {
    public PrecioNegativoException() {
        super("El precio no puede ser negativo");
    }

    public PrecioNegativoException(String message) {
        super(message);
    }
}
