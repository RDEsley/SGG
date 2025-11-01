import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { LotesOvosService } from '../../services/lotes-ovos.service';
import { SnackbarService } from '../../shared/snackbar.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-lotes-ovos-list',
  templateUrl: './lotes-ovos-list.component.html',
  styleUrls: ['./lotes-ovos-list.component.css']
})
export class LotesOvosListComponent implements OnInit {
  displayedColumns: string[] = ['raca', 'data_compra', 'quantidade_comprada', 'quantidade_disponivel', 'valor_unitario_pago', 'valor_total', 'fornecedor', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = true;
  totalRecords = 0;
  pageSize = 10;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private lotesOvosService: LotesOvosService,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.loadLotes();
  }

  async loadLotes() {
    try {
      this.loading = true;
      const result = await this.lotesOvosService.getLotes(this.pageIndex, this.pageSize);
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

  novoLote() {
    this.router.navigate(['/lotes-ovos/novo']);
  }

  editarLote(lote: any) {
    this.router.navigate(['/lotes-ovos/editar', lote.id]);
  }

  async excluirLote(lote: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja realmente excluir o lote de ${lote.racas?.nome || 'ovos'}?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    const confirmed = await dialogRef.afterClosed().toPromise();
    if (confirmed) {
      try {
        await this.lotesOvosService.deleteLote(lote.id);
        this.snackbarService.showSuccess('Lote excluído com sucesso!');
        await this.loadLotes();
      } catch (error: any) {
        this.snackbarService.showError('Erro ao excluir lote: ' + error.message);
      }
    }
  }

  calcularValorTotal(lote: any): number {
    return lote.quantidade_comprada * lote.valor_unitario_pago;
  }
}
