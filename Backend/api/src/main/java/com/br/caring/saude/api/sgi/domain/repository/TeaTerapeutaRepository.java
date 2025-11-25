package com.br.caring.saude.api.sgi.domain.repository;

import com.br.caring.saude.api.sgi.domain.entity.TeaTerapeuta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeaTerapeutaRepository extends JpaRepository<TeaTerapeuta, Long> {
    Optional<TeaTerapeuta> findByEmail(String email);
    Optional<TeaTerapeuta> findByCpf(String cpf);
    List<TeaTerapeuta> findByClinicaId(Long clinicaId);
}
