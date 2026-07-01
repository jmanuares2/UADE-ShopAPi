package com.uade.tpo.e_commerce.config;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.uade.tpo.e_commerce.model.Categoria;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Role;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.CategoriaRepository;
import com.uade.tpo.e_commerce.repository.ProductoRepository;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

@Configuration
public class DataSeedingConfig {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (usuarioRepository.count() == 0) {
                Usuario admin = Usuario.builder()
                        .nombreUsuario("admin")
                        .nombre("Admin")
                        .apellido("System")
                        .email("admin@tienda.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .build();

                Usuario user = Usuario.builder()
                        .nombreUsuario("juanperez")
                        .nombre("Juan")
                        .apellido("Perez")
                        .email("juan@gmail.com")
                        .password(passwordEncoder.encode("juan123"))
                        .role(Role.USER)
                        .build();

                usuarioRepository.save(admin);
                usuarioRepository.save(user);
            }

            if (categoriaRepository.count() == 0) {
                Categoria remeras = Categoria.builder().nombre("Remeras").build();
                Categoria pantalones = Categoria.builder().nombre("Pantalones").build();
                Categoria calzado = Categoria.builder().nombre("Calzado").build();

                categoriaRepository.save(remeras);
                categoriaRepository.save(pantalones);
                categoriaRepository.save(calzado);
            }

            // Cargar o crear categorías para asociar a los productos
            Categoria remeras = categoriaRepository.findAll().stream()
                    .filter(c -> "Remeras".equalsIgnoreCase(c.getNombre()))
                    .findFirst()
                    .orElseGet(() -> categoriaRepository.save(Categoria.builder().nombre("Remeras").build()));

            Categoria pantalones = categoriaRepository.findAll().stream()
                    .filter(c -> "Pantalones".equalsIgnoreCase(c.getNombre()))
                    .findFirst()
                    .orElseGet(() -> categoriaRepository.save(Categoria.builder().nombre("Pantalones").build()));

            Usuario creador = usuarioRepository.findByEmail("admin@tienda.com")
                    .orElseThrow(
                            () -> new IllegalStateException("No existe usuario admin para seed de productos"));

            // Producto 1
            Producto p1 = productoRepository.findAll().stream()
                    .filter(p -> "Remera Oversize Negra".equalsIgnoreCase(p.getNombre()))
                    .findFirst()
                    .orElse(null);
            if (p1 == null) {
                p1 = Producto.builder()
                        .nombre("Remera Oversize Negra")
                        .descripcion("Remera 100% algodon, fit oversize")
                        .precio(25000.0)
                        .stock(50)
                        .imagenUrl("https://picsum.photos/seed/producto1/400/600")
                        .talle("L")
                        .color("Negro")
                        .categoria(remeras)
                        .creador(creador)
                        .fechaCreacion(LocalDateTime.now().minusDays(10))
                        .build();
                productoRepository.save(p1);
            } else if (p1.getFechaCreacion() == null) {
                p1.setFechaCreacion(LocalDateTime.now().minusDays(10));
                productoRepository.save(p1);
            }

            // Producto 2
            Producto p2 = productoRepository.findAll().stream()
                    .filter(p -> "Pantalon Cargo Verde".equalsIgnoreCase(p.getNombre()))
                    .findFirst()
                    .orElse(null);
            if (p2 == null) {
                p2 = Producto.builder()
                        .nombre("Pantalon Cargo Verde")
                        .descripcion("Pantalon cargo de gabardina")
                        .precio(45000.0)
                        .stock(20)
                        .imagenUrl("https://picsum.photos/seed/producto2/400/600")
                        .talle("42")
                        .color("Verde")
                        .categoria(pantalones)
                        .creador(creador)
                        .fechaCreacion(LocalDateTime.now().minusDays(5))
                        .build();
                productoRepository.save(p2);
            } else if (p2.getFechaCreacion() == null) {
                p2.setFechaCreacion(LocalDateTime.now().minusDays(5));
                productoRepository.save(p2);
            }
        };
    }
}
