package com.br.caring.saude.api.sgi.domain.repository;

import com.br.caring.saude.api.sgi.domain.entity.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Long> {
    Optional<Perfil> findByNome(String nome);
    boolean existsByNome(String nome);
}

