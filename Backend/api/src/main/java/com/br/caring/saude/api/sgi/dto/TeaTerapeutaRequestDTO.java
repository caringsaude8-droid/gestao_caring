package com.br.caring.saude.api.sgi.dto;

import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class TeaTerapeutaRequestDTO {
    private String nome;
    private String cpf;
    private String email;
    private String senha;
    private Date dataNascimento;
    private Integer status;
    private Long clinicaId;
    private Long usuId;
    private String telefone;
    private List<String> especialidades;
    private List<String> roles; // Permissões do terapeuta
}
