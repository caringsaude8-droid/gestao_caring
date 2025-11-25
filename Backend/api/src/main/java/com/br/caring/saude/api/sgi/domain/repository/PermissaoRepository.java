package com.br.caring.saude.api.sgi.domain.repository;

import com.br.caring.saude.api.sgi.domain.entity.Permissao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PermissaoRepository extends JpaRepository<Permissao, Long> {
    @Query("SELECT up.permissao FROM UsuarioPermissao up WHERE up.usuId = :usuId")
    List<Permissao> findByUsuId(@Param("usuId") Long usuId);
}
