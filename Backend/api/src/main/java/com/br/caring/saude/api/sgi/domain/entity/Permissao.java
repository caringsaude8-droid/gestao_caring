package com.br.caring.saude.api.sgi.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "SGI_PERMISSAO")
public class Permissao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PERM_ID")
    private Long id;

    @Column(name = "PERM_NOME", nullable = false)
    private String nome;

    @Column(name = "PERM_DESCRICAO")
    private String descricao;

}

