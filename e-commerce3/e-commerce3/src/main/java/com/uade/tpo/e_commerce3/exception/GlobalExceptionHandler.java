package com.uade.tpo.e_commerce3.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//TODO: ssanchez - es buena práctica crear excepciones personalizadas para cada error específico, y manejarlas en un controlador de excepciones global con @ControllerAdvice, para centralizar el manejo de errores y evitar repetir código en cada controlador. Por ejemplo, se podría crear una excepción ProductoNotFoundException para manejar el caso cuando no se encuentra un producto, y otra excepción PrecioNegativoException para manejar el caso cuando se intenta guardar un producto con precio negativo. Luego, en el controlador de excepciones global, se podrían manejar estas excepciones y devolver una respuesta adecuada al cliente, como un código de estado HTTP 404 (Not Found) para ProductoNotFoundException, o un código de estado HTTP 400 (Bad Request) para PrecioNegativoException.
// Anotación que indica que esta clase manejará excepciones de forma global para todos los controladores.
@ControllerAdvice
public class GlobalExceptionHandler {

    // Anotación que indica que este método manejará las excepciones de tipo ProductoNotFoundException.
    @ExceptionHandler(ProductoNotFoundException.class)
    // Este método se ejecuta cuando se lanza una ProductoNotFoundException.
    public ResponseEntity<String> manejarProductoNoEncontrado(ProductoNotFoundException ex) {

        // Devuelve una respuesta con el código de estado HTTP 404 (Not Found) y un cuerpo con el mensaje "Producto no encontrado :)"
        //representa la respuesta HTTP completa que se envía desde tu controlador al cliente (navegador, aplicación móvil, etc.).
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        //not_found es el código de error
        //body va el json con el mensaje de error
        
    }

    @ExceptionHandler(OutOfStockException.class)
    public ResponseEntity<String> manejarSinStock(OutOfStockException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(PrecioNegativoException.class)
    public ResponseEntity<String> manejarPrecioNegativo(PrecioNegativoException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> manejarArgumentoInvalido(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> manejarErroresGenerales(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno: " + ex.getMessage());
    }
}
