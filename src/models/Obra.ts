import {Orcamento} from "../models/Orcamento";
import { Cliente } from "./Cliente";
import { Funcionario } from "./Funcionario";

export class Obra{
        
    public status: 'EM_ANDAMENTO' | 'CONCLUIDA';
    public cliente: Cliente    
    constructor(
        public orcamento: Orcamento,    
        public dataInicio: Date,
        
    ){
        this.orcamento = orcamento;
        this.cliente = orcamento.nomeCliente;
        this.status = `EM_ANDAMENTO`;
    }

public concluir(dataTermino: Date): void{
        this.status = `CONCLUIDA`;
        console.log(`Obra do cliente ${this.cliente.nome} encerrada em ${dataTermino}`);
}


public listarFuncionarios(): Funcionario[] {
        return this.orcamento.equipe;
}

}