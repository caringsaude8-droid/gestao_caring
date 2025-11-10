import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../../shared/components/ui/card/card';
import { InputComponent } from '../../../shared/components/ui/input/input';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { LogoService } from '../../../shared/services/logo.service';

@Component({
  selector: 'app-configuracoes',
  imports: [CommonModule, FormsModule, CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, InputComponent, ButtonComponent],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css',
})
export class ConfiguracoesComponent implements OnInit {
  activeTab = 'geral';
  activeSubTab = 'identidade';
  
  // Form data
  logoFile: File | null = null;
  uploading = false;
  emailTeste = '';
  enviandoTeste = false;
  logoUrl: string | null = null;

  constructor(private logoService: LogoService) {}

  ngOnInit() {
    // Subscribe to logo changes
    this.logoService.logoUrl$.subscribe(logoUrl => {
      this.logoUrl = logoUrl;
    });
  }
  
  // Company info
  companyInfo = {
    name: 'Caring Saúde',
    phone: '(11) 99999-9999',
    address: 'Rua Exemplo, 123'
  };
  
  // Email config
  emailConfig = {
    host: 'smtp.exemplo.com',
    port: 587,
    security: 'tls',
    user: '',
    password: ''
  };
  
  // System preferences
  preferences = {
    timezone: 'America/Sao_Paulo',
    dateFormat: 'dd/mm/yyyy',
    language: 'pt-BR'
  };

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  setActiveSubTab(subTab: string) {
    this.activeSubTab = subTab;
  }

  onLogoFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        alert('Apenas arquivos de imagem são permitidos (PNG, JPG, JPEG, GIF, SVG)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('O arquivo deve ter no máximo 5MB');
        return;
      }

      this.logoFile = file;
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Just show preview, don't update the service yet
        const previewUrl = e.target.result;
        this.logoUrl = previewUrl;
      };
      reader.readAsDataURL(file);
    }
  }

  handleLogoUpload() {
    if (!this.logoFile) {
      alert('Selecione um arquivo de imagem');
      return;
    }

    this.uploading = true;
    
    // Simulate upload process with progress
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(uploadInterval);
        
        // In a real app, you would upload to a server or cloud storage
        // For now, we'll save the data URL and update the logo service
        if (this.logoUrl) {
          this.logoService.updateLogo(this.logoUrl);
          alert('Logo atualizada com sucesso! A nova logo será exibida em todo o sistema.');
        }
        
        this.uploading = false;
        this.logoFile = null;
        
        // Reset file input
        const fileInput = document.getElementById('logo') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    }, 200);
  }

  resetLogo() {
    this.logoService.resetToDefault();
    this.logoFile = null;
    
    // Reset file input
    const fileInput = document.getElementById('logo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    alert('Logo resetada para o padrão da Caring');
  }

  enviarEmailTeste() {
    if (!this.emailTeste.trim()) {
      alert('Digite um e-mail para teste');
      return;
    }

    if (!this.emailTeste.includes('@')) {
      alert('Digite um e-mail válido');
      return;
    }

    this.enviandoTeste = true;
    // Simulate email sending
    setTimeout(() => {
      alert('E-mail teste enviado com sucesso!');
      this.enviandoTeste = false;
      this.emailTeste = '';
    }, 2000);
  }

  salvarConfiguracoes() {
    alert('Configurações salvas com sucesso!');
  }

  salvarInformacoes() {
    alert('Informações da empresa salvas com sucesso!');
  }

  salvarPreferencias() {
    alert('Preferências salvas com sucesso!');
  }

  getCurrentDate() {
    return new Date().toLocaleDateString('pt-BR');
  }

  onImageError(event: any) {
    console.log('Erro ao carregar imagem:', event);
    // Fallback to default logo if image fails to load
    if (this.logoUrl !== 'assets/logoCaring.png') {
      this.logoService.resetToDefault();
      alert('Erro ao carregar a logo personalizada. Voltando para a logo padrão.');
    }
  }
}