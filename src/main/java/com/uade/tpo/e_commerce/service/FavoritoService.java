package com.uade.tpo.e_commerce.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.exception.ProductoNotFoundException;
import com.uade.tpo.e_commerce.model.Favorito;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.FavoritoRepository;
import com.uade.tpo.e_commerce.repository.ProductoRepository;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> getFavoritosByUsername(String email) {
        Usuario usuario = getUsuarioPorEmail(email);

        List<Favorito> favoritos = favoritoRepository.findByUsuario(usuario);

        return favoritos.stream()
                .map(Favorito::getProducto)
                .collect(Collectors.toList());
    }

    public void addFavorito(String email, Long productoId) {
        Usuario usuario = getUsuarioPorEmail(email);
        Producto producto = getProductoPorId(productoId);

        Optional<Favorito> existente = favoritoRepository.findByUsuarioAndProducto(usuario, producto);

        if (existente.isEmpty()) {
            Favorito nuevoFavorito = Favorito.builder()
                    .usuario(usuario)
                    .producto(producto)
                    .build();
            favoritoRepository.save(nuevoFavorito);
        }
    }

    public void removeFavorito(String email, Long productoId) {
        Usuario usuario = getUsuarioPorEmail(email);
        Producto producto = getProductoPorId(productoId);

        favoritoRepository.deleteByUsuarioAndProducto(usuario, producto);
    }

    private Usuario getUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con email: " + email));
    }

    private Producto getProductoPorId(Long productoId) {
        return productoRepository.findById(productoId)
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado con ID: " + productoId));
    }
}
