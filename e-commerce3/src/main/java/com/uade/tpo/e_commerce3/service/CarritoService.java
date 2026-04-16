package com.uade.tpo.e_commerce3.service;

import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce3.dto.CarritoResponseDto;
import com.uade.tpo.e_commerce3.dto.CartItemRequestDto;
import com.uade.tpo.e_commerce3.dto.ItemCarritoDto;
import com.uade.tpo.e_commerce3.exception.OutOfStockException;
import com.uade.tpo.e_commerce3.exception.ProductoNotFoundException;
import com.uade.tpo.e_commerce3.model.Carrito;
import com.uade.tpo.e_commerce3.model.ItemCarrito;
import com.uade.tpo.e_commerce3.model.Producto;
import com.uade.tpo.e_commerce3.model.Usuario;
import com.uade.tpo.e_commerce3.repository.CarritoRepository;
import com.uade.tpo.e_commerce3.repository.ProductoRepository;
import com.uade.tpo.e_commerce3.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public CarritoResponseDto getCarritoByUsername(String email) {
        Carrito carrito = getOrCreateCarrito(email);
        return mapToDto(carrito);
    }

    public CarritoResponseDto addItemToCarrito(String email, CartItemRequestDto req) {
        if (req == null || req.getProductoId() == null) {
            throw new IllegalArgumentException("Debe indicar un productoId valido.");
        }
        if (req.getCantidad() == null || req.getCantidad() <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a 0.");
        }

        Carrito carrito = getOrCreateCarrito(email);
        Producto producto = productoRepository.findById(req.getProductoId())
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado"));

        // Validamos stock antes de agregar.
        if (producto.getStock() < req.getCantidad()) {
            throw new OutOfStockException("Stock insuficiente para el producto: " + producto.getNombre());
        }

        Optional<ItemCarrito> existingItem = carrito.getItems().stream()
                .filter(item -> item.getProducto().getId().equals(producto.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            ItemCarrito item = existingItem.get();
            int nuevaCantidad = item.getCantidad() + req.getCantidad();
            if (producto.getStock() < nuevaCantidad) {
                throw new OutOfStockException("Stock insuficiente tras sumar cantidad en carrito.");
            }
            item.setCantidad(nuevaCantidad);
        } else {
            ItemCarrito newItem = ItemCarrito.builder()
                    .carrito(carrito)
                    .producto(producto)
                    .cantidad(req.getCantidad())
                    .precioUnitario(producto.getPrecio())
                    .build();
            carrito.getItems().add(newItem);
        }

        recalcularTotal(carrito);
        return mapToDto(carritoRepository.save(carrito));
    }

    public CarritoResponseDto removeItemFromCarrito(String email, Long itemId) {
        Carrito carrito = getOrCreateCarrito(email);
        carrito.getItems().removeIf(item -> item.getId().equals(itemId));
        recalcularTotal(carrito);
        return mapToDto(carritoRepository.save(carrito));
    }

    public CarritoResponseDto clearCarrito(String email) {
        Carrito carrito = getOrCreateCarrito(email);
        carrito.getItems().clear();
        recalcularTotal(carrito);
        return mapToDto(carritoRepository.save(carrito));
    }

    public String checkout(String email) {
        Carrito carrito = getOrCreateCarrito(email);
        if (carrito.getItems().isEmpty()) {
            throw new IllegalArgumentException("El carrito esta vacio");
        }

        // Verificación final de stock antes de descontar.
        for (ItemCarrito item : carrito.getItems()) {
            if (item.getProducto().getStock() < item.getCantidad()) {
                throw new OutOfStockException("Stock insuficiente para: " + item.getProducto().getNombre());
            }
        }

        for (ItemCarrito item : carrito.getItems()) {
            Producto p = item.getProducto();
            p.setStock(p.getStock() - item.getCantidad());
            productoRepository.save(p);
        }

        carrito.getItems().clear();
        recalcularTotal(carrito);
        carritoRepository.save(carrito);

        return "Checkout completado satisfactoriamente";
    }

    private Carrito getOrCreateCarrito(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        return carritoRepository.findByUsuario(usuario).orElseGet(() -> {
            Carrito newCarrito = Carrito.builder().usuario(usuario).montoTotal(0.0).build();
            return carritoRepository.save(newCarrito);
        });
    }

    private void recalcularTotal(Carrito carrito) {
        double total = carrito.getItems().stream()
                .mapToDouble(item -> item.getCantidad() * item.getPrecioUnitario())
                .sum();
        carrito.setMontoTotal(total);
    }

    private CarritoResponseDto mapToDto(Carrito c) {
        return CarritoResponseDto.builder()
                .id(c.getId())
                .usuarioId(c.getUsuario().getId())
                .montoTotal(c.getMontoTotal())
                .items(c.getItems().stream().map(this::mapItem).collect(Collectors.toList()))
                .build();
    }

    private ItemCarritoDto mapItem(ItemCarrito item) {
        return ItemCarritoDto.builder()
                .id(item.getId())
                .productoId(item.getProducto().getId())
                .productoNombre(item.getProducto().getNombre())
                .cantidad(item.getCantidad())
                .precioUnitario(item.getPrecioUnitario())
                .build();
    }
}
