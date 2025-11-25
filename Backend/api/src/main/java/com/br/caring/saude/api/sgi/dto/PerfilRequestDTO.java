package com.br.caring.saude.api.sgi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.sql.Date;
@Data
public class PerfilRequestDTO {
    @NotBlank
    @Size(max = 50)
    private String nome;

    @Size(max = 255)
    private String descricao;
}
