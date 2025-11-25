package com.br.caring.saude.api.sgi.dto;

import lombok.Data;

import java.util.List;

@Data
public class LoginResponseDTO {
    private UsuarioResponseDTO user;
    private String token;
    private String refreshToken;

    @Data
    public static class UsuarioResponseDTO {
        private Long id;
        private String cpf;
        private String nome;
        private String email;
        private Boolean status;
        private String perfil;
        private Long perfilId;
        private List<String> roles;
        private String telefone;
        private Long teaCliId;
    }
}
