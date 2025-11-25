package com.br.caring.saude.api.sgi.dto;

import java.util.List;

import lombok.Data;

@Data
public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private Boolean status;
    private String perfil;  // Nome do perfil (ex: USER, ADMIN)
    private Long perfilId; // Adicionado para expor o ID do perfil
    private List<String> roles; // Permissões do usuário
    private String telefone;
    private Long teaCliId; // ID da clínica vinculada ao usuário
}
