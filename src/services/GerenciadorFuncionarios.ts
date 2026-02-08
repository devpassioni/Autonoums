import { Funcionario } from '../models/Funcionario';
import {Persistencia} from '../utils/Persistencia';
import { GeradorIDGeral } from '../utils/GeradorID';

export class GerenciadorFuncionarios {
    private funcionarios: Funcionario[] = [];

        constructor(){
            this.carregar();
        }
    

        //function feita pelo Gemini - validar
    private carregar(): void {
        const dados = Persistencia.ler('funcionarios.json');
        
        this.funcionarios = dados.map((f: any) => {
            // "Reidrata" o objeto para ele ter acesso aos métodos do Model
            const func = new Funcionario(f.nome, f.valorDiaria, f.diasTrabalhados);
            func.id = f.id; // Mantém o ID que estava salvo
            return func;
        });
    }

    private sincronizar(){
        Persistencia.salvar('funcionarios.json',this.funcionarios);
    }

    adicionar(funcionario: Funcionario): void {
        this.funcionarios.push(funcionario);
        this.sincronizar();
    }

    
    remover(id: number): void {
        const index = this.funcionarios.findIndex(f => f.id === id);
        if (index !== -1) {
            this.funcionarios.splice(index, 1);
        }
        this.sincronizar();
    
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