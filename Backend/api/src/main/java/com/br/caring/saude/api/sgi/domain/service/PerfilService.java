package com.br.caring.saude.api.sgi.domain.service;



import com.br.caring.saude.api.sgi.domain.entity.Perfil;
import com.br.caring.saude.api.sgi.domain.repository.PerfilRepository;
import com.br.caring.saude.api.sgi.dto.PerfilRequestDTO;
import com.br.caring.saude.api.sgi.dto.PerfilResponseDTO;
import com.br.caring.saude.api.sgi.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PerfilService {

    private final PerfilRepository repository;

    public PerfilService(PerfilRepository repository) {
        this.repository = repository;
    }

    public List<PerfilResponseDTO> listAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PerfilResponseDTO getById(Long id) {
        Perfil p = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil não encontrado: " + id));
        return toResponse(p);
    }

    public PerfilResponseDTO create(PerfilRequestDTO req) {
        if (repository.existsByNome(req.getNome())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Perfil com esse nome já existe");
        }
        Perfil p = new Perfil();
        p.setNome(req.getNome());
        p.setDescricao(req.getDescricao());
        Perfil saved = repository.save(p);
        return toResponse(saved);
    }

    @Transactional
    public PerfilResponseDTO update(Long id, PerfilRequestDTO req) {
        Perfil perfil = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil não encontrado: " + id));

        // Verifica se já existe outro perfil com o mesmo nome
        if (!perfil.getNome().equals(req.getNome()) && repository.existsByNome(req.getNome())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Perfil com esse nome já existe");
        }

        perfil.setNome(req.getNome());
        perfil.setDescricao(req.getDescricao());

        Perfil saved = repository.save(perfil);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Perfil não encontrado: " + id);
        }
        try {
            repository.deleteById(id);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Não é possível excluir este perfil pois está em uso");
        }
    }

    private PerfilResponseDTO toResponse(Perfil perfil) {
        PerfilResponseDTO response = new PerfilResponseDTO();
        response.setId(perfil.getId());
        response.setNome(perfil.getNome());
        response.setDescricao(perfil.getDescricao());
        return response;
    }


}
