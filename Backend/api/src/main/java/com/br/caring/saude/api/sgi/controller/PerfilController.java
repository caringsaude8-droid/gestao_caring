package com.br.caring.saude.api.sgi.controller;


import com.br.caring.saude.api.sgi.domain.service.PerfilService;
import com.br.caring.saude.api.sgi.dto.PerfilRequestDTO;
import com.br.caring.saude.api.sgi.dto.PerfilResponseDTO;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/perfis")
public class PerfilController {

    private final PerfilService service;

    public PerfilController(PerfilService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<PerfilResponseDTO>> listAll() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PerfilResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<PerfilResponseDTO> create(@Valid @RequestBody PerfilRequestDTO req) {
        PerfilResponseDTO created = service.create(req);
        return ResponseEntity.created(URI.create("/api/perfis/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PerfilResponseDTO> update(@PathVariable Long id, @Valid @RequestBody PerfilRequestDTO req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}