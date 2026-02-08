"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeradorIDGeral = void 0;
var GeradorID = /** @class */ (function () {
    function GeradorID() {
    }
    GeradorID.gerar = function () {
        this.ultimoID++;
        return this.ultimoID;
    };
    GeradorID.setUltimoID = function (id) {
        this.ultimoID = id;
    };
    GeradorID.getUltimoID = function () {
        return this.ultimoID;
    };
    GeradorID.ultimoID = 0;
    return GeradorID;
}());
var GeradorIDCliente = /** @class */ (function () {
    function GeradorIDCliente() {
    }
    GeradorIDCliente.gerarIDCliente = function () {
        this.ultimoIDCliente++;
        return this.ultimoIDCliente;
    };
    GeradorIDCliente.setUltimoIDCliente = function (id) {
        this.ultimoIDCliente = id;
    };
    GeradorIDCliente.getUltimoIDCliente = function () {
        return this.ultimoIDCliente;
    };
    GeradorIDCliente.ultimoIDCliente = 0;
    return GeradorIDCliente;
}());
var GeradorIDOrcamento = /** @class */ (function () {
    function GeradorIDOrcamento() {
    }
    GeradorIDOrcamento.gerarIDOrcamento = function () {
        this.ultimoIDOrcamento++;
        return this.ultimoIDOrcamento;
    };
    GeradorIDOrcamento.setUltimoIDCliente = function (id) {
        this.ultimoIDOrcamento = id;
    };
    GeradorIDOrcamento.getUltimoIDCliente = function () {
        return this.ultimoIDOrcamento;
    };
    GeradorIDOrcamento.ultimoIDOrcamento = 0;
    return GeradorIDOrcamento;
}());
var GeradorIDGeral = /** @class */ (function () {
    function GeradorIDGeral() {
    }
    GeradorIDGeral.Gcliente = function () {
        return ++this.ultimoIDCliente;
    };
    GeradorIDGeral.Gorcamento = function () {
        return ++this.ultimoIDOrcamento;
    };
    GeradorIDGeral.Gfuncionario = function () {
        return ++this.ultimoIDFuncionario;
    };
    GeradorIDGeral.ultimoIDCliente = 0;
    GeradorIDGeral.ultimoIDOrcamento = 0;
    GeradorIDGeral.ultimoIDFuncionario = 0;
    return GeradorIDGeral;
}());
exports.GeradorIDGeral = GeradorIDGeral;
