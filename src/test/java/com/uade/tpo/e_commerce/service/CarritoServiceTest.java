package com.uade.tpo.e_commerce.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.uade.tpo.e_commerce.dto.CarritoResponseDto;
import com.uade.tpo.e_commerce.dto.CartItemRequestDto;
import com.uade.tpo.e_commerce.exception.OutOfStockException;
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
class CarritoServiceTest {

    @Autowired
    private CarritoService carritoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    private Usuario testUser;
    private Producto testProduct;

    @BeforeEach
    void setUp() {
        testUser = Usuario.builder()
                .nombreUsuario("carritouser")
                .nombre("Carrito")
                .apellido("User")
                .email("carrito@test.com")
                .password("password123")
                .role(Role.USER)
                .activo(true)
                .build();
        usuarioRepository.save(testUser);

        Categoria categoria = Categoria.builder()
                .nombre("Electronics")
                .build();
        categoriaRepository.save(categoria);

        testProduct = Producto.builder()
                .nombre("Test Product")
                .descripcion("A cool product")
                .precio(100.0)
                .stock(10)
                .imagenUrl("http://img.com/a")
                .talle("M")
                .color("Red")
                .categoria(categoria)
                .creador(testUser)
                .build();
        productoRepository.save(testProduct);
    }

    @Test
    void testAddItemToCarrito_Success() {
        CartItemRequestDto request = new CartItemRequestDto();
        request.setProductoId(testProduct.getId());
        request.setCantidad(2);

        CarritoResponseDto response = carritoService.addItemToCarrito(testUser.getEmail(), request);

        assertNotNull(response);
        assertEquals(1, response.getItems().size());
        assertEquals(200.0, response.getMontoTotal());
        assertEquals(2, response.getItems().get(0).getCantidad());
    }

    @Test
    void testAddItemToCarrito_OutOfStock() {
        CartItemRequestDto request = new CartItemRequestDto();
        request.setProductoId(testProduct.getId());
        request.setCantidad(15); // Excede el stock de 10

        assertThrows(OutOfStockException.class, () -> {
            carritoService.addItemToCarrito(testUser.getEmail(), request);
        });
    }

    @Test
    void testCheckout_Success() {
        CartItemRequestDto request = new CartItemRequestDto();
        request.setProductoId(testProduct.getId());
        request.setCantidad(3);
        carritoService.addItemToCarrito(testUser.getEmail(), request);

        String checkoutResponse = carritoService.checkout(testUser.getEmail());

        assertEquals("Checkout completado satisfactoriamente", checkoutResponse);

        // verifica el carrito vacio
        CarritoResponseDto cartAfter = carritoService.getCarritoByUsername(testUser.getEmail());
        assertTrue(cartAfter.getItems().isEmpty());
        assertEquals(0.0, cartAfter.getMontoTotal());

        // verifica el stock reducido
        Producto updatedProduct = productoRepository.findById(testProduct.getId()).orElseThrow();
        assertEquals(7, updatedProduct.getStock()); // 10 - 3 = 7
    }

    @Test
    void testCheckout_EmptyCart() {
        assertThrows(IllegalArgumentException.class, () -> {
            carritoService.checkout(testUser.getEmail());
        });
    }
}
