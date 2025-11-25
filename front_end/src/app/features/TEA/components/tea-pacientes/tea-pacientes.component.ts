// ...existing code...
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientFormModalComponent } from './patient-form-modal/patient-form-modal.component';
import { Patient } from '../../models/patient.model';
import { PatientDetailsModalComponent } from './patient-details-modal/patient-details-modal.component';
import { PatientService } from '../../services/patient.service';

@Component({
	selector: 'app-tea-pacientes',
	standalone: true,
	imports: [CommonModule, FormsModule, PatientFormModalComponent, PatientDetailsModalComponent],
	templateUrl: './tea-pacientes.component.html',
	styleUrls: ['./tea-pacientes.component.css']
})
export class TeaPacientesComponent implements OnInit {
	public isLoading = false;
	private patientService = inject(PatientService);
	clinicaSelecionada: { nome: string } | null = null;
	searchTerm: string = '';
	selectedStatus: string = '';
	showPatientDetailsModal: boolean = false;
	showPatientFormModal: boolean = false;
	formMode: 'create' | 'edit' = 'create';
	selectedPatient: Patient | null = null;

	patients: Patient[] = [];

	filteredPatients: Patient[] = [];

	constructor() {}

	ngOnInit() {
		this.isLoading = true;
		// Busca a clínica selecionada do localStorage
		const selectedClinicaId = localStorage.getItem('selectedClinica');
		if (selectedClinicaId) {
			// Simula busca das clínicas (pode ser via service real)
			const clinicas = [
				{ id: '1', nome: 'Clínica Esperança' },
				{ id: '2', nome: 'Centro de Terapia Integrada' },
				{ id: '3', nome: 'Instituto Desenvolvimento' }
			];
			const clinica = clinicas.find(c => String(c.id) === String(selectedClinicaId));
			if (clinica) this.clinicaSelecionada = clinica;
		}
		// Busca pacientes da API filtrando por clínica
		this.patientService.getAll(selectedClinicaId ? String(selectedClinicaId) : undefined).subscribe({
			next: (patients) => {
				this.patients = patients;
				this.filteredPatients = [...this.patients];
				this.isLoading = false;
			},
			error: (err) => {
				this.patients = [];
				this.filteredPatients = [];
				this.isLoading = false;
			}
		});
	}

	onSearch(): void {
		this.filterPatients();
	}

	onStatusChange(): void {
		this.filterPatients();
	}

	private filterPatients(): void {
		this.filteredPatients = this.patients.filter(patient => {
			const matchesSearch = !this.searchTerm || 
				patient.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
				patient.email.toLowerCase().includes(this.searchTerm.toLowerCase());
			const matchesStatus = !this.selectedStatus || patient.status === this.selectedStatus;
			return matchesSearch && matchesStatus;
		});
	}

	clearFilters(): void {
		this.searchTerm = '';
		this.selectedStatus = '';
		this.filteredPatients = [...this.patients];
	}

	getStatusLabel(status: string): string {
		const labels: { [key: string]: string } = {
			'active': 'Ativo',
			'inactive': 'Inativo',
			'waiting': 'Em espera'
		};
		return labels[status] || status;
	}

		getStatusClass(status: string): string {
			if (status === 'active') return 'status-ativo';
			if (status === 'inactive') return 'status-inativo';
			if (status === 'waiting') return 'status-waiting';
			return '';
		}

	formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-BR');
	}

	openAddPatientModal(): void {
		this.formMode = 'create';
		this.selectedPatient = null;
		this.showPatientFormModal = true;
	}

	editPatient(patient: Patient): void {
		this.formMode = 'edit';
		this.selectedPatient = patient;
		this.showPatientFormModal = true;
		this.closePatientDetailsModal();
	}

	viewPatientDetails(patient: Patient): void {
		this.selectedPatient = patient;
		this.showPatientDetailsModal = true;
	}

	closePatientDetailsModal(): void {
		this.showPatientDetailsModal = false;
		this.selectedPatient = null;
	}

	closePatientFormModal(): void {
		this.showPatientFormModal = false;
		this.selectedPatient = null;
		this.formMode = 'create';
	}

	onSavePatient(patientData: Patient): void {
		   const clinica = this.clinicaSelecionada?.nome || 'Clínica Não Informada';
		   if (this.formMode === 'create') {
			   this.patients.push({
				   ...patientData,
				   clinica,
				   id: Date.now().toString(),
				   dataCriacao: new Date().toISOString(),
				   dataNascimento: patientData.birthDate
			   });
		   } else {
			   const index = this.patients.findIndex(p => p.id === patientData.id);
			   if (index !== -1) {
				   this.patients[index] = {
					   ...patientData,
					   clinica,
					   dataCriacao: this.patients[index].dataCriacao,
					   dataNascimento: patientData.birthDate
				   };
			   }
		   }
		this.closePatientFormModal();
		this.filterPatients();
		// Aqui você implementaria a chamada para a API
	}
}
