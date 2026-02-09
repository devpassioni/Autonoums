import { Request, Response } from 'express';
import { GerenciadorClientes } from '../../services/GerenciadorClientes';
import { Cliente } from '../../models/Cliente';

// Instanciamos AQUI para ele carregar o JSON apenas uma vez quando o servidor sobe
const gerenciador = new GerenciadorClientes();

export class ClienteController {

  // GET /clientes
  async index(req: Request, res: Response) {
    try {
      const lista = gerenciador.listartodos();
      return res.json(lista);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar clientes' });
    }
  }

  // POST /clientes
  async create(req: Request, res: Response) {
    // Pegamos os dados exatos que o seu construtor pede (baseado no método carregar que você mandou)
    const { nome, telefone, endereco, tipo } = req.body;

    // Validação básica
    if (!nome || !telefone) {
      return res.status(400).json({ error: 'Nome e Telefone são obrigatórios' });
    }

    try {
      // Cria a instância do Cliente (Assumindo que sua classe gera o ID automaticamente ou aceita esses params)
      const novoCliente = new Cliente(nome, telefone, endereco, tipo);
      
      // Passa para o seu gerenciador salvar
      gerenciador.adicionarCliente(novoCliente);

      return res.status(201).json(novoCliente);

    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: 'Erro ao cadastrar cliente' });
    }
  }

  // DELETE /clientes/:id
  async delete(req: Request, res: Response) {
    const { id } = req.params; // Pega o ID da URL

    try {
      const idNumber = Number(id); // Converte string para number
      
      const sucesso = gerenciador.removerCliente(idNumber);

      if (!sucesso) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      return res.status(204).send(); // 204 = No Content (Sucesso sem conteúdo)

    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover cliente' });
    }
  }
}