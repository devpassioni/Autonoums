"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GerenciadorFuncionarios_1 = require("./services/GerenciadorFuncionarios");
var GerenciadorClientes_1 = require("./services/GerenciadorClientes");
var GerenciadorOrcamento_1 = require("./services/GerenciadorOrcamento");
var Funcionario_1 = require("./models/Funcionario");
var Cliente_1 = require("./models/Cliente");
var Orcamento_1 = require("./models/Orcamento");
// 1. Inicializar os Services (Eles já carregam o que houver no JSON)
var servicoFunc = new GerenciadorFuncionarios_1.GerenciadorFuncionarios();
var servicoCli = new GerenciadorClientes_1.GerenciadorClientes();
var servicoOrc = new GerenciadorOrcamento_1.GerenciadorOrcamento();
console.log("--- TESTE DE SISTEMA AUTONOMOUS ---");
// 2. Criar e Adicionar um Funcionário
var novoFunc = new Funcionario_1.Funcionario("Marcondes", 150, 0);
servicoFunc.adicionar(novoFunc);
console.log("Funcion\u00E1rio ".concat(novoFunc.nome, " adicionado e salvo!"));
// 3. Criar e Adicionar um Cliente
var novoCli = new Cliente_1.Cliente("Empresa XYZ", "1198888-7777", "Av. Paulista, 1000", "Pessoa Juridica");
servicoCli.adicionarCliente(novoCli);
console.log("Cliente ".concat(novoCli.nome, " adicionado e salvo!"));
// 4. Criar um Orçamento para esse Cliente
var orc1 = new Orcamento_1.Orcamento(novoCli, 10);
orc1.adicionarServico("Reforma Geral", 5000);
orc1.equipe.push(novoFunc); // Adiciona o Marcondes na equipe
servicoOrc.adicionar(orc1);
console.log("Or\u00E7amento ID ".concat(orc1.id, " gerado e salvo com sucesso!"));
// 5. Listagem final para conferir no console
console.log("\n--- RESUMO ATUAL NA MEMÓRIA ---");
console.table(servicoFunc.listarTodos());
console.table(servicoCli.listartodos());
