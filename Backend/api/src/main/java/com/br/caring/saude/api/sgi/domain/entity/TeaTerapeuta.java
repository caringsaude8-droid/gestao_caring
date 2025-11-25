package com.br.caring.saude.api.sgi.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "SGI_TEA_TERAPEUTA")
public class TeaTerapeuta {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SGI_TERAPEUTA_SEQ")
    @SequenceGenerator(name = "SGI_TERAPEUTA_SEQ", sequenceName = "SGI_TERAPEUTA_SEQ", allocationSize = 1)
    @Column(name = "TEA_TER_ID")
    private Long id;

    @Column(name = "TEA_TER_NOME", nullable = false)
    private String nome;

    @Column(name = "TEA_TER_CPF")
    private String cpf;

    @Column(name = "TEA_TER_EMAIL")
    private String email;

    @Column(name = "TEA_TER_SENHA")
    private String senha;

    @Column(name = "TEA_TER_DATA_NASCIMENTO")
    private Date dataNascimento;

    @Column(name = "TEA_TER_STATUS")
    private Integer status;

    @Column(name = "TEA_TER_CLINICA_ID", nullable = false)
    private Long clinicaId;

    @Column(name = "TEA_TER_TELEFONE")
    private String telefone;

    @Column(name = "TEA_TER_ESPECIALIDADES")
    private String especialidades;

    @Column(name = "PERFIL_ID")
    private Long perfilId;

    @Transient
    private java.util.List<String> roles;
}
