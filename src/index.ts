import { Funcionario } from './models/Funcionario';
import {Cliente} from './models/Cliente';
import {Orcamento} from './models/Orcamento';
import { GeradorIDGeral } from './utils/GeradorID';
import { GerenciadorFuncionarios } from './services/GerenciadorFuncionarios';


const servico1 = new GerenciadorFuncionarios;
servico1.adicionar(new Funcionario("Jonathan",100,3));
console.log(servico1.listarTodos());