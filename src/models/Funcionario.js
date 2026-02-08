"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcionario = void 0;
var GeradorID_1 = require("../utils/GeradorID");
var Funcionario = /** @class */ (function () {
    function Funcionario(nome, valorDiaria, diasTrabalhados) {
        this.nome = nome;
        this.valorDiaria = valorDiaria;
        this.diasTrabalhados = diasTrabalhados;
        this.id = GeradorID_1.GeradorIDGeral.Gfuncionario();
    }
    Funcionario.prototype.adicionardiaTrabalhado = function () {
        this.diasTrabalhados += 1;
    };
    Funcionario.prototype.adicionarDiasTrabalhadosLote = function (dias) {
        this.diasTrabalhados += dias;
    };
    Funcionario.prototype.realizarFechamento = function () {
        var AP = (this.diasTrabalhados * this.valorDiaria);
        this.diasTrabalhados = 0;
        console.log("total a pagar: ".concat(AP));
        return AP;
    };
    Funcionario.prototype.exibirDetalhes = function () {
        console.log("\n        Id: ".concat(this.id, "\n        Nome: ").concat(this.nome, "\n        Dias trabalhados: ").concat(this.diasTrabalhados, "\n        Valor Diaria: ").concat(this.valorDiaria));
    };
    Funcionario.prototype.atualizarDiaria = function (novoValor) {
        this.valorDiaria = novoValor;
    };
    return Funcionario;
}());
exports.Funcionario = Funcionario;
