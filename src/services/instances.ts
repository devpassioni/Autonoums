//implementando um singleton para conseguir utilizar obras


import { GerenciadorOrcamento } from './GerenciadorOrcamento';
import { GerenciarObras }       from './GerenciarObra';
import { GerenciadorFuncionarios } from './GerenciadorFuncionarios';

export const orcamentosService  = new GerenciadorOrcamento();
export const obrasService       = new GerenciarObras();
export const funcionariosService = new GerenciadorFuncionarios();