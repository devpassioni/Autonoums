import { Request, Response } from 'express';
import { GerenciadorFuncionarios } from '../../services/GerenciadorFuncionarios';
import { Funcionario } from '../../models/Funcionario';

// Instanciamos fora da classe para carregar o JSON apenas uma vez (Singleton)
const gerenciador = new GerenciadorFuncionarios();

export class FuncionarioController {

    // GET /funcionarios
    async index(req: Request, res: Response) {
        try {
            const funcionarios = gerenciador.listarTodos();
            return res.json(funcionarios);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar funcionários' });
        }
    }

    // GET /funcionarios/:id
    async show(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const funcionario = gerenciador.buscarPorId(Number(id));

            if (!funcionario) {
                return res.status(404).json({ error: 'Funcionário não encontrado' });
            }

            return res.json(funcionario);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar funcionário' });
        }
    }

    // POST /funcionarios
    async create(req: Request, res: Response) {
        // Pega os dados que o seu construtor da Model exige
        const { nome, valorDiaria, diasTrabalhados } = req.body;

        // Validação Simples
        if (!nome || !valorDiaria) {
            return res.status(400).json({ error: 'Nome e Valor da Diária são obrigatórios' });
        }

        try {
            // Cria a instância do Modelo
            // O ID deve ser gerado automaticamente dentro da classe Funcionario ou no Gerenciador
            // Se sua classe Funcionario não gera ID automático no construtor, avise-me!
            const novoFuncionario = new Funcionario(nome, Number(valorDiaria), Number(diasTrabalhados || 0));

            // Chama o service para salvar
            gerenciador.adicionar(novoFuncionario);

            return res.status(201).json(novoFuncionario);
        } catch (error) {
            console.error(error);
            return res.status(400).json({ error: 'Erro ao criar funcionário' });
        }
    }

    // DELETE /funcionarios/:id
    async delete(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const idNumber = Number(id);

            // Verifica se existe antes de tentar remover
            const existe = gerenciador.buscarPorId(idNumber);
            if (!existe) {
                return res.status(404).json({ error: 'Funcionário não encontrado' });
            }

            // Remove e Salva
            gerenciador.remover(idNumber);

            return res.status(204).send(); // 204 = Sucesso sem conteúdo
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao remover funcionário' });
        }
    }
}