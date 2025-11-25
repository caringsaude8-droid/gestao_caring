package com.br.caring.saude.api.sgi.controller;

import com.br.caring.saude.api.sgi.dto.PermissaoResponseDTO;
import com.br.caring.saude.api.sgi.service.PermissaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class PermissaoController {
    @Autowired
    private PermissaoService permissaoService;

    @GetMapping("/permissoes")
    public List<PermissaoResponseDTO> listarPermissoes() {
        return permissaoService.listarTodas();
    }

    @GetMapping("/usuarios/{usuId}/permissoes")
    public List<PermissaoResponseDTO> listarPermissoesUsuario(@PathVariable Long usuId) {
        return permissaoService.listarPorUsuario(usuId);
    }

    @PutMapping("/usuarios/{usuId}/permissoes")
    public ResponseEntity<Void> atualizarPermissoesUsuario(
        @PathVariable Long usuId,
        @RequestBody List<Long> permissoesIds) {
        permissaoService.atualizarPermissoesUsuario(usuId, permissoesIds);
        return ResponseEntity.noContent().build();
    }
}
