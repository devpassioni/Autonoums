import {Cliente} from "../models/Cliente";
import { Persistencia } from '../utils/Persistencia';
import { GeradorIDGeral } from '../utils/GeradorID';

export class GerenciadorClientes{
    private clientes: Cliente[] = []
        constructor(){
            this.carregar();
        }

    

private carregar(): void {
        const dados = Persistencia.ler('clientes.json');
        this.clientes = dados.map((c: any) => {
            const cliente = new Cliente(c.nome, c.telefone, c.endereco, c.tipo);
            cliente.id = c.id; // Mantém o ID salvo no arquivo
            return cliente;
        });
    }

    private sincronizar(): void {
        Persistencia.salvar('clientes.json', this.clientes);
    }


public adicionarCliente(cliente: Cliente): void{
    this.clientes.push(cliente);
    this.sincronizar();
}
    
public buscarporID(id: number): Cliente | undefined{
    return this.clientes.find(c => c.id === id);
}

public listartodos(): Cliente[]{
    return [...this.clientes]; //shalow copy pra n permitir acesso - arrumar no outro cod
}

public removerCliente(id: number){
    const index = this.clientes.findIndex(c => c.id == id);

    if (index === -1){
        console.log("Erro - Cliente nao localizado!");
        return false;
    }

    this.clientes.slice(index,1);
    console.log(`Cliente com ID ${id} removido com sucesso!`);
    this.sincronizar()
    return true;

    
}

}