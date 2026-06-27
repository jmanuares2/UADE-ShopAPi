package com.uade.tpo.e_commerce.service;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;

import com.uade.tpo.e_commerce.dto.ProductoRequestDto;
import com.uade.tpo.e_commerce.exception.ForbiddenOperationException;
import com.uade.tpo.e_commerce.exception.PrecioNegativoException;
import com.uade.tpo.e_commerce.exception.ProductoNotFoundException;
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
class ProductoServiceTest {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    private Usuario adminUser;
    private Usuario otherUser;
    private Categoria testCategoria;
    private Producto testProduct;

    @BeforeEach
    void setUp() {
        adminUser = Usuario.builder()
                .nombreUsuario("admin_test")
                .nombre("Admin")
                .apellido("User")
                .email("admin_test@test.com")
                .password("password")
                .role(Role.ADMIN)
                .activo(true)
                .build();
        usuarioRepository.save(adminUser);

        otherUser = Usuario.builder()
                .nombreUsuario("other")
                .nombre("Other")
                .apellido("User")
                .email("other@test.com")
                .password("password")
                .role(Role.USER)
                .activo(true)
                .build();
        usuarioRepository.save(otherUser);

        testCategoria = Categoria.builder()
                .nombre("Test Category")
                .build();
        categoriaRepository.save(testCategoria);

        testProduct = Producto.builder()
                .nombre("Existing Product")
                .descripcion("Desc")
                .precio(10.0)
                .stock(5)
                .imagenUrl("http://img.com")
                .talle("S")
                .color("Blue")
                .categoria(testCategoria)
                .creador(adminUser)
                .build();
        productoRepository.save(testProduct);
    }

    @Test
    @WithMockUser(username = "admin_test@test.com")
    void testSaveProducto_PrecioNegativo() {
        ProductoRequestDto request = new ProductoRequestDto();
        request.setNombre("New Product");
        request.setDescripcion("Desc");
        request.setPrecio(-10.0); // precio negativo
        request.setStock(10);
        request.setImagenUrl("http://img.com");
        request.setTalle("M");
        request.setColor("Green");
        request.setCategoriaId(testCategoria.getId());

        assertThrows(PrecioNegativoException.class, () -> {
            productoService.saveProducto(request);
        });
    }

    @Test
    void testGetProductoById_NotFound() {
        assertThrows(ProductoNotFoundException.class, () -> {
            productoService.getProductoById(999L);
        });
    }

    @Test
    @WithMockUser(username = "other@test.com")
    void testDeleteProducto_Forbidden() {
        // testProduct es creado por adminUser (Role.ADMIN),
        // el usuario other (Role.USER) no deberia poder eliminarlo
        assertThrows(ForbiddenOperationException.class, () -> {
            productoService.deleteProductoById(testProduct.getId());
        });
    }
}
