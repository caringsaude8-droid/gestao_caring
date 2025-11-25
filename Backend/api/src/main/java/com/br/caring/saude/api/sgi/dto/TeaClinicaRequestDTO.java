package com.br.caring.saude.api.sgi.dto;

import lombok.Data;
import java.sql.Date;

@Data
public class TeaClinicaRequestDTO {
    private String nome;
    private String telefone;
    private String email;
    private String endereco;
    private String cnpj;
    private String dataCadastro;
    private Integer status;
}
