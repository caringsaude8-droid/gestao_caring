import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientFormModalComponent, Patient } from './components/patient-form-modal/patient-form-modal.component';
import { PatientDetailsModalComponent } from './components/patient-details-modal/patient-details-modal.component';

@Component({
	selector: 'app-tea-pacientes',
	standalone: true,
	imports: [CommonModule, FormsModule, PatientFormModalComponent, PatientDetailsModalComponent],
	templateUrl: './tea-pacientes.component.html',
	styleUrls: ['./tea-pacientes.component.css']
})
export class TeaPacientesComponent implements OnInit {
	searchTerm: string = '';
	selectedStatus: string = '';
	showPatientDetailsModal: boolean = false;
	showPatientFormModal: boolean = false;
	formMode: 'create' | 'edit' = 'create';
	selectedPatient: Patient | null = null;

	patients: Patient[] = [
		{
			id: '1',
			nome: 'Ana Souza',
			cpf: '123.456.789-00',
			email: 'ana.souza@caring.com',
			telefone: '(11) 99999-0001',
			birthDate: '2015-05-10',
			age: 10,
			spectrum: 'Moderado',
			therapist: 'Dr. Pedro Lima Costa',
			status: 'active',
			lastSession: '2024-10-20',
			progressLevel: 3,
			dataNascimento: '2015-05-10',
			dataCriacao: '2023-03-20'
		},
		{
			id: '2',
			nome: 'Lucas Pereira',
			cpf: '987.654.321-00',
			email: 'lucas.pereira@caring.com',
			telefone: '(11) 99999-0002',
			birthDate: '2012-08-15',
			age: 13,
			spectrum: 'Leve',
			therapist: 'Julia Ferreira',
			status: 'inactive',
			lastSession: '2024-09-10',
			progressLevel: 2,
			dataNascimento: '2012-08-15',
			dataCriacao: '2023-04-10'
		}
	];

	filteredPatients: Patient[] = [];

	constructor() {}

	ngOnInit() {
		this.filteredPatients = [...this.patients];
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
		if (this.formMode === 'create') {
			this.patients.push({
				...patientData,
				id: Date.now().toString(),
				dataCriacao: new Date().toISOString(),
				dataNascimento: patientData.birthDate
			});
		} else {
			const index = this.patients.findIndex(p => p.id === patientData.id);
			if (index !== -1) {
				this.patients[index] = {
					...patientData,
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
