export interface Patient {
	clinica: string;
	id: string;
	nome: string;
	apelido?: string;
	cpf: string;
	email: string;
	telefone: string;
	birthDate: string;
	age: number;
	genero?: 'Masculino' | 'Feminino';
	spectrum: string;
	therapist: string;
	status: 'active' | 'inactive' | 'waiting';
	lastSession: string;
	progressLevel: number;
	avatar?: string;
	especialidades?: string[];
	observacoes?: string;
	dataNascimento: string;
	dataCriacao: string;
	// Pessoais
	cns?: string;
	rg?: string;
	tipoFaturamento?: 'Manual' | 'Automático' | 'Outro';
	filiacao1Nome?: string;
	filiacao1DataNascimento?: string;
	filiacao1Cpf?: string;
	filiacao2Nome?: string;
	filiacao2Cpf?: string;
	// Endereço Paciente
	enderecoCep?: string;
	enderecoEstado?: string;
	enderecoCidade?: string;
	enderecoBairro?: string;
	enderecoLogradouro?: string;
	enderecoComplemento?: string;
	enderecoNumeroCasa?: string;
	// Responsável Financeiro
	respFinanceiroTipo?: 'Pessoa Física' | 'Pessoa Jurídica';
	respFinanceiroCpfCnpj?: string;
	respFinanceiroNome?: string;
	usarMesmoEnderecoPaciente?: boolean;
	respEnderecoCep?: string;
	respEnderecoEstado?: string;
	respEnderecoCidade?: string;
	respEnderecoBairro?: string;
	// Outros Dados
	unidade?: string;
	habilitaAgendamentoOutrasUnidades?: boolean;
	unidadesAgendamentoPermitido?: string[];
	convenio?: string;
	tabelaConvenio?: string;
	matriculaConvenio?: string;
	validadeConvenio?: string;
	tipoCobranca?: string;
	comoConheceuClinica?: string;
	inicioTratamento?: string;
	fimTratamento?: string;
	hipoteseDiagnostica?: string;
	realizaABA?: boolean;
	realizaAcompanhamentoEquipe?: boolean;
	ativo?: boolean;
	terapeutaSolicitacao?: string;

}
