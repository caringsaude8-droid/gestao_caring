package com.br.caring.saude.api.sgi.controller;

import com.br.caring.saude.api.sgi.dto.TeaClinicaRequestDTO;
import com.br.caring.saude.api.sgi.dto.TeaClinicaResponseDTO;
import com.br.caring.saude.api.sgi.service.TeaClinicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clinicas")
public class TeaClinicaController {
    @Autowired
    private TeaClinicaService teaClinicaService;

    @PostMapping
    public ResponseEntity<TeaClinicaResponseDTO> criarClinica(@RequestBody TeaClinicaRequestDTO dto) {
        TeaClinicaResponseDTO response = teaClinicaService.criarClinica(dto);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeaClinicaResponseDTO> atualizarClinica(@PathVariable Long id, @RequestBody TeaClinicaRequestDTO dto) {
        TeaClinicaResponseDTO response = teaClinicaService.atualizarClinica(id, dto);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEA_MODULO')")
    @GetMapping
    public ResponseEntity<List<TeaClinicaResponseDTO>> listarClinicas(@RequestParam(required = false) Long clinicaId) {
        List<TeaClinicaResponseDTO> clinicas = teaClinicaService.listarClinicas(clinicaId);
        return ResponseEntity.ok(clinicas);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEA_MODULO')")
    @GetMapping("/{clinicaId}")
    public ResponseEntity<TeaClinicaResponseDTO> buscarClinicaPorId(@PathVariable Long clinicaId) {
        TeaClinicaResponseDTO clinica = teaClinicaService.buscarClinicaPorId(clinicaId);
        return ResponseEntity.ok(clinica);
    }
}
