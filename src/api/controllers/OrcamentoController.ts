import { Request, Response } from 'express';
import { GerenciadorOrcamento } from '../../services/GerenciadorOrcamento';
import { Orcamento } from '../../models/Orcamento';

// Instância única do serviço
const gerenciador = new GerenciadorOrcamento();

export class OrcamentoController {

    // GET /orcamentos
    async index(req: Request, res: Response) {
        try {
            const lista = gerenciador.listarTodos();
            return res.json(lista);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar orçamentos' });
        }
    }

    // POST /orcamentos
    async create(req: Request, res: Response) {
        // Recebe dados básicos.
        // Importante: 'nomeCliente' pode ser uma string ou um Objeto Cliente,
        // dependendo de como está o seu Model. Vou assumir string ou objeto simples por enquanto.
        const { nomeCliente, diasPrevistos } = req.body;

        if (!nomeCliente || !diasPrevistos) {
            return res.status(400).json({ error: 'Nome do Cliente e Dias Previstos são obrigatórios' });
        }

        try {
            // Cria o orçamento (Status nasce como PENDENTE por padrão na sua Model)
            const novoOrcamento = new Orcamento(nomeCliente, Number(diasPrevistos));

            // Salva
            gerenciador.adicionar(novoOrcamento);

            return res.status(201).json(novoOrcamento);

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar orçamento' });
        }
    }

    // PATCH /orcamentos/:id/aprovar
    // É aqui que a mágica acontece para permitir criar a Obra depois
    async aprovar(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const sucesso = gerenciador.aprovarOrcamento(Number(id));

            if (!sucesso) {
                return res.status(404).json({ error: 'Orçamento não encontrado para aprovação' });
            }

            return res.json({ message: 'Orçamento APROVADO com sucesso!' });

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao aprovar orçamento' });
        }
    }

    update = async (req: Request, res: Response)=> {
        const { id } = req.params;
        const dados  = req.body;

        try {
            const orcamento = gerenciador.buscarPorId(Number(id));
            if (!orcamento) {
                return res.status(404).json({ error: 'Orçamento não encontrado' });
            }

            // Atualiza campos permitidos
            if (dados.equipe          !== undefined) orcamento.equipe          = dados.equipe;
            if (dados.itens           !== undefined) orcamento.itens           = dados.itens;
            if (dados.diasPrevistos   !== undefined) orcamento.diasPrevistos   = Number(dados.diasPrevistos);
            if (dados.margemdeLucro   !== undefined) orcamento.margemdeLucro   = Number(dados.margemdeLucro);

            gerenciador.sincronizar(); // veja nota abaixo
            return res.json(orcamento);

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar orçamento' });
        }
    }




}