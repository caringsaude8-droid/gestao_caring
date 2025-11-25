package com.br.caring.saude.api.sgi.domain.repository;

import com.br.caring.saude.api.sgi.domain.entity.TeaPaciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeaPacienteRepository extends JpaRepository<TeaPaciente, Long> {
    Optional<TeaPaciente> findByEmail(String email);
    Optional<TeaPaciente> findByCpf(String cpf);
}
