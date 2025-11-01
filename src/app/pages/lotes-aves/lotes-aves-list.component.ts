import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { LotesAvesService } from '../../services/lotes-aves.service';
import { SnackbarService } from '../../shared/snackbar.service';

@Component({
  standalone: false,
  selector: 'app-lotes-aves-list',
  templateUrl: './lotes-aves-list.component.html',
  styleUrls: ['./lotes-aves-list.component.css']
})
export class LotesAvesListComponent implements OnInit {
  displayedColumns: string[] = ['raca', 'data_inicio', 'quantidade_inicial', 'quantidade_atual', 'mortalidade', 'taxa_sobrevivencia', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = true;
  totalRecords = 0;
  pageSize = 10;
  pageIndex = 0;
  loteSelecionado: any = null;
  mortalidades: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private lotesAvesService: LotesAvesService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.loadLotes();
  }

  async loadLotes() {
    try {
      this.loading = true;
      const result = await this.lotesAvesService.getLotes(this.pageIndex, this.pageSize);
      this.dataSource.data = result.data || [];
      this.totalRecords = result.count || 0;
    } catch (error: any) {
      this.snackbarService.showError('Erro ao carregar lotes: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  async onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    await this.loadLotes();
  }

  calcularMortalidade(lote: any): number {
    return lote.quantidade_inicial - lote.quantidade_atual;
  }

  calcularTaxaSobrevivencia(lote: any): number {
    if (lote.quantidade_inicial === 0) return 0;
    return (lote.quantidade_atual / lote.quantidade_inicial) * 100;
  }

  async verDetalhes(lote: any) {
    try {
      this.loteSelecionado = lote;
      this.mortalidades = await this.lotesAvesService.getMortalidadeByLote(lote.id);
    } catch (error: any) {
      this.snackbarService.showError('Erro ao carregar detalhes: ' + error.message);
    }
  }

  fecharDetalhes() {
    this.loteSelecionado = null;
    this.mortalidades = [];
  }

  async registrarMortalidade() {
    if (!this.loteSelecionado) return;

    const quantidade = prompt('Informe a quantidade de mortalidade:');
    if (quantidade === null) return;

    const qtd = parseInt(quantidade);
    if (isNaN(qtd) || qtd < 1 || qtd > this.loteSelecionado.quantidade_atual) {
      this.snackbarService.showError('Quantidade inválida');
      return;
    }

    const motivo = prompt('Informe o motivo da mortalidade:');
    if (!motivo) {
      this.snackbarService.showError('Motivo é obrigatório');
      return;
    }

    try {
      await this.lotesAvesService.registrarMortalidade(this.loteSelecionado.id, qtd, motivo);
      this.snackbarService.showSuccess('Mortalidade registrada com sucesso!');
      await this.loadLotes();
      if (this.loteSelecionado) {
        await this.verDetalhes(this.loteSelecionado);
      }
    } catch (error: any) {
      this.snackbarService.showError('Erro ao registrar mortalidade: ' + error.message);
    }
  }
}
