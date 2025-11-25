package com.br.caring.saude.api.sgi.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "SGI_PERFIL")
public class Perfil {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SGI_PERFIL_SEQ")
    @SequenceGenerator(name = "SGI_PERFIL_SEQ", sequenceName = "SGI_PERFIL_SEQ", allocationSize = 1)
    @Column(name = "PER_ID")
    private Long id;

    @Column(name = "PER_NOME", nullable = false, unique = true)
    private String nome;

    @Column(name = "PER_DESCRICAO")
    private String descricao;

    public Perfil(String nome, String descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }
}
