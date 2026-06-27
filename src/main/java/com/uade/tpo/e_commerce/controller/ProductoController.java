package com.uade.tpo.e_commerce.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.e_commerce.dto.ProductoRequestDto;
import com.uade.tpo.e_commerce.dto.ProductoResponseDto;
import com.uade.tpo.e_commerce.service.ProductoService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<ProductoResponseDto>> getAllProductos() {
        return new ResponseEntity<>(productoService.getAllProductos(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponseDto> getProductoById(@PathVariable Long id) {
        ProductoResponseDto productoDTO = productoService.getProductoById(id);
        return new ResponseEntity<>(productoDTO, HttpStatus.OK);
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<ProductoResponseDto>> getProductosByCategoria(@PathVariable Long categoriaId) {
        return new ResponseEntity<>(productoService.getProductosByCategoria(categoriaId), HttpStatus.OK);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProductoResponseDto>> buscarProductos(@RequestParam String q) {
        return new ResponseEntity<>(productoService.buscarPorNombre(q), HttpStatus.OK);
    }

    @GetMapping("/filtrar")
    public ResponseEntity<List<ProductoResponseDto>> filtrarPorPrecio(
            @RequestParam Double precioMin,
            @RequestParam Double precioMax) {
        return new ResponseEntity<>(productoService.filtrarPorPrecio(precioMin, precioMax), HttpStatus.OK);
    }

    @GetMapping("/mis-productos")
    public ResponseEntity<List<ProductoResponseDto>> getMisProductos() {
        return new ResponseEntity<>(productoService.getMisProductos(), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductoById(@PathVariable Long id) {
        productoService.deleteProductoById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping
    public ResponseEntity<ProductoResponseDto> saveProducto(@RequestBody ProductoRequestDto productoDTO) {
        ProductoResponseDto savedProducto = productoService.saveProducto(productoDTO);
        return new ResponseEntity<>(savedProducto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponseDto> updateProducto(@PathVariable Long id,
            @RequestBody ProductoRequestDto productoDTO) {
        ProductoResponseDto updated = productoService.updateProducto(id, productoDTO);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
}