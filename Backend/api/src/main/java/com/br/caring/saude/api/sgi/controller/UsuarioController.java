package com.br.caring.saude.api.sgi.controller;

import com.br.caring.saude.api.sgi.domain.service.UsuarioService;
import com.br.caring.saude.api.sgi.dto.UsuarioRequestDTO;
import com.br.caring.saude.api.sgi.dto.UsuarioResponseDTO;
import com.br.caring.saude.api.sgi.dto.LoginRequestDTO;
import com.br.caring.saude.api.sgi.dto.LoginResponseDTO;
import com.br.caring.saude.api.sgi.dto.LoginResultDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    @Autowired // indica injeção de dependência automática para a classe UsuarioService
    private UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criarUsuario(@Valid @RequestBody UsuarioRequestDTO request) {
        UsuarioResponseDTO response = usuarioService.criarUsuario(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios(@RequestParam(value = "clinicaId", required = false) Long clinicaId) {
        List<UsuarioResponseDTO> usuarios = usuarioService.listarUsuarios(clinicaId);
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        Long id = Long.parseLong(authentication.getName());
        UsuarioResponseDTO usuario = usuarioService.buscarUsuario(id);
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarUsuario(@PathVariable Long id) {
        UsuarioResponseDTO usuario = usuarioService.buscarUsuario(id);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioRequestDTO request) {
        UsuarioResponseDTO usuario = usuarioService.atualizarUsuario(id, request);
        return ResponseEntity.ok(usuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResultDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        try {
            System.out.println("Tentativa de login para o email: " + request.getEmail());
            LoginResponseDTO response = usuarioService.login(request);
            System.out.println("Login bem-sucedido para o email: " + request.getEmail());
            // Monta o LoginResultDTO
            LoginResultDTO result = new LoginResultDTO();
            result.setToken(response.getToken());
            result.setRefreshToken(response.getRefreshToken());
            // Converte LoginResponseDTO.UsuarioResponseDTO para UsuarioResponseDTO
            LoginResponseDTO.UsuarioResponseDTO userDto = response.getUser();
            UsuarioResponseDTO usuarioResponse = new UsuarioResponseDTO();
            usuarioResponse.setId(userDto.getId());
            usuarioResponse.setNome(userDto.getNome());
            usuarioResponse.setEmail(userDto.getEmail());
            usuarioResponse.setStatus(userDto.getStatus());
            usuarioResponse.setPerfil(userDto.getPerfil());
            usuarioResponse.setPerfilId(userDto.getPerfilId());
            usuarioResponse.setRoles(userDto.getRoles());
            usuarioResponse.setTelefone(userDto.getTelefone());
            usuarioResponse.setTeaCliId(userDto.getTeaCliId());
            result.setUser(usuarioResponse);
            return ResponseEntity.ok(result);
        } catch (ResponseStatusException e) {
            System.out.println("Falha no login para o email: " + request.getEmail() + " - " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.out.println("Erro inesperado no login: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao processar login", e);
        }
    }
}
