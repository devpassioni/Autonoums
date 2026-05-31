export interface Funcionario{
    id?: number,
    name: number,
    daily_value: number,
    worked_days: number,
    is_active: Boolean,
}





// adicionardiaTrabalhado(): void {
//     this.diasTrabalhados += 1;
// }
// adicionarDiasTrabalhadosLote(dias: number): void{
//     this.diasTrabalhados += dias;
// }

// realizarFechamento(): number{
//     const AP = (this.diasTrabalhados * this.valorDiaria);
//     this.diasTrabalhados = 0;
//     console.log(`total a pagar: ${AP}`);
//     return AP;
// }

// exibirDetalhes(): void{
//     console.log(`
//         Id: ${this.id}
//         Nome: ${this.nome}
//         Dias trabalhados: ${this.diasTrabalhados}
//         Valor Diaria: ${this.valorDiaria}`)
// }

// atualizarDiaria(novoValor: number): void{
//     this.valorDiaria = novoValor;
// }
// }

