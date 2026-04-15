package com.uade.tpo.e_commerce3.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.uade.tpo.e_commerce3.model.Categoria;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.Role;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.CategoriaRepository;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;

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
            // Usuarios
            if (usuarioRepository.count() == 0) {
                Usuario admin = Usuario.builder()
                        .nombre("Admin")
                        .apellido("System")
                        .email("admin@tienda.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .build();

                Usuario user = Usuario.builder()
                        .nombre("Juan")
                        .apellido("Perez")
                        .email("juan@gmail.com")
                        .password(passwordEncoder.encode("juan123"))
                        .role(Role.USER)
                        .build();

                usuarioRepository.save(admin);
                usuarioRepository.save(user);
            }

            // Categorias y Productos
            if (categoriaRepository.count() == 0) {
                Categoria remeras = Categoria.builder().nombre("Remeras").build();
                Categoria pantalones = Categoria.builder().nombre("Pantalones").build();
                Categoria calzado = Categoria.builder().nombre("Calzado").build();

                remeras = categoriaRepository.save(remeras);
                pantalones = categoriaRepository.save(pantalones);
                calzado = categoriaRepository.save(calzado);

                if (productoRepository.count() == 0) {
                    Producto p1 = Producto.builder()
                            .nombre("Remera Oversize Negra")
                            .descripcion("Remera 100% algodon, fit oversize")
                            .precio(25000.0)
                            .stock(50)
                            // .imagenes(List.of("https://ejemplo.com/remera-negra.jpg"))
                            .categorias(List.of(remeras))
                            .build();

                    Producto p2 = Producto.builder()
                            .nombre("Pantalon Cargo Verde")
                            .descripcion("Pantalon cargo de gabardina")
                            .precio(45000.0)
                            .stock(20)
                            // .imagenes(List.of("https://ejemplo.com/cargo.jpg"))
                            .categorias(List.of(pantalones))
                            .build();

                    productoRepository.saveAll(List.of(p1, p2));
                }
            }
        };
    }
}
