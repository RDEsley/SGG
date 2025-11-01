import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { IncubacaoService } from '../../services/incubacao.service';
import { SnackbarService } from '../../shared/snackbar.service';
import { TransferenciaModalComponent } from './transferencia-modal.component';

@Component({
  standalone: false,
  selector: 'app-chocadeiras-list',
  templateUrl: './chocadeiras-list.component.html',
  styleUrls: ['./chocadeiras-list.component.css']
})
export class ChocadeirasListComponent implements OnInit {
  chocadeiras: any[] = [];
  alocacoes: any[] = [];
  loading = true;

  constructor(
    private incubacaoService: IncubacaoService,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    try {
      this.loading = true;
      this.chocadeiras = await this.incubacaoService.getChocadeiras();
      this.alocacoes = await this.incubacaoService.getAlocacoes();
    } catch (error: any) {
      this.snackbarService.showError('Erro ao carregar dados: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  novaAlocacao() {
    this.router.navigate(['/incubacao/alocar']);
  }

  getAlocacoesPorChocadeira(chocadeiraId: string) {
    return this.alocacoes.filter(a => a.chocadeira_id === chocadeiraId && a.status === 'incubando');
  }

  calcularOcupacao(chocadeira: any): number {
    const alocacoes = this.getAlocacoesPorChocadeira(chocadeira.id);
    return alocacoes.reduce((sum, a) => sum + (a.quantidade || 0), 0);
  }

  calcularPercentualOcupacao(chocadeira: any): number {
    const ocupacao = this.calcularOcupacao(chocadeira);
    return (ocupacao / chocadeira.capacidade) * 100;
  }

  getStatusColor(chocadeira: any): string {
    const percentual = this.calcularPercentualOcupacao(chocadeira);
    if (percentual >= 90) return '#f44336';
    if (percentual >= 70) return '#ff9800';
    return '#4caf50';
  }

  async transferir(alocacao: any) {
    const dialogRef = this.dialog.open(TransferenciaModalComponent, {
      width: '500px',
      data: {
        alocacao,
        chocadeiras: this.chocadeiras
      }
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      await this.loadData();
    }
  }

  async finalizarIncubacao(alocacao: any) {
    try {
      const quantidadeNascida = prompt('Informe a quantidade de aves nascidas:');
      if (quantidadeNascida === null) return;

      const qtd = parseInt(quantidadeNascida);
      if (isNaN(qtd) || qtd < 0 || qtd > alocacao.quantidade) {
        this.snackbarService.showError('Quantidade inválida');
        return;
      }

      await this.incubacaoService.finalizarIncubacao(alocacao.id, qtd);
      this.snackbarService.showSuccess('Incubação finalizada com sucesso!');
      await this.loadData();
    } catch (error: any) {
      this.snackbarService.showError('Erro ao finalizar incubação: ' + error.message);
    }
  }

  getDiasRestantes(dataPrevisao: string): number {
    const hoje = new Date();
    const previsao = new Date(dataPrevisao);
    const diff = previsao.getTime() - hoje.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
