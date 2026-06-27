package com.uade.tpo.e_commerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce.dto.PerfilRequestDto;
import com.uade.tpo.e_commerce.dto.UsuarioResponseDto;
import com.uade.tpo.e_commerce.service.PerfilService;

@RestController
@RequestMapping("/api/perfil")
public class PerfilController {

    @Autowired
    private PerfilService perfilService;

    @PutMapping
    public ResponseEntity<UsuarioResponseDto> actualizarPerfil(@RequestBody PerfilRequestDto dto) {
        return new ResponseEntity<>(perfilService.actualizarPerfil(dto), HttpStatus.OK);
    }
}
