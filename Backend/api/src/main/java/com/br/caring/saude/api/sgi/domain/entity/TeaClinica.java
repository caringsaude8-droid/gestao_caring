package com.br.caring.saude.api.sgi.domain.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "SGI_TEA_CLINICAS")
public class TeaClinica {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SGI_CLINICA_SEQ")
    @SequenceGenerator(name = "SGI_CLINICA_SEQ", sequenceName = "SGI_CLINICA_SEQ", allocationSize = 1)
    @Column(name = "TEA_CLI_ID")
    private Long id;

    @Column(name = "TEA_CLI_NOME", nullable = false)
    private String nome;

    @Column(name = "TEA_CLI_TELEFONE")
    private String telefone;

    @Column(name = "TEA_CLI_EMAIL")
    private String email;

    @Column(name = "TEA_CLI_ENDERECO")
    private String endereco;

    @Column(name = "TEA_CLI_CNPJ")
    private String cnpj;

    @Column(name = "TEA_CLI_DATA_CADASTRO")
    private java.sql.Date dataCadastro;

    @Column(name = "TEA_CLI_STATUS")
    private Integer status;
}
