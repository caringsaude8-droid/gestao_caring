package com.br.caring.saude.api.sgi.controller;

import com.br.caring.saude.api.sgi.domain.entity.TeaPaciente;
import com.br.caring.saude.api.sgi.domain.service.TeaPacienteService;
import com.br.caring.saude.api.sgi.dto.TeaPacienteRequestDTO;
import com.br.caring.saude.api.sgi.dto.TeaPacienteResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/pacientes")
public class TeaPacienteController {
    @Autowired
    private TeaPacienteService service;

    @PostMapping
    public ResponseEntity<TeaPacienteResponseDTO> create(@RequestBody TeaPacienteRequestDTO dto) {
        TeaPaciente paciente = toEntity(dto);
        TeaPaciente saved = service.save(paciente);
        return ResponseEntity.ok(toResponseDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeaPacienteResponseDTO> update(@PathVariable Long id, @RequestBody TeaPacienteRequestDTO dto) {
        if (!service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        TeaPaciente paciente = toEntity(dto);
        paciente.setId(id);
        TeaPaciente saved = service.update(paciente);
        return ResponseEntity.ok(toResponseDTO(saved));
    }

    @GetMapping
    public List<TeaPacienteResponseDTO> list() {
        return service.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeaPacienteResponseDTO> get(@PathVariable Long id) {
        return service.findById(id).map(this::toResponseDTO).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private TeaPaciente toEntity(TeaPacienteRequestDTO dto) {
        TeaPaciente entity = new TeaPaciente();
        entity.setNome(dto.getNome());
        entity.setCpf(dto.getCpf());
        entity.setDataNascimento(dto.getDataNascimento());
        entity.setEmail(dto.getEmail());
        entity.setSenha(dto.getSenha());
        entity.setTelefone(dto.getTelefone());
        entity.setGenero(dto.getGenero());
        entity.setCns(dto.getCns());
        entity.setRg(dto.getRg());
        entity.setTipoFaturamento(dto.getTipoFaturamento());
        entity.setResponsavelNome(dto.getResponsavelNome());
        entity.setResponsavelDataNascimento(dto.getResponsavelDataNascimento());
        entity.setResponsavelCpf(dto.getResponsavelCpf());
        entity.setResponsavelCep(dto.getResponsavelCep());
        entity.setResponsavelEstado(dto.getResponsavelEstado());
        entity.setResponsavelCidade(dto.getResponsavelCidade());
        entity.setResponsavelBairro(dto.getResponsavelBairro());
        entity.setResponsavelEndereco(dto.getResponsavelEndereco());
        entity.setResponsavelComplemento(dto.getResponsavelComplemento());
        entity.setResponsavelNumero(dto.getResponsavelNumero());
        entity.setResponsavelTipo(dto.getResponsavelTipo());
        entity.setResponsavelCpfCnpj(dto.getResponsavelCpfCnpj());
        entity.setOutrosDados(dto.getOutrosDados());
        entity.setUnidade(dto.getUnidade());
        entity.setClinicaId(dto.getClinicaId());
        entity.setConvenio(dto.getConvenio());
        entity.setTabelaConvenio(dto.getTabelaConvenio());
        entity.setMatriculaConvenio(dto.getMatriculaConvenio());
        entity.setValidadeConvenio(dto.getValidadeConvenio());
        entity.setTipoCobranca(dto.getTipoCobranca());
        entity.setInicioTratamento(dto.getInicioTratamento());
        entity.setFimTratamento(dto.getFimTratamento());
        entity.setProtocolo(dto.getProtocolo());
        entity.setEquipeAcomp(dto.getEquipeAcomp());
        entity.setObservacoes(dto.getObservacoes());
        entity.setEspectro(dto.getEspectro());
        entity.setTerapeutaId(dto.getTerapeutaId());
        entity.setStatus(dto.getStatus());
        // Se quiser persistir roles, adicione um campo na entidade e salve aqui
        // Exemplo: entity.setRoles(dto.getRoles() != null ? String.join(",", dto.getRoles()) : null);
        return entity;
    }

    private TeaPacienteResponseDTO toResponseDTO(TeaPaciente entity) {
        TeaPacienteResponseDTO dto = new TeaPacienteResponseDTO();
        dto.setId(entity.getId());
        dto.setNome(entity.getNome());
        dto.setCpf(entity.getCpf());
        dto.setDataNascimento(entity.getDataNascimento());
        dto.setEmail(entity.getEmail());
        dto.setTelefone(entity.getTelefone());
        dto.setGenero(entity.getGenero());
        dto.setCns(entity.getCns());
        dto.setRg(entity.getRg());
        dto.setTipoFaturamento(entity.getTipoFaturamento());
        dto.setResponsavelNome(entity.getResponsavelNome());
        dto.setResponsavelDataNascimento(entity.getResponsavelDataNascimento());
        dto.setResponsavelCpf(entity.getResponsavelCpf());
        dto.setResponsavelCep(entity.getResponsavelCep());
        dto.setResponsavelEstado(entity.getResponsavelEstado());
        dto.setResponsavelCidade(entity.getResponsavelCidade());
        dto.setResponsavelBairro(entity.getResponsavelBairro());
        dto.setResponsavelEndereco(entity.getResponsavelEndereco());
        dto.setResponsavelComplemento(entity.getResponsavelComplemento());
        dto.setResponsavelNumero(entity.getResponsavelNumero());
        dto.setResponsavelTipo(entity.getResponsavelTipo());
        dto.setResponsavelCpfCnpj(entity.getResponsavelCpfCnpj());
        dto.setOutrosDados(entity.getOutrosDados());
        dto.setUnidade(entity.getUnidade());
        dto.setClinicaId(entity.getClinicaId());
        dto.setConvenio(entity.getConvenio());
        dto.setTabelaConvenio(entity.getTabelaConvenio());
        dto.setMatriculaConvenio(entity.getMatriculaConvenio());
        dto.setValidadeConvenio(entity.getValidadeConvenio());
        dto.setTipoCobranca(entity.getTipoCobranca());
        dto.setInicioTratamento(entity.getInicioTratamento());
        dto.setFimTratamento(entity.getFimTratamento());
        dto.setProtocolo(entity.getProtocolo());
        dto.setEquipeAcomp(entity.getEquipeAcomp());
        dto.setObservacoes(entity.getObservacoes());
        dto.setEspectro(entity.getEspectro());
        dto.setTerapeutaId(entity.getTerapeutaId());
        dto.setStatus(entity.getStatus());
        // Se quiser retornar roles persistidas, converta aqui
        // Exemplo: dto.setRoles(entity.getRoles() != null ? Arrays.asList(entity.getRoles().split(",")) : Collections.emptyList());
        dto.setRoles(Collections.emptyList()); // Por padrão, vazio
        return dto;
    }
}
