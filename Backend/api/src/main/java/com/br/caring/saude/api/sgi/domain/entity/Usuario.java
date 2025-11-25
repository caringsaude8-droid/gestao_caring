package com.br.caring.saude.api.sgi.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "SGI_USUARIOS")
public class Usuario {

    // Alterado: usar id como chave primária (String) para mapear a tabela existente
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USU_ID")
    @SequenceGenerator(name = "USU_ID", sequenceName = "USU_ID", allocationSize = 1)
    @Column(name = "USU_ID")
    private Long id;

    @Column(name = "USU_CPF", nullable = false, unique = true)
    private String cpf;

    @Column(name = "USU_NOME", nullable = false)
    private String nome;

    @Column(name = "USU_EMAIL", nullable = false, unique = true)
    private String email;

    @Column(name = "USU_SENHA", nullable = false)
    private String senha;

    @Column(name = "USU_STATUS", nullable = false)
    @Convert(converter = com.br.caring.saude.api.sgi.domain.converter.BooleanToIntegerConverter.class)
    private Boolean status = true;

    @Column(name = "USU_TELEFONE")
    private String telefone;

    // Usar relação ManyToOne para referenciar a entidade Perfil
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "PERFIL_ID", referencedColumnName = "PER_ID")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Perfil perfil;

    // Adicionado: referência à clínica
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "TEA_CLI_ID", referencedColumnName = "TEA_CLI_ID")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private TeaClinica teaClinica;
}
