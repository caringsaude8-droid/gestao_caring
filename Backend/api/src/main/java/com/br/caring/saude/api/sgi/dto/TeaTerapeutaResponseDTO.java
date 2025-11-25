package com.br.caring.saude.api.sgi.dto;

import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class TeaTerapeutaResponseDTO {
    private Long id;
    private String nome;
    private String cpf;
    private String email;
    private Date dataNascimento;
    private String status;
    private Long clinicaId;
    private Long usuId;
    private String telefone;
    private List<String> especialidades;
    private Long perfilId;
    private List<String> roles; // Permissões do terapeuta
}
