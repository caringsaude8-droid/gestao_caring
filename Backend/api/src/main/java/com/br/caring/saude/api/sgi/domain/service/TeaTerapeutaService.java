package com.br.caring.saude.api.sgi.domain.service;

import com.br.caring.saude.api.sgi.domain.entity.TeaTerapeuta;
import com.br.caring.saude.api.sgi.domain.repository.TeaTerapeutaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeaTerapeutaService {
    @Autowired
    private TeaTerapeutaRepository repository;

    public TeaTerapeuta save(TeaTerapeuta terapeuta) {
        return repository.save(terapeuta);
    }

    public Optional<TeaTerapeuta> findById(Long id) {
        return repository.findById(id);
    }

    public List<TeaTerapeuta> findAll() {
        return repository.findAll();
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public List<TeaTerapeuta> findByClinicaId(Long clinicaId) {
        return repository.findByClinicaId(clinicaId);
    }
}
