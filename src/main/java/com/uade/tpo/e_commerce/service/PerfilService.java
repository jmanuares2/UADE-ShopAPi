package com.uade.tpo.e_commerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.dto.PerfilRequestDto;
import com.uade.tpo.e_commerce.dto.UsuarioResponseDto;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PerfilService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean verificarPasswordActual(String passwordActual) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return passwordEncoder.matches(passwordActual, usuario.getPassword());
    }

    public UsuarioResponseDto actualizarPerfil(PerfilRequestDto dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (dto.getNombre() != null && !dto.getNombre().isBlank()) {
            usuario.setNombre(dto.getNombre());
        }
        if (dto.getApellido() != null && !dto.getApellido().isBlank()) {
            usuario.setApellido(dto.getApellido());
        }
        if (dto.getEmail() != null && !dto.getEmail().isBlank() && !dto.getEmail().equals(email)) {
            usuarioRepository.findByEmail(dto.getEmail()).ifPresent(existente -> {
                throw new IllegalArgumentException("El email ya está en uso");
            });
            usuario.setEmail(dto.getEmail());
        }
        if (dto.getPasswordNueva() != null && !dto.getPasswordNueva().isBlank()) {
            if (dto.getPasswordActual() == null || !passwordEncoder.matches(dto.getPasswordActual(), usuario.getPassword())) {
                throw new IllegalArgumentException("La contraseña actual es incorrecta");
            }
            usuario.setPassword(passwordEncoder.encode(dto.getPasswordNueva()));
        }

        Usuario guardado = usuarioRepository.save(usuario);
        return mapToDto(guardado);
    }

    private UsuarioResponseDto mapToDto(Usuario u) {
        return UsuarioResponseDto.builder()
                .id(u.getId())
                .nombreUsuario(u.getNombreUsuario())
                .nombre(u.getNombre())
                .apellido(u.getApellido())
                .email(u.getEmail())
                .role(u.getRole())
                .activo(u.isActivo())
                .fechaBaja(u.getFechaBaja())
                .build();
    }
}
