import { Funcionario } from '../models/Funcionario';

export class GerenciadorFuncionarios {
    private funcionarios: Funcionario[] = [];

    
    adicionar(funcionario: Funcionario): void {
        this.funcionarios.push(funcionario);
    }

    
    remover(id: number): void {
        const index = this.funcionarios.findIndex(f => f.id === id);
        if (index !== -1) {
            this.funcionarios.splice(index, 1);
        }
    }

    
    buscarPorId(id: number): Funcionario | undefined {
        return this.funcionarios.find(f => f.id === id);
    }

    
    buscarPorNome(nome: string): Funcionario | undefined {
        return this.funcionarios.find(f => f.nome === nome);
    }

    
    listarTodos(): Funcionario[] {
        return this.funcionarios;
    }

    
    total(): number {
        return this.funcionarios.length;
    }
}