package com.uade.tpo.e_commerce.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;

import com.uade.tpo.e_commerce.dto.AuthResponse;
import com.uade.tpo.e_commerce.dto.LoginRequest;
import com.uade.tpo.e_commerce.dto.RegisterRequest;
import com.uade.tpo.e_commerce.model.Role;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
class AuthenticationServiceTest {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        Usuario usuario = Usuario.builder()
                .nombreUsuario("testuser")
                .nombre("Test")
                .apellido("User")
                .email("test@test.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.USER)
                .activo(true)
                .build();
        usuarioRepository.save(usuario);
    }

    @Test
    void testRegisterUser_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setNombreUsuario("newuser");
        request.setNombre("New");
        request.setApellido("User");
        request.setEmail("new@test.com");
        request.setPassword("123456");

        AuthResponse response = authenticationService.register(request);

        assertNotNull(response);
        assertNotNull(response.getUserId());
        assertNotNull(response.getToken());
        assertEquals("USER", response.getRole());

        Usuario savedUser = usuarioRepository.findByEmail("new@test.com").orElse(null);
        assertNotNull(savedUser);
        assertEquals("newuser", savedUser.getNombreUsuario());
        assertEquals(Role.USER, savedUser.getRole());
        assertNotEquals("123456", savedUser.getPassword());
    }

    @Test
    void testRegisterUser_EmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setNombreUsuario("anotheruser");
        request.setNombre("Another");
        request.setApellido("User");
        request.setEmail("test@test.com"); // Email ya usado con anterioridad
        request.setPassword("123456");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authenticationService.register(request);
        });

        assertEquals("El email ya existe en la base de datos", exception.getMessage());
    }

    @Test
    void testLogin_Success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("password123");

        AuthResponse response = authenticationService.authenticate(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertNotNull(response.getUserId());
        assertNotNull(response.getRole());
    }

    @Test
    void testLogin_BadCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("wrongpassword");

        assertThrows(BadCredentialsException.class, () -> {
            authenticationService.authenticate(request);
        });
    }
}
