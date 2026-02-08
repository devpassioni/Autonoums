import { Funcionario } from './models/Funcionario';
import {Cliente} from './models/Cliente';
import {Orcamento} from './models/Orcamento';
import { GeradorIDGeral } from './utils/GeradorID';

const seila = new Funcionario("Jonathan",20,30);
const seila6 = new Funcionario("Marcondes",400,1);
const seila8 = new Funcionario("Marcondes3",299,1);

seila.realizarFechamento()
seila.exibirDetalhes()

const seila2 = new Cliente("Joaozim","33213","Rua Pepino, 32", "Pessoa Fisica");
const orcamento1 = new Orcamento(seila2,4);
orcamento1.adicionarFuncionario(seila6);
orcamento1.adicionarFuncionario(seila8);



orcamento1.adicionarServico("Limpeza de Vidros",300);
console.log(orcamento1.gastoMaodeObra());
console.log(orcamento1.sugerirValorMinimo());
console.log(orcamento1.totalServicos());
console.log(orcamento1.CalculoGeral());

