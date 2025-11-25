package com.br.caring.saude.api.sgi.dto;

import lombok.Data;
import java.sql.Date;

@Data
public class TeaClinicaResponseDTO {
    private Long id;
    private String nome;
    private String telefone;
    private String email;
    private String endereco;
    private String cnpj;
    private Date dataCadastro;
    private Integer status;
}

