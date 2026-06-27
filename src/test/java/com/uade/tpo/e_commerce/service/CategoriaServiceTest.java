package com.uade.tpo.e_commerce.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.uade.tpo.e_commerce.model.Categoria;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Role;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.CategoriaRepository;
import com.uade.tpo.e_commerce.repository.ProductoRepository;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
class CategoriaServiceTest {

    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Categoria categoriaOriginal;
    private Categoria categoriaReemplazo;
    private Producto producto;

    @BeforeEach
    void setUp() {
        Usuario creador = usuarioRepository.save(Usuario.builder()
                .nombreUsuario("categoria_user")
                .nombre("Categoria")
                .apellido("User")
                .email("categoria@test.com")
                .password("password")
                .role(Role.ADMIN)
                .activo(true)
                .build());

        categoriaOriginal = categoriaRepository.save(Categoria.builder()
                .nombre("Original")
                .build());

        categoriaReemplazo = categoriaRepository.save(Categoria.builder()
                .nombre("Reemplazo")
                .build());

        producto = productoRepository.save(Producto.builder()
                .nombre("Producto con categoria")
                .descripcion("Descripcion")
                .precio(100.0)
                .stock(5)
                .imagenUrl("http://img.com/producto.jpg")
                .talle("M")
                .color("Negro")
                .categoria(categoriaOriginal)
                .creador(creador)
                .build());
    }

    @Test
    void deleteCategoriaById_conProductosSinReemplazo_lanzaError() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            categoriaService.deleteCategoriaById(categoriaOriginal.getId());
        });

        assertEquals("La categoria tiene productos asociados. Debe indicar un reemplazoId.", exception.getMessage());
    }

    @Test
    void deleteCategoriaById_conReemplazo_reasignaProductosYEliminaCategoria() {
        categoriaService.deleteCategoriaById(categoriaOriginal.getId(), categoriaReemplazo.getId());

        Producto productoActualizado = productoRepository.findById(producto.getId()).orElseThrow();

        assertEquals(categoriaReemplazo.getId(), productoActualizado.getCategoria().getId());
        assertFalse(categoriaRepository.existsById(categoriaOriginal.getId()));
    }
}
