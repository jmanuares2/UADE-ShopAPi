package com.uade.tpo.e_commerce.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.uade.tpo.e_commerce.model.Role;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
class UsuarioServiceSoftDeleteTest {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void deleteUsuarioById_realizaSoftDelete() {
        Usuario usuario = usuarioRepository.save(Usuario.builder()
                .nombreUsuario("softdelete")
                .nombre("Soft")
                .apellido("Delete")
                .email("softdelete@test.com")
                .password(passwordEncoder.encode("123456"))
                .role(Role.USER)
                .activo(true)
                .build());

        usuarioService.deleteUsuarioById(usuario.getId());

        Usuario usuarioActualizado = usuarioRepository.findById(usuario.getId()).orElseThrow();
        assertFalse(usuarioActualizado.isActivo());
        assertNotNull(usuarioActualizado.getFechaBaja());
    }

    @Test
    void hardDeleteUsuarioById_eliminaFisicamente() {
        Usuario usuario = usuarioRepository.save(Usuario.builder()
                .nombreUsuario("harddelete")
                .nombre("Hard")
                .apellido("Delete")
                .email("harddelete@test.com")
                .password(passwordEncoder.encode("123456"))
                .role(Role.USER)
                .activo(true)
                .build());

        usuarioService.hardDeleteUsuarioById(usuario.getId());

        assertTrue(usuarioRepository.findById(usuario.getId()).isEmpty());
    }
}
