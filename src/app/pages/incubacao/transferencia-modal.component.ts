import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IncubacaoService } from '../../services/incubacao.service';
import { SnackbarService } from '../../shared/snackbar.service';

@Component({
  standalone: false,
  selector: 'app-transferencia-modal',
  templateUrl: './transferencia-modal.component.html',
  styleUrls: ['./transferencia-modal.component.css']
})
export class TransferenciaModalComponent implements OnInit {
  transferenciaForm!: FormGroup;
  loading = false;
  chocadeirasDisponiveis: any[] = [];

  constructor(
    private fb: FormBuilder,
    private incubacaoService: IncubacaoService,
    private snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<TransferenciaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.chocadeirasDisponiveis = this.data.chocadeiras.filter(
      (c: any) => c.id !== this.data.alocacao.chocadeira_id
    );

    this.transferenciaForm = this.fb.group({
      nova_chocadeira_id: ['', Validators.required],
      quantidade: [
        this.data.alocacao.quantidade,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(this.data.alocacao.quantidade)
        ]
      ]
    });
  }

  async onSubmit() {
    if (this.transferenciaForm.invalid) {
      this.snackbarService.showWarning('Por favor, preencha todos os campos corretamente');
      return;
    }

    try {
      this.loading = true;
      const { nova_chocadeira_id, quantidade } = this.transferenciaForm.value;

      await this.incubacaoService.transferirAlocacao(
        this.data.alocacao.id,
        nova_chocadeira_id,
        quantidade
      );

      this.snackbarService.showSuccess('Transferência realizada com sucesso!');
      this.dialogRef.close(true);
    } catch (error: any) {
      this.snackbarService.showError('Erro ao transferir: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  getChocadeiraInfo(chocadeira: any): string {
    const disponivel = chocadeira.capacidade - (chocadeira.ocupacao_atual || 0);
    return `${chocadeira.nome} (${disponivel} disponíveis)`;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.transferenciaForm.get(fieldName);
    if (!field || !field.touched) return '';

    if (field.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    if (field.hasError('min')) {
      return 'Quantidade mínima: 1';
    }
    if (field.hasError('max')) {
      return `Quantidade máxima: ${this.data.alocacao.quantidade}`;
    }
    return '';
  }
}
