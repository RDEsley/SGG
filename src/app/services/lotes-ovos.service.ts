import { Injectable } from '@angular/core';
import { supabase } from './supabase-client';

export interface LoteOvos {
  id?: string;
  raca_id: string;
  quantidade_comprada: number;
  valor_unitario_pago: number;
  fornecedor: string;
  data_compra: string;
  observacoes?: string;
  quantidade_disponivel?: number;
  quantidade_alocada?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LotesOvosService {

  async getLotes(page: number = 0, pageSize: number = 10) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('lotes_ovos')
      .select('*, racas(nome)', { count: 'exact' })
      .order('data_compra', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data, count };
  }

  async getLoteById(id: string) {
    const { data, error } = await supabase
      .from('lotes_ovos')
      .select('*, racas(nome)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createLote(lote: LoteOvos) {
    const { data, error } = await supabase
      .from('lotes_ovos')
      .insert([lote])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateLote(id: string, lote: Partial<LoteOvos>) {
    const { data, error } = await supabase
      .from('lotes_ovos')
      .update(lote)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteLote(id: string) {
    const { error } = await supabase
      .from('lotes_ovos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getRacas() {
    const { data, error } = await supabase
      .from('racas')
      .select('*')
      .order('nome');

    if (error) throw error;
    return data || [];
  }
}
