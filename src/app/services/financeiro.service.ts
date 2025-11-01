import { Injectable } from '@angular/core';
import { supabase } from './supabase-client';

export interface DadosFinanceiros {
  receitaTotal: number;
  despesaTotal: number;
  lucroLiquido: number;
  vendasMes: Array<{ mes: string; valor: number }>;
  despesasMes: Array<{ mes: string; valor: number }>;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

  async getDadosFinanceiros(): Promise<DadosFinanceiros> {
    const vendas = await this.getVendas();
    const despesas = await this.getDespesas();

    const receitaTotal = vendas.reduce((sum, v) => sum + (v.valor_total || 0), 0);
    const despesaTotal = despesas.reduce((sum, d) => sum + (d.valor || 0), 0);

    const vendasPorMes = this.agruparPorMes(vendas, 'data_venda', 'valor_total');
    const despesasPorMes = this.agruparPorMes(despesas, 'data_despesa', 'valor');

    return {
      receitaTotal,
      despesaTotal,
      lucroLiquido: receitaTotal - despesaTotal,
      vendasMes: vendasPorMes,
      despesasMes: despesasPorMes
    };
  }

  private async getVendas() {
    const { data, error } = await supabase
      .from('vendas')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  private async getDespesas() {
    const { data, error } = await supabase
      .from('despesas')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  private agruparPorMes(items: any[], campoData: string, campoValor: string) {
    const meses: { [key: string]: number } = {};

    items.forEach(item => {
      const data = new Date(item[campoData]);
      const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      meses[mesAno] = (meses[mesAno] || 0) + (item[campoValor] || 0);
    });

    return Object.keys(meses)
      .sort()
      .map(mes => ({ mes, valor: meses[mes] }));
  }
}
