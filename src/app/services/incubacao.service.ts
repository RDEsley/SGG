import { Injectable } from '@angular/core';
import { supabase } from './supabase-client';

export interface Chocadeira {
  id?: string;
  nome: string;
  capacidade: number;
  ocupacao_atual?: number;
}

export interface Alocacao {
  id?: string;
  lote_ovos_id: string;
  chocadeira_id: string;
  quantidade: number;
  data_entrada: string;
  data_previsao_nascimento: string;
  temperatura?: number;
  umidade?: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class IncubacaoService {

  async getChocadeiras() {
    const { data, error } = await supabase
      .from('chocadeiras')
      .select('*')
      .order('nome');

    if (error) throw error;
    return data || [];
  }

  async getChocadeiraById(id: string) {
    const { data, error } = await supabase
      .from('chocadeiras')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getAlocacoes() {
    const { data, error } = await supabase
      .from('alocacoes_incubacao')
      .select(`
        *,
        lotes_ovos(id, racas(nome)),
        chocadeiras(nome, capacidade)
      `)
      .order('data_entrada', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createAlocacao(alocacao: Alocacao) {
    const chocadeira = await this.getChocadeiraById(alocacao.chocadeira_id);
    if (!chocadeira) {
      throw new Error('Chocadeira não encontrada');
    }

    const ocupacaoAtual = chocadeira.ocupacao_atual || 0;
    if (ocupacaoAtual + alocacao.quantidade > chocadeira.capacidade) {
      throw new Error('Capacidade da chocadeira excedida');
    }

    const { data, error } = await supabase
      .from('alocacoes_incubacao')
      .insert([alocacao])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async transferirAlocacao(alocacaoId: string, novaChocadeiraId: string, quantidade: number) {
    const { data: alocacao, error: alocacaoError } = await supabase
      .from('alocacoes_incubacao')
      .select('*')
      .eq('id', alocacaoId)
      .maybeSingle();

    if (alocacaoError) throw alocacaoError;
    if (!alocacao) throw new Error('Alocação não encontrada');

    if (quantidade > alocacao.quantidade) {
      throw new Error('Quantidade a transferir maior que a disponível');
    }

    const novaChocadeira = await this.getChocadeiraById(novaChocadeiraId);
    if (!novaChocadeira) throw new Error('Chocadeira de destino não encontrada');

    const ocupacaoAtual = novaChocadeira.ocupacao_atual || 0;
    if (ocupacaoAtual + quantidade > novaChocadeira.capacidade) {
      throw new Error('Capacidade da chocadeira de destino excedida');
    }

    const { data: novaAlocacao, error: insertError } = await supabase
      .from('alocacoes_incubacao')
      .insert([{
        lote_ovos_id: alocacao.lote_ovos_id,
        chocadeira_id: novaChocadeiraId,
        quantidade: quantidade,
        data_entrada: new Date().toISOString().split('T')[0],
        data_previsao_nascimento: alocacao.data_previsao_nascimento,
        temperatura: alocacao.temperatura,
        umidade: alocacao.umidade,
        status: alocacao.status
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    if (quantidade === alocacao.quantidade) {
      const { error: deleteError } = await supabase
        .from('alocacoes_incubacao')
        .delete()
        .eq('id', alocacaoId);
      if (deleteError) throw deleteError;
    } else {
      const { error: updateError } = await supabase
        .from('alocacoes_incubacao')
        .update({ quantidade: alocacao.quantidade - quantidade })
        .eq('id', alocacaoId);
      if (updateError) throw updateError;
    }

    return novaAlocacao;
  }

  async finalizarIncubacao(alocacaoId: string, quantidadeNascida: number) {
    const { data, error } = await supabase
      .from('alocacoes_incubacao')
      .update({
        status: 'finalizado',
        quantidade_nascida: quantidadeNascida,
        data_finalizacao: new Date().toISOString().split('T')[0]
      })
      .eq('id', alocacaoId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
