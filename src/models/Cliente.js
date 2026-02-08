"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = void 0;
var GeradorID_1 = require("../utils/GeradorID");
var Cliente = /** @class */ (function () {
    function Cliente(nome, telefone, endereco, tipo) {
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.tipo = tipo;
        this.id = GeradorID_1.GeradorIDGeral.Gcliente();
    }
    return Cliente;
}());
exports.Cliente = Cliente;
