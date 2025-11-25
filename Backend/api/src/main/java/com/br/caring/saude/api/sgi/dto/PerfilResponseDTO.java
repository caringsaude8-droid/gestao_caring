package com.br.caring.saude.api.sgi.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PerfilResponseDTO {
    private  long id;
    private String nome;
    private String descricao;
}
