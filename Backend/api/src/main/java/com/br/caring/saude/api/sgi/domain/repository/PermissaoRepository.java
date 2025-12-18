package com.br.caring.saude.api.sgi.domain.repository;

import com.br.caring.saude.api.sgi.domain.entity.Permissao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissaoRepository extends JpaRepository<Permissao, Long> {
}
