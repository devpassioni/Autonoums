import {GeradorIDGeral } from '../utils/GeradorID'

export class Funcionario{
    public id: number;  
    constructor(
        public nome: string,
        public valorDiaria: number,
        public diasTrabalhados: number,
    ){
        this.id = GeradorIDGeral.Gfuncionario()
    }


adicionardiaTrabalhado(): void {
    this.diasTrabalhados += 1;
}
adicionarDiasTrabalhadosLote(dias: number): void{
    this.diasTrabalhados += dias;
}

realizarFechamento(): number{
    const AP = (this.diasTrabalhados * this.valorDiaria);
    this.diasTrabalhados = 0;
    console.log(`total a pagar: ${AP}`);
    return AP;
}

exibirDetalhes(): void{
    console.log(`
        Id: ${this.id}
        Nome: ${this.nome}
        Dias trabalhados: ${this.diasTrabalhados}
        Valor Diaria: ${this.valorDiaria}`)
}

atualizarDiaria(novoValor: number): void{
    this.valorDiaria = novoValor;
}
}

