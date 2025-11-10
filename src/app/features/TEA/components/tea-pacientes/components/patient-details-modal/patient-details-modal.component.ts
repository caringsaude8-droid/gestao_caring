
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Patient } from '../patient-form-modal/patient-form-modal.component';

@Component({
  selector: 'app-patient-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-details-modal.component.html',
  styleUrls: ['./patient-details-modal.component.css']
})
export class PatientDetailsModalComponent {
  @Input() show: boolean = false;
  @Input() paciente: Patient | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() editPaciente = new EventEmitter<Patient>();

  onCloseModal(): void {
    this.close.emit();
  }

  onEditPaciente(): void {
    if (this.paciente) {
      this.editPaciente.emit(this.paciente);
      this.close.emit();
    }
  }

  onOverlayClick(event: Event): void {
    // Fecha o modal apenas se clicar no overlay (fundo)
    if (event.target === event.currentTarget) {
      this.onCloseModal();
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'ativo': 'Ativo',
      'inativo': 'Inativo'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }
}
