package com.br.caring.saude.api.sgi.service;

import com.br.caring.saude.api.sgi.domain.entity.Permissao;
import com.br.caring.saude.api.sgi.domain.entity.UsuarioPermissao;
import com.br.caring.saude.api.sgi.domain.repository.PermissaoRepository;
import com.br.caring.saude.api.sgi.domain.repository.UsuarioPermissaoRepository;
import com.br.caring.saude.api.sgi.dto.PermissaoResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PermissaoService {
    @Autowired
    private PermissaoRepository permissaoRepository;
    @Autowired
    private UsuarioPermissaoRepository usuarioPermissaoRepository;

    public List<PermissaoResponseDTO> listarTodas() {
        return permissaoRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public List<PermissaoResponseDTO> listarPorUsuario(Long usuId) {
        return permissaoRepository.findByUsuId(usuId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public void atualizarPermissoesUsuario(Long usuId, List<Long> permissoesIds) {
        usuarioPermissaoRepository.deleteByUsuId(usuId);
        for (Long permId : permissoesIds) {
            usuarioPermissaoRepository.save(new UsuarioPermissao(usuId, permId));
        }
    }

    private PermissaoResponseDTO toDTO(Permissao permissao) {
        PermissaoResponseDTO dto = new PermissaoResponseDTO();
        dto.setId(permissao.getId());
        dto.setNome(permissao.getNome());
        dto.setDescricao(permissao.getDescricao());
        return dto;
    }
}
