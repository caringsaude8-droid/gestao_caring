package com.br.caring.saude.api.sgi.service;

import com.br.caring.saude.api.sgi.domain.entity.Permissao;
import com.br.caring.saude.api.sgi.domain.entity.Usuario;
import com.br.caring.saude.api.sgi.domain.repository.PermissaoRepository;
import com.br.caring.saude.api.sgi.domain.repository.UsuarioRepository;
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
    private UsuarioRepository usuarioRepository;

    public List<PermissaoResponseDTO> listarTodas() {
        return permissaoRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public List<PermissaoResponseDTO> listarPorUsuario(Long usuId) {
        Usuario usuario = usuarioRepository.findById(usuId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return usuario.getPermissoes().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public void atualizarPermissoesUsuario(Long usuId, List<Long> permissoesIds) {
        Usuario usuario = usuarioRepository.findById(usuId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Limpa as permissões atuais
        usuario.getPermissoes().clear();

        // Adiciona as novas permissões
        for (Long permId : permissoesIds) {
            Permissao permissao = permissaoRepository.findById(permId)
                .orElseThrow(() -> new RuntimeException("Permissão não encontrada"));
            usuario.getPermissoes().add(permissao);
        }

        usuarioRepository.save(usuario);
    }

    private PermissaoResponseDTO toDTO(Permissao permissao) {
        PermissaoResponseDTO dto = new PermissaoResponseDTO();
        dto.setId(permissao.getId());
        dto.setNome(permissao.getNome());
        dto.setDescricao(permissao.getDescricao());
        return dto;
    }
}
