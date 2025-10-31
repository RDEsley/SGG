import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { FinanceiroService } from '../../services/financeiro.service';
import { SnackbarService } from '../../shared/snackbar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = true;

  stats = {
    receitaTotal: 0,
    despesaTotal: 0,
    lucroLiquido: 0,
    taxaSucesso: 85
  };

  lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Receitas',
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true
      },
      {
        data: [],
        label: 'Despesas',
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        fill: true
      }
    ],
    labels: []
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return 'R$ ' + value.toLocaleString('pt-BR');
          }
        }
      }
    }
  };

  pieChartData: ChartConfiguration['data'] = {
    labels: ['Nascidos', 'Não Eclodidos'],
    datasets: [{
      data: [850, 150],
      backgroundColor: ['#4caf50', '#ff9800']
    }]
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  constructor(
    private financeiroService: FinanceiroService,
    private snackbarService: SnackbarService
  ) {}

  async ngOnInit() {
    await this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      this.loading = true;
      const dados = await this.financeiroService.getDadosFinanceiros();

      this.stats.receitaTotal = dados.receitaTotal;
      this.stats.despesaTotal = dados.despesaTotal;
      this.stats.lucroLiquido = dados.lucroLiquido;

      const meses = dados.vendasMes.map(v => {
        const [ano, mes] = v.mes.split('-');
        return `${mes}/${ano}`;
      });

      this.lineChartData = {
        labels: meses,
        datasets: [
          {
            data: dados.vendasMes.map(v => v.valor),
            label: 'Receitas',
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            fill: true
          },
          {
            data: dados.despesasMes.map(d => d.valor),
            label: 'Despesas',
            borderColor: '#f44336',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            fill: true
          }
        ]
      };

    } catch (error: any) {
      this.snackbarService.showError('Erro ao carregar dados do dashboard: ' + error.message);
    } finally {
      this.loading = false;
    }
  }
}
