package com.br.caring.saude.api.sgi.dto;

import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class TeaPacienteRequestDTO {
    private String nome;
    private String cpf;
    private Date dataNascimento;
    private String email;
    private String senha;
    private String telefone;
    private String genero;
    private String cns;
    private String rg;
    private String tipoFaturamento;
    private String responsavelNome;
    private Date responsavelDataNascimento;
    private String responsavelCpf;
    private String responsavelCep;
    private String responsavelEstado;
    private String responsavelCidade;
    private String responsavelBairro;
    private String responsavelEndereco;
    private String responsavelComplemento;
    private String responsavelNumero;
    private String responsavelTipo;
    private String responsavelCpfCnpj;
    private String outrosDados;
    private String unidade;
    private Long clinicaId;
    private String convenio;
    private String tabelaConvenio;
    private String matriculaConvenio;
    private Date validadeConvenio;
    private String tipoCobranca;
    private Date inicioTratamento;
    private Date fimTratamento;
    private String protocolo;
    private Integer equipeAcomp;
    private String observacoes;
    private String espectro;
    private Long terapeutaId;
    private Integer status;
    private List<String> roles; // Permissões do paciente
}
