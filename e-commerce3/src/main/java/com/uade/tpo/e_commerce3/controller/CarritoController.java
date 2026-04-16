package com.uade.tpo.e_commerce3.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce3.dto.CarritoResponseDto;
import com.uade.tpo.e_commerce3.dto.CartItemRequestDto;
import com.uade.tpo.e_commerce3.service.CarritoService;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    @GetMapping
    public ResponseEntity<CarritoResponseDto> getMiCarrito(Principal principal) {
        String email = principal.getName();
        return new ResponseEntity<>(carritoService.getCarritoByUsername(email), HttpStatus.OK);
    }

    @PostMapping("/items")
    public ResponseEntity<CarritoResponseDto> agregarItem(Principal principal, @RequestBody CartItemRequestDto dto) {
        String email = principal.getName();
        return new ResponseEntity<>(carritoService.addItemToCarrito(email, dto), HttpStatus.OK);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CarritoResponseDto> removerItem(Principal principal, @PathVariable Long itemId) {
        String email = principal.getName();
        return new ResponseEntity<>(carritoService.removeItemFromCarrito(email, itemId), HttpStatus.OK);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<CarritoResponseDto> vaciarCarrito(Principal principal) {
        String email = principal.getName();
        return new ResponseEntity<>(carritoService.clearCarrito(email), HttpStatus.OK);
    }

    @PostMapping("/checkout")
    public ResponseEntity<String> checkout(Principal principal) {
        String email = principal.getName();
        return new ResponseEntity<>(carritoService.checkout(email), HttpStatus.OK);
    }
}
