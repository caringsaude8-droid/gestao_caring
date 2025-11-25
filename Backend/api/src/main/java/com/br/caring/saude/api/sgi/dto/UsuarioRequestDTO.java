package com.br.caring.saude.api.sgi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class UsuarioRequestDTO {

    @NotBlank(message = "O CPF é obrigatório")
    private String cpf;

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    private String senha;

    private Object perfil;  // Pode ser String (USER, ADMIN, GESTOR) ou Number (1, 2, 3)

    private String telefone;

    private List<String> roles; // Permissões a serem vinculadas ao usuário

    private Long teaCliId; // ID da clínica
}
