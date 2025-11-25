package com.br.caring.saude.api.sgi.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "SGI_TEA_PACIENTES")
public class TeaPaciente {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SGI_PACIENTES_SEQ")
    @SequenceGenerator(name = "SGI_PACIENTES_SEQ", sequenceName = "SGI_PACIENTES_SEQ", allocationSize = 1)
    @Column(name = "TEA_PAC_ID")
    private Long id;

    @Column(name = "TEA_PAC_NOME", nullable = false)
    private String nome;

    @Column(name = "TEA_PAC_CPF")
    private String cpf;

    @Column(name = "TEA_PAC_DATA_NASCIMENTO")
    private Date dataNascimento;

    @Column(name = "TEA_PAC_EMAIL")
    private String email;

    @Column(name = "TEA_PAC_SENHA")
    private String senha;

    @Column(name = "TEA_PAC_TELEFONE")
    private String telefone;

    @Column(name = "TEA_PAC_GENERO")
    private String genero;

    @Column(name = "TEA_PAC_CNS")
    private String cns;

    @Column(name = "TEA_PAC_RG")
    private String rg;

    @Column(name = "TEA_PAC_TIPO_FATURAMENTO")
    private String tipoFaturamento;

    @Column(name = "TEA_PAC_RESP_NOME")
    private String responsavelNome;

    @Column(name = "TEA_PAC_RESP_DATA_NASCIMENTO")
    private Date responsavelDataNascimento;

    @Column(name = "TEA_PAC_RESP_CPF")
    private String responsavelCpf;

    @Column(name = "TEA_PAC_RESP_CEP")
    private String responsavelCep;

    @Column(name = "TEA_PAC_RESP_ESTADO")
    private String responsavelEstado;

    @Column(name = "TEA_PAC_RESP_CIDADE")
    private String responsavelCidade;

    @Column(name = "TEA_PAC_RESP_BAIRRO")
    private String responsavelBairro;

    @Column(name = "TEA_PAC_RESP_ENDERECO")
    private String responsavelEndereco;

    @Column(name = "TEA_PAC_RESP_COMPLEMENTO")
    private String responsavelComplemento;

    @Column(name = "TEA_PAC_RESP_NUMERO")
    private String responsavelNumero;

    @Column(name = "TEA_PAC_RESP_TIPO")
    private String responsavelTipo;

    @Column(name = "TEA_PAC_RESP_CPF_CNPJ")
    private String responsavelCpfCnpj;

    @Column(name = "TEA_PAC_OUTROS_DADOS")
    private String outrosDados;

    @Column(name = "TEA_PAC_UNIDADE")
    private String unidade;

    @Column(name = "TEA_PAC_CLINICA_ID", nullable = false)
    private Long clinicaId;

    @Column(name = "TEA_PAC_CONVENIO")
    private String convenio;

    @Column(name = "TEA_PAC_TABELA_CONVENIO")
    private String tabelaConvenio;

    @Column(name = "TEA_PAC_MATRICULA_CONVENIO")
    private String matriculaConvenio;

    @Column(name = "TEA_PAC_VALIDADE_CONVENIO")
    private Date validadeConvenio;

    @Column(name = "TEA_PAC_TIPO_COBRANCA")
    private String tipoCobranca;

    @Column(name = "TEA_PAC_INICIO_TRATAMENTO")
    private Date inicioTratamento;

    @Column(name = "TEA_PAC_FIM_TRATAMENTO")
    private Date fimTratamento;

    @Column(name = "TEA_PAC_PROTOCOLO")
    private String protocolo;

    @Column(name = "TEA_PAC_EQUIPE_ACOMP")
    private Integer equipeAcomp;

    @Column(name = "TEA_PAC_OBSERVACOES")
    private String observacoes;

    @Column(name = "TEA_PAC_ESPECTRO")
    private String espectro;

    @Column(name = "TEA_PAC_TERAPEUTA")
    private Long terapeutaId;

    @Column(name = "TEA_PAC_STATUS")
    private Integer status;

    @Transient
    private java.util.List<String> roles;
}
