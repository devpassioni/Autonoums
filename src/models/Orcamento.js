"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orcamento = void 0;
var GeradorID_1 = require("../utils/GeradorID");
var Obra_1 = require("./Obra");
var Orcamento = /** @class */ (function () {
    function Orcamento(nomeCliente, diasPrevistos) {
        this.nomeCliente = nomeCliente;
        this.diasPrevistos = diasPrevistos;
        this.itens = [];
        this.equipe = [];
        this.id = GeradorID_1.GeradorIDGeral.Gorcamento();
        this.status = "PENDENTE";
        this.margemdeLucro = 0.3;
    }
    Orcamento.prototype.adicionarFuncionario = function (funcionario) {
        this.equipe.push(funcionario);
    };
    Orcamento.prototype.calcularValorFuncionarios = function () {
        return this.equipe.reduce(function (total, funcionario) {
            return total + funcionario.valorDiaria;
        }, 0);
    };
    Orcamento.prototype.gastoMaodeObra = function () {
        var totalFuncionarios = this.calcularValorFuncionarios();
        var diasPrevistos = this.diasPrevistos;
        var gastoPrevisto = totalFuncionarios * diasPrevistos;
        return gastoPrevisto;
    };
    // Anotacao:1 este metodo no frontend deve retornar o valor sugerido apenas para manter os funcionarios
    Orcamento.prototype.sugerirValorMinimo = function () {
        var custoMaodeObra = this.gastoMaodeObra();
        var valorMinimo = custoMaodeObra / (1 - this.margemdeLucro);
        return valorMinimo;
    };
    Orcamento.prototype.adicionarServico = function (descricao, valor) {
        var novoServico = { descricao: descricao, valor: valor };
        this.itens.push(novoServico);
    };
    Orcamento.prototype.totalServicos = function () {
        return this.itens.reduce(function (total, item) { return total + item.valor; }, 0);
    };
    Orcamento.prototype.CalculoGeral = function () {
        var totalMobEMargem = this.sugerirValorMinimo();
        var totalServices = this.totalServicos();
        var valorFinal = totalMobEMargem + totalServices;
        return valorFinal;
    };
    Orcamento.prototype.cancelarOrcamento = function () {
        this.status = "CANCELADO";
    };
    Orcamento.prototype.confirmarOrcamento = function () {
        this.status = "APROVADO";
    };
    Orcamento.prototype.criarObra = function (dataInicio) {
        if (this.status !== "APROVADO") {
            console.log("Erro! Orcamento precisa estar aprovado!");
            return null;
        }
        return new Obra_1.Obra(this, dataInicio);
    };
    return Orcamento;
}());
exports.Orcamento = Orcamento;
