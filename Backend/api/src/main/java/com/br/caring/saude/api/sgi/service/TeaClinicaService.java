package com.br.caring.saude.api.sgi.service;

import com.br.caring.saude.api.sgi.domain.entity.TeaClinica;
import com.br.caring.saude.api.sgi.domain.repository.TeaClinicaRepository;
import com.br.caring.saude.api.sgi.dto.TeaClinicaRequestDTO;
import com.br.caring.saude.api.sgi.dto.TeaClinicaResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TeaClinicaService {
    @Autowired
    private TeaClinicaRepository teaClinicaRepository;

    public TeaClinicaResponseDTO criarClinica(TeaClinicaRequestDTO dto) {
        TeaClinica clinica = new TeaClinica();
        clinica.setNome(dto.getNome());
        clinica.setTelefone(dto.getTelefone());
        clinica.setEmail(dto.getEmail());
        clinica.setEndereco(dto.getEndereco());
        clinica.setCnpj(dto.getCnpj());
        try {
            if (dto.getDataCadastro() != null && !dto.getDataCadastro().isBlank()) {
                clinica.setDataCadastro(Date.valueOf(LocalDate.parse(dto.getDataCadastro())));
            }
        } catch (Exception e) {
            throw new RuntimeException("Formato de dataCadastro inválido. Use 'yyyy-MM-dd'.");
        }
        clinica.setStatus(dto.getStatus());
        clinica = teaClinicaRepository.save(clinica);
        TeaClinicaResponseDTO response = new TeaClinicaResponseDTO();
        response.setId(clinica.getId());
        response.setNome(clinica.getNome());
        response.setTelefone(clinica.getTelefone());
        response.setEmail(clinica.getEmail());
        response.setEndereco(clinica.getEndereco());
        response.setCnpj(clinica.getCnpj());
        response.setDataCadastro(clinica.getDataCadastro());
        response.setStatus(clinica.getStatus());
        return response;
    }

    public TeaClinicaResponseDTO atualizarClinica(Long id, TeaClinicaRequestDTO dto) {
        TeaClinica clinica = teaClinicaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Clínica não encontrada"));
        clinica.setNome(dto.getNome());
        clinica.setTelefone(dto.getTelefone());
        clinica.setEmail(dto.getEmail());
        clinica.setEndereco(dto.getEndereco());
        clinica.setCnpj(dto.getCnpj());
        try {
            if (dto.getDataCadastro() != null && !dto.getDataCadastro().isBlank()) {
                clinica.setDataCadastro(Date.valueOf(LocalDate.parse(dto.getDataCadastro())));
            }
        } catch (Exception e) {
            throw new RuntimeException("Formato de dataCadastro inválido. Use 'yyyy-MM-dd'.");
        }
        clinica.setStatus(dto.getStatus());
        clinica = teaClinicaRepository.save(clinica);
        TeaClinicaResponseDTO response = new TeaClinicaResponseDTO();
        response.setId(clinica.getId());
        response.setNome(clinica.getNome());
        response.setTelefone(clinica.getTelefone());
        response.setEmail(clinica.getEmail());
        response.setEndereco(clinica.getEndereco());
        response.setCnpj(clinica.getCnpj());
        response.setDataCadastro(clinica.getDataCadastro());
        response.setStatus(clinica.getStatus());
        return response;
    }

    public List<TeaClinicaResponseDTO> listarClinicas(Long clinicaId) {
        List<TeaClinica> clinicas;
        if (clinicaId != null) {
            clinicas = new ArrayList<>();
            teaClinicaRepository.findById(clinicaId).ifPresent(clinicas::add);
        } else {
            clinicas = teaClinicaRepository.findAll();
        }
        List<TeaClinicaResponseDTO> responseList = new ArrayList<>();
        for (TeaClinica clinica : clinicas) {
            TeaClinicaResponseDTO dto = new TeaClinicaResponseDTO();
            dto.setId(clinica.getId());
            dto.setNome(clinica.getNome());
            dto.setTelefone(clinica.getTelefone());
            dto.setEmail(clinica.getEmail());
            dto.setEndereco(clinica.getEndereco());
            dto.setCnpj(clinica.getCnpj());
            dto.setDataCadastro(clinica.getDataCadastro());
            dto.setStatus(clinica.getStatus());
            responseList.add(dto);
        }
        return responseList;
    }

    public TeaClinicaResponseDTO buscarClinicaPorId(Long clinicaId) {
        TeaClinica clinica = teaClinicaRepository.findById(clinicaId)
            .orElseThrow(() -> new RuntimeException("Clínica não encontrada"));
        TeaClinicaResponseDTO dto = new TeaClinicaResponseDTO();
        dto.setId(clinica.getId());
        dto.setNome(clinica.getNome());
        dto.setTelefone(clinica.getTelefone());
        dto.setEmail(clinica.getEmail());
        dto.setEndereco(clinica.getEndereco());
        dto.setCnpj(clinica.getCnpj());
        dto.setDataCadastro(clinica.getDataCadastro());
        dto.setStatus(clinica.getStatus());
        return dto;
    }
}
