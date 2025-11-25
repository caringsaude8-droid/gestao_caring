import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Patient } from '../../../models/patient.model';

@Component({
	selector: 'app-patient-form-modal',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: 'patient-form-modal.component.html',
	styleUrls: ['patient-form-modal.component.css']
})
export class PatientFormModalComponent implements OnInit, OnChanges {
		@Input() clinicaSelecionada: { nome: string } | null = null;
	@Input() show: boolean = false;
	@Input() patient: Patient | null = null;
	@Input() mode: 'create' | 'edit' = 'create';
	@Output() close = new EventEmitter<void>();
	@Output() save = new EventEmitter<Patient>();

	 formData: Partial<Patient> & { clinica?: string } = {};

	get modalTitle(): string {
		return this.mode === 'create' ? 'Novo Paciente' : 'Editar Paciente';
	}
	get submitButtonText(): string {
		return this.mode === 'create' ? 'Criar Paciente' : 'Salvar Alterações';
	}

	ngOnInit() {
		this.resetForm();
	}
	ngOnChanges() {
		if (this.show) {
			this.resetForm();
		}
	}

	resetForm(): void {
		const clinicaId = String(localStorage.getItem('selectedClinica') || '');
		if (this.mode === 'edit' && this.patient) {
			this.formData = { ...this.patient, clinica: this.patient.clinica || clinicaId };
		} else {
			this.formData = {
				nome: '',
				apelido: '',
				birthDate: '',
				age: 0,
				genero: undefined,
				spectrum: '',
				therapist: '',
				status: 'active',
				lastSession: '',
				progressLevel: 0,
				// pessoais
				cns: '',
				rg: '',
				tipoFaturamento: 'Manual',
				filiacao1Nome: '',
				filiacao1DataNascimento: '',
				filiacao1Cpf: '',
				filiacao2Nome: '',
				filiacao2Cpf: '',
				// endereço paciente
				enderecoCep: '',
				enderecoEstado: '',
				enderecoCidade: '',
				enderecoBairro: '',
				enderecoLogradouro: '',
				enderecoComplemento: '',
				enderecoNumeroCasa: '',
				// resp financeiro
				respFinanceiroTipo: 'Pessoa Física',
				respFinanceiroCpfCnpj: '',
				respFinanceiroNome: '',
				usarMesmoEnderecoPaciente: false,
				respEnderecoCep: '',
				respEnderecoEstado: '',
				respEnderecoCidade: '',
				respEnderecoBairro: '',
				// outros dados
				clinica: clinicaId,
				unidade: '',
				habilitaAgendamentoOutrasUnidades: false,
				unidadesAgendamentoPermitido: [],
				convenio: '',
				tabelaConvenio: 'Padrão',
				matriculaConvenio: '',
				validadeConvenio: '',
				tipoCobranca: 'Plano de Saúde',
				comoConheceuClinica: '',
				inicioTratamento: '',
				fimTratamento: '',
				hipoteseDiagnostica: '',
				realizaABA: false,
				realizaAcompanhamentoEquipe: false,
				ativo: true,
				terapeutaSolicitacao: ''
			};
		}
	}

	onClose(): void {
		this.close.emit();
	}

	onAvatarSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;
		const file = input.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			this.formData.avatar = reader.result as string;
		};
		reader.readAsDataURL(file);
	}

	removeAvatar(): void {
		this.formData.avatar = undefined;
	}

	onToggleMesmoEndereco(): void {
		if (this.formData.usarMesmoEnderecoPaciente) {
			this.formData.respEnderecoCep = this.formData.enderecoCep || '';
			this.formData.respEnderecoEstado = this.formData.enderecoEstado || '';
			this.formData.respEnderecoCidade = this.formData.enderecoCidade || '';
			this.formData.respEnderecoBairro = this.formData.enderecoBairro || '';
		}
	}

	onSubmit(): void {
		if (this.isFormValid()) {
			const patientData: Patient = {
				...this.formData as Patient,
				id: this.patient?.id || Date.now().toString(),
				progressLevel: this.formData.progressLevel ?? 0
			};
			this.save.emit(patientData);
		}
	}

	isFormValid(): boolean {
		return !!(
			this.formData.nome?.trim() &&
			this.formData.birthDate?.trim() &&
			this.formData.age &&
			this.formData.spectrum?.trim() &&
			this.formData.therapist?.trim() &&
			(this.formData.status === 'active' || this.formData.status === 'inactive' || this.formData.status === 'waiting') &&
			this.formData.lastSession?.trim() &&
			(this.formData.progressLevel !== undefined) &&
			this.formData.clinica?.trim()
		);
	}
}