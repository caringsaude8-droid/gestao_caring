package com.br.caring.saude.api.sgi.domain.repository;

import com.br.caring.saude.api.sgi.domain.entity.TeaClinica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeaClinicaRepository extends JpaRepository<TeaClinica, Long> {
}

