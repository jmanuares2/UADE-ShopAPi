package com.uade.tpo.e_commerce.config;

import java.time.LocalDateTime;
import java.util.List;

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

                remeras = categoriaRepository.save(remeras);
                pantalones = categoriaRepository.save(pantalones);
                categoriaRepository.save(calzado);

                if (productoRepository.count() == 0) {
                    Usuario creador = usuarioRepository.findByEmail("admin@tienda.com")
                            .orElseThrow(
                                    () -> new IllegalStateException("No existe usuario admin para seed de productos"));

                    Producto p1 = Producto.builder()
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

                    Producto p2 = Producto.builder()
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

                    Producto p3 = Producto.builder()
                            .nombre("Zapatillas Running Pro")
                            .descripcion("Zapatillas livianas con amortiguación")
                            .precio(85000.0)
                            .stock(15)
                            .imagenUrl("https://picsum.photos/seed/producto3/400/600")
                            .talle("41")
                            .color("Blanco")
                            .categoria(calzado)
                            .creador(creador)
                            .fechaCreacion(LocalDateTime.now().minusDays(2))
                            .build();

                    Producto p4 = Producto.builder()
                            .nombre("Camiseta Selección Argentina")
                            .descripcion("Camiseta titular edición especial")
                            .precio(149999.0)
                            .stock(35)
                            .imagenUrl("https://picsum.photos/seed/producto4/400/600")
                            .talle("M")
                            .color("Celeste y Blanco")
                            .categoria(remeras)
                            .creador(creador)
                            .fechaCreacion(LocalDateTime.now())
                            .build();

                    productoRepository.saveAll(List.of(p1, p2, p3, p4));
                }
            }
        };
    }
}
