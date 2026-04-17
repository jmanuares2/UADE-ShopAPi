package com.uade.tpo.e_commerce3.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.UsuarioRequestDto;
import com.uade.tpo.e_commerce3.dto.UsuarioResponseDto;
import com.uade.tpo.e_commerce3.exception.UsuarioNotFoundException;
import com.uade.tpo.e_commerce3.model.Role;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UsuarioResponseDto> getAllUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public UsuarioResponseDto getUsuarioById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new UsuarioNotFoundException(id));

        return mapToDto(usuario);
    }

    public UsuarioResponseDto saveUsuario(UsuarioRequestDto dto) {
        validarUsuario(dto, null);

        Usuario usuario = Usuario.builder()
                .nombreUsuario(dto.getNombreUsuario())
                .nombre(dto.getNombre())
                .apellido(dto.getApellido())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole() != null ? dto.getRole() : Role.USER)
                .build();

        return mapToDto(usuarioRepository.save(usuario));
    }

    public UsuarioResponseDto updateUsuario(Long id, UsuarioRequestDto dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException(id));

        validarUsuario(dto, id);

        usuario.setNombreUsuario(dto.getNombreUsuario());
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setEmail(dto.getEmail());
        usuario.setRole(dto.getRole() != null ? dto.getRole() : Role.USER);

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return mapToDto(usuarioRepository.save(usuario));
    }

    public void deleteUsuarioById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException(id));

        if (usuario.getProductosPublicados() != null && !usuario.getProductosPublicados().isEmpty()) {
            throw new IllegalArgumentException("No se puede eliminar un usuario con productos publicados");
        }

        usuarioRepository.delete(usuario);
    }

    private void validarUsuario(UsuarioRequestDto dto, Long usuarioIdActual) {
        if (dto.getNombreUsuario() == null || dto.getNombreUsuario().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de usuario es obligatorio");
        }

        if (dto.getNombre() == null || dto.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }

        if (dto.getApellido() == null || dto.getApellido().trim().isEmpty()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }

        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }

        if (usuarioIdActual == null && (dto.getPassword() == null || dto.getPassword().isBlank())) {
            throw new IllegalArgumentException("La password es obligatoria");
        }

        usuarioRepository.findByEmail(dto.getEmail()).ifPresent(existente -> {
            if (!existente.getId().equals(usuarioIdActual)) {
                throw new IllegalArgumentException("El email ya existe en la base de datos");
            }
        });

        usuarioRepository.findByNombreUsuario(dto.getNombreUsuario()).ifPresent(existente -> {
            if (!existente.getId().equals(usuarioIdActual)) {
                throw new IllegalArgumentException("El nombre de usuario ya existe");
            }
        });
    }

    private UsuarioResponseDto mapToDto(Usuario usuario) {
        return UsuarioResponseDto.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .email(usuario.getEmail())
                .role(usuario.getRole())
                .build();
    }
}
