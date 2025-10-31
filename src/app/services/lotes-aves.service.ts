import { Injectable } from '@angular/core';
import { supabase } from './supabase-client';

export interface LoteAves {
  id?: string;
  raca_id: string;
  alocacao_incubacao_id?: string;
  quantidade_inicial: number;
  quantidade_atual: number;
  data_inicio: string;
  observacoes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LotesAvesService {

  async getLotes(page: number = 0, pageSize: number = 10) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('lotes_aves')
      .select('*, racas(nome)', { count: 'exact' })
      .order('data_inicio', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data, count };
  }

  async getLoteById(id: string) {
    const { data, error } = await supabase
      .from('lotes_aves')
      .select('*, racas(nome)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createLote(lote: LoteAves) {
    const { data, error } = await supabase
      .from('lotes_aves')
      .insert([lote])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateLote(id: string, lote: Partial<LoteAves>) {
    const loteAtual = await this.getLoteById(id);

    if (lote.quantidade_inicial && loteAtual) {
      if (lote.quantidade_inicial < loteAtual.quantidade_inicial) {
        throw new Error('Não é permitido reduzir a quantidade inicial do lote');
      }
    }

    const { data, error } = await supabase
      .from('lotes_aves')
      .update(lote)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async registrarMortalidade(loteId: string, quantidade: number, motivo: string) {
    const lote = await this.getLoteById(loteId);
    if (!lote) throw new Error('Lote não encontrado');

    if (quantidade > lote.quantidade_atual) {
      throw new Error('Quantidade de mortalidade maior que a quantidade atual do lote');
    }

    const { data, error } = await supabase
      .from('registros_mortalidade')
      .insert([{
        lote_aves_id: loteId,
        quantidade: quantidade,
        data_registro: new Date().toISOString().split('T')[0],
        motivo: motivo
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getMortalidadeByLote(loteId: string) {
    const { data, error } = await supabase
      .from('registros_mortalidade')
      .select('*')
      .eq('lote_aves_id', loteId)
      .order('data_registro', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
