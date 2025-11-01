import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IncubacaoService } from '../../services/incubacao.service';
import { LotesOvosService } from '../../services/lotes-ovos.service';
import { SnackbarService } from '../../shared/snackbar.service';

@Component({
  standalone: false,
  selector: 'app-alocacao-form',
  templateUrl: './alocacao-form.component.html',
  styleUrls: ['./alocacao-form.component.css']
})
export class AlocacaoFormComponent implements OnInit {
  alocacaoForm!: FormGroup;
  chocadeiras: any[] = [];
  lotesOvos: any[] = [];
  loading = false;
  capacidadeDisponivel = 0;

  constructor(
    private fb: FormBuilder,
    private incubacaoService: IncubacaoService,
    private lotesOvosService: LotesOvosService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.initForm();
    await this.loadData();
  }

  initForm() {
    const hoje = new Date();
    const dataPrevisao = new Date();
    dataPrevisao.setDate(hoje.getDate() + 21);

    this.alocacaoForm = this.fb.group({
      lote_ovos_id: ['', Validators.required],
      chocadeira_id: ['', Validators.required],
      quantidade: ['', [Validators.required, Validators.min(1)]],
      data_entrada: [hoje, Validators.required],
      data_previsao_nascimento: [dataPrevisao, Validators.required],
      temperatura: [37.5, [Validators.min(30), Validators.max(45)]],
      umidade: [60, [Validators.min(0), Validators.max(100)]],
      status: ['incubando']
    });

    this.alocacaoForm.get('chocadeira_id')?.valueChanges.subscribe(() => {
      this.updateCapacidadeDisponivel();
    });

    this.alocacaoForm.get('quantidade')?.valueChanges.subscribe(value => {
      if (value > this.capacidadeDisponivel) {
        this.alocacaoForm.get('quantidade')?.setErrors({ excedeuCapacidade: true });
      }
    });
  }

  async loadData() {
    try {
      this.loading = true;
      this.chocadeiras = await this.incubacaoService.getChocadeiras();
      const result = await this.lotesOvosService.getLotes(0, 100);
      this.lotesOvos = (result.data || []).filter((l: any) => (l.quantidade_disponivel || 0) > 0);
    } catch (error: any) {
      this.snackbarService.showError('Erro ao carregar dados: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  updateCapacidadeDisponivel() {
    const chocadeiraId = this.alocacaoForm.get('chocadeira_id')?.value;
    if (!chocadeiraId) {
      this.capacidadeDisponivel = 0;
      return;
    }

    const chocadeira = this.chocadeiras.find(c => c.id === chocadeiraId);
    if (chocadeira) {
      this.capacidadeDisponivel = chocadeira.capacidade - (chocadeira.ocupacao_atual || 0);
    }
  }

  getLoteInfo(loteId: string): string {
    const lote = this.lotesOvos.find(l => l.id === loteId);
    if (!lote) return '';
    return `${lote.racas?.nome || 'Raça não definida'} - ${lote.quantidade_disponivel || 0} disponíveis`;
  }

  async onSubmit() {
    if (this.alocacaoForm.invalid) {
      this.markFormGroupTouched(this.alocacaoForm);
      this.snackbarService.showWarning('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      this.loading = true;
      const formValue = this.alocacaoForm.value;
      const alocacaoData = {
        ...formValue,
        data_entrada: this.formatDate(formValue.data_entrada),
        data_previsao_nascimento: this.formatDate(formValue.data_previsao_nascimento)
      };

      await this.incubacaoService.createAlocacao(alocacaoData);
      this.snackbarService.showSuccess('Alocação criada com sucesso!');
      this.router.navigate(['/incubacao']);
    } catch (error: any) {
      this.snackbarService.showError('Erro ao criar alocação: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  onCancel() {
    this.router.navigate(['/incubacao']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.alocacaoForm.get(fieldName);
    if (!field || !field.touched) return '';

    if (field.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    if (field.hasError('min')) {
      return 'Valor mínimo não atingido';
    }
    if (field.hasError('max')) {
      return 'Valor máximo excedido';
    }
    if (field.hasError('excedeuCapacidade')) {
      return `Capacidade disponível: ${this.capacidadeDisponivel}`;
    }
    return '';
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
