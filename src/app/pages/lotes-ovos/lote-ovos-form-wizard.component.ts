import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LotesOvosService } from '../../services/lotes-ovos.service';
import { SnackbarService } from '../../shared/snackbar.service';

@Component({
  selector: 'app-lote-ovos-form-wizard',
  templateUrl: './lote-ovos-form-wizard.component.html',
  styleUrls: ['./lote-ovos-form-wizard.component.css']
})
export class LoteOvosFormWizardComponent implements OnInit {
  loteForm!: FormGroup;
  racas: any[] = [];
  loading = false;
  isEditMode = false;
  loteId: string | null = null;
  quantidadeAlocadaOriginal = 0;

  constructor(
    private fb: FormBuilder,
    private lotesOvosService: LotesOvosService,
    private snackbarService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.initForm();
    await this.loadRacas();

    this.loteId = this.route.snapshot.paramMap.get('id');
    if (this.loteId) {
      this.isEditMode = true;
      await this.loadLote(this.loteId);
    }
  }

  initForm() {
    this.loteForm = this.fb.group({
      raca_id: ['', Validators.required],
      quantidade_comprada: ['', [Validators.required, Validators.min(1)]],
      preco_unitario: ['', [Validators.required, Validators.min(0.01)]],
      fornecedor: ['', [Validators.required, Validators.maxLength(200)]],
      data_compra: [new Date(), Validators.required],
      observacoes: ['', Validators.maxLength(500)]
    });

    this.loteForm.get('quantidade_comprada')?.valueChanges.subscribe(value => {
      if (this.isEditMode && value < this.quantidadeAlocadaOriginal) {
        this.loteForm.get('quantidade_comprada')?.setErrors({
          menorQueAlocado: true
        });
      }
    });
  }

  async loadRacas() {
    try {
      this.racas = await this.lotesOvosService.getRacas();
    } catch (error: any) {
      this.snackbarService.showError('Erro ao carregar raças: ' + error.message);
    }
  }

  async loadLote(id: string) {
    try {
      this.loading = true;
      const lote = await this.lotesOvosService.getLoteById(id);
      if (lote) {
        this.quantidadeAlocadaOriginal = lote.quantidade_alocada || 0;

        this.loteForm.patchValue({
          raca_id: lote.raca_id,
          quantidade_comprada: lote.quantidade_comprada,
          preco_unitario: lote.preco_unitario,
          fornecedor: lote.fornecedor,
          data_compra: new Date(lote.data_compra),
          observacoes: lote.observacoes
        });
      }
    } catch (error: any) {
      this.snackbarService.showError('Erro ao carregar lote: ' + error.message);
      this.router.navigate(['/lotes-ovos']);
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    if (this.loteForm.invalid) {
      this.markFormGroupTouched(this.loteForm);
      this.snackbarService.showWarning('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      this.loading = true;
      const formValue = this.loteForm.value;
      const loteData = {
        ...formValue,
        data_compra: this.formatDate(formValue.data_compra)
      };

      if (this.isEditMode && this.loteId) {
        await this.lotesOvosService.updateLote(this.loteId, loteData);
        this.snackbarService.showSuccess('Lote atualizado com sucesso!');
      } else {
        await this.lotesOvosService.createLote(loteData);
        this.snackbarService.showSuccess('Lote cadastrado com sucesso!');
      }

      this.router.navigate(['/lotes-ovos']);
    } catch (error: any) {
      this.snackbarService.showError('Erro ao salvar lote: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  onCancel() {
    this.router.navigate(['/lotes-ovos']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loteForm.get(fieldName);
    if (!field || !field.touched) return '';

    if (field.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    if (field.hasError('min')) {
      return 'Valor mínimo não atingido';
    }
    if (field.hasError('maxLength')) {
      return 'Tamanho máximo excedido';
    }
    if (field.hasError('menorQueAlocado')) {
      return `Quantidade não pode ser menor que ${this.quantidadeAlocadaOriginal} (já alocado)`;
    }
    return '';
  }

  calcularValorTotal(): number {
    const quantidade = this.loteForm.get('quantidade_comprada')?.value || 0;
    const preco = this.loteForm.get('preco_unitario')?.value || 0;
    return quantidade * preco;
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
