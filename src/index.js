"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Funcionario_1 = require("./models/Funcionario");
var GerenciadorFuncionarios_1 = require("./services/GerenciadorFuncionarios");
var servico1 = new GerenciadorFuncionarios_1.GerenciadorFuncionarios;
servico1.adicionar(new Funcionario_1.Funcionario("Jonathan", 100, 3));
console.log(servico1.listarTodos());
