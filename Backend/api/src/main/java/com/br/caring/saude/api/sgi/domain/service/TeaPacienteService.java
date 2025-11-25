package com.br.caring.saude.api.sgi.domain.service;

import com.br.caring.saude.api.sgi.domain.entity.TeaPaciente;
import com.br.caring.saude.api.sgi.domain.repository.TeaPacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeaPacienteService {
    @Autowired
    private TeaPacienteRepository repository;

    public TeaPaciente save(TeaPaciente paciente) {
        return repository.save(paciente);
    }

    public Optional<TeaPaciente> findById(Long id) {
        return repository.findById(id);
    }

    public List<TeaPaciente> findAll() {
        return repository.findAll();
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    public TeaPaciente update(TeaPaciente paciente) {
        return repository.save(paciente);
    }
}
