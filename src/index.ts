import { GerenciadorFuncionarios } from './services/GerenciadorFuncionarios';
import { GerenciadorClientes } from './services/GerenciadorClientes';
import { GerenciadorOrcamento } from './services/GerenciadorOrcamento';
import { Funcionario } from './models/Funcionario';
import { Cliente } from './models/Cliente';
import { Orcamento } from './models/Orcamento';

// 1. Inicializar os Services (Eles já carregam o que houver no JSON)
const servicoFunc = new GerenciadorFuncionarios();
const servicoCli = new GerenciadorClientes();
const servicoOrc = new GerenciadorOrcamento();

console.log("--- TESTE DE SISTEMA AUTONOMOUS ---");

// 2. Criar e Adicionar um Funcionário
const novoFunc = new Funcionario("Marcondes", 150, 0);
servicoFunc.adicionar(novoFunc);
console.log(`Funcionário ${novoFunc.nome} adicionado e salvo!`);

// 3. Criar e Adicionar um Cliente
const novoCli = new Cliente("Empresa XYZ", "1198888-7777", "Av. Paulista, 1000", "Pessoa Juridica");
servicoCli.adicionarCliente(novoCli);
console.log(`Cliente ${novoCli.nome} adicionado e salvo!`);

// 4. Criar um Orçamento para esse Cliente
const orc1 = new Orcamento(novoCli, 10);
orc1.adicionarServico("Reforma Geral", 5000);
orc1.equipe.push(novoFunc); // Adiciona o Marcondes na equipe

servicoOrc.adicionar(orc1);
console.log(`Orçamento ID ${orc1.id} gerado e salvo com sucesso!`);

// 5. Listagem final para conferir no console
console.log("\n--- RESUMO ATUAL NA MEMÓRIA ---");
console.table(servicoFunc.listarTodos());
console.table(servicoCli.listartodos());
