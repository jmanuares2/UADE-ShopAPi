package com.uade.tpo.e_commerce.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.uade.tpo.e_commerce.dto.VentaDto;
import com.uade.tpo.e_commerce.service.VentaService;

@RestController
@RequestMapping("/api/mis-compras")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @GetMapping
    public ResponseEntity<List<VentaDto>> getMisCompras() {
        return ResponseEntity.ok(ventaService.getMisCompras());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProductoVendido(@PathVariable Long id) {
        ventaService.eliminarVenta(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> limpiarHistorial() {
        ventaService.limpiarHistorial();
        return ResponseEntity.noContent().build();
    }
}