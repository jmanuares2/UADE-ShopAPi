package com.uade.tpo.e_commerce3.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    
    @GetMapping
    public String getAllUsuarios(@RequestParam String param) {
        return new String();
    }

    @GetMapping("/{id}")
    public String getUsuarioById(@PathVariable Long id) {
        return new String();
    }
    
    
}
