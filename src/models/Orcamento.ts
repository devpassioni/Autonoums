import {GeradorIDGeral } from '../utils/GeradorID'
import {Cliente} from '../models/Cliente'
import {Funcionario} from '../models/Funcionario'


interface itemServico{
    descricao: string,
    valor: number,
}


export class Orcamento{
    public itens: itemServico[] = []
    public id: number;
    public equipe: Funcionario[] = [];
    public status: 'PENDENTE' | 'APROVADO' | 'CONCLUIDO';
    public margemdeLucro: number;
   
    constructor(
        public nomeCliente: Cliente,
        public diasPrevistos: number,
        
    ){
        this.id = GeradorIDGeral.Gorcamento();
        this.status = `PENDENTE`;
        this.margemdeLucro = 0.3;
    }


public adicionarFuncionario(funcionario: Funcionario){
    this.equipe.push(funcionario);
}

public calcularValorFuncionarios(): number{
    return this.equipe.reduce((total, funcionario) => {
        return total + funcionario.valorDiaria;},0);
    }


public gastoMaodeObra(): number{
        const totalFuncionarios = this.calcularValorFuncionarios();
        const diasPrevistos = this.diasPrevistos;
        const gastoPrevisto = totalFuncionarios * diasPrevistos
        return gastoPrevisto;
    }
// Anotacao:1 este metodo no frontend deve retornar o valor sugerido apenas para manter os funcionarios
public sugerirValorMinimo(): number{
    const custoMaodeObra = this.gastoMaodeObra();
    const valorMinimo = custoMaodeObra / (1 - this.margemdeLucro)
    return valorMinimo;
}

public adicionarServico(descricao: string, valor: number): void{
        const novoServico: itemServico = {descricao, valor}
        this.itens.push(novoServico);
    }


public totalServicos(): number{
    return this.itens.reduce((total,item) => total + item.valor, 0);
    
}
    
public CalculoGeral(): number {
    const totalMobEMargem = this.sugerirValorMinimo();
    const totalServices = this.totalServicos();
    const valorFinal = totalMobEMargem + totalServices;
    return valorFinal;
}

}