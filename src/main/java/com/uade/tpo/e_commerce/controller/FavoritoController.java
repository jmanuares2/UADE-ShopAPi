package com.uade.tpo.e_commerce.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.service.FavoritoService;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    @GetMapping
    public ResponseEntity<List<Producto>> getMisFavoritos(Principal principal) {
        String email = principal.getName();
        List<Producto> favoritos = favoritoService.getFavoritosByUsername(email);
        return new ResponseEntity<>(favoritos, HttpStatus.OK);
    }

    @PostMapping("/{productoId}")
    public ResponseEntity<String> agregarFavorito(Principal principal, @PathVariable Long productoId) {
        String email = principal.getName();
        favoritoService.addFavorito(email, productoId);
        return new ResponseEntity<>("Producto agregado a favoritos", HttpStatus.OK);
    }

    @DeleteMapping("/{productoId}")
    public ResponseEntity<String> removerFavorito(Principal principal, @PathVariable Long productoId) {
        String email = principal.getName();
        favoritoService.removeFavorito(email, productoId);
        return new ResponseEntity<>("Producto eliminado de favoritos", HttpStatus.OK);
    }
}
