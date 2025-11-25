package com.br.caring.saude.api.sgi.domain.repository;

import com.br.caring.saude.api.sgi.domain.entity.UsuarioPermissao;
import com.br.caring.saude.api.sgi.domain.entity.UsuarioPermissao.UsuarioPermissaoId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioPermissaoRepository extends JpaRepository<UsuarioPermissao, UsuarioPermissaoId> {
    void deleteByUsuId(Long usuId);
}
