package com.br.caring.saude.api.sgi.controller;

import com.br.caring.saude.api.sgi.domain.entity.TeaTerapeuta;
import com.br.caring.saude.api.sgi.domain.service.TeaTerapeutaService;
import com.br.caring.saude.api.sgi.dto.TeaTerapeutaRequestDTO;
import com.br.caring.saude.api.sgi.dto.TeaTerapeutaResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/terapeutas")
public class TeaTerapeutaController {
    @Autowired
    private TeaTerapeutaService service;

    @PostMapping
    public ResponseEntity<TeaTerapeutaResponseDTO> create(@RequestBody TeaTerapeutaRequestDTO dto) {
        TeaTerapeuta terapeuta = toEntity(dto);
        TeaTerapeuta saved = service.save(terapeuta);
        return ResponseEntity.ok(toResponseDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeaTerapeutaResponseDTO> update(@PathVariable Long id, @RequestBody TeaTerapeutaRequestDTO dto) {
        TeaTerapeuta terapeuta = toEntity(dto);
        terapeuta.setId(id);
        TeaTerapeuta saved = service.save(terapeuta);
        return ResponseEntity.ok(toResponseDTO(saved));
    }

    @GetMapping
    public List<TeaTerapeutaResponseDTO> list(@RequestParam(value = "clinicaId", required = false) Long clinicaId) {
        List<TeaTerapeuta> terapeutas = (clinicaId != null)
                ? service.findByClinicaId(clinicaId)
                : service.findAll();
        return terapeutas.stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeaTerapeutaResponseDTO> get(@PathVariable Long id) {
        return service.findById(id).map(this::toResponseDTO).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private TeaTerapeuta toEntity(TeaTerapeutaRequestDTO dto) {
        TeaTerapeuta entity = new TeaTerapeuta();
        entity.setNome(dto.getNome());
        entity.setCpf(dto.getCpf());
        entity.setEmail(dto.getEmail());
        entity.setSenha(dto.getSenha());
        entity.setDataNascimento(dto.getDataNascimento());
        entity.setStatus(dto.getStatus());
        entity.setClinicaId(dto.getClinicaId());
        entity.setTelefone(dto.getTelefone());
        // Converter List<String> para String (separado por vírgula) para salvar no banco
        if (dto.getEspecialidades() == null || dto.getEspecialidades().isEmpty()) {
            entity.setEspecialidades(null);
        } else {
            entity.setEspecialidades(String.join(",", dto.getEspecialidades()));
        }
        // Se quiser persistir roles, adicione um campo na entidade e salve aqui
        // Exemplo: entity.setRoles(dto.getRoles() != null ? String.join(",", dto.getRoles()) : null);
        return entity;
    }

    private TeaTerapeutaResponseDTO toResponseDTO(TeaTerapeuta entity) {
        TeaTerapeutaResponseDTO dto = new TeaTerapeutaResponseDTO();
        dto.setId(entity.getId());
        dto.setNome(entity.getNome());
        dto.setCpf(entity.getCpf());
        dto.setEmail(entity.getEmail());
        dto.setDataNascimento(entity.getDataNascimento());
        // Ajuste do status: retorna 'ativo' ou 'inativo' como string
        if (entity.getStatus() != null) {
            dto.setStatus(entity.getStatus() == 1 ? "ativo" : "inativo");
        } else {
            dto.setStatus(null);
        }
        dto.setClinicaId(entity.getClinicaId());
        dto.setTelefone(entity.getTelefone());
        dto.setPerfilId(entity.getPerfilId());
        // Converter String do banco para List<String> para o frontend
        if (entity.getEspecialidades() == null || entity.getEspecialidades().isEmpty()) {
            dto.setEspecialidades(Collections.emptyList());
        } else {
            dto.setEspecialidades(Arrays.asList(entity.getEspecialidades().split(",")));
        }
        // Sempre retorna roles com valor fixo para terapeuta
        dto.setRoles(Collections.singletonList("TERAPEUTA_MODULO"));
        return dto;
    }
}
