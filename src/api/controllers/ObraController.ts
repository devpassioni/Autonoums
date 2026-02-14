import { Request, Response } from 'express';
import { GerenciarObras } from '../../services/GerenciarObra';
import { GerenciadorOrcamento } from '../../services/GerenciadorOrcamento';
import { Obra } from '../../models/Obra';

// Instanciamos os dois serviços necessários
//const obrasService = new GerenciarObras();
import { obrasService, orcamentosService } from '../../services/instances';
export class ObraController {

    // LISTAR (GET)
    async index(req: Request, res: Response) {
        try {
            const obras = obrasService.listarObrasAtivas();
            return res.json(obras);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar obras' });
        }
    }

    // CRIAR (POST) - A Mágica acontece aqui
    async create(req: Request, res: Response) {
        // O Front manda: { "idOrcamento": 123, "dataInicio": "2026-02-10" }
        const { idOrcamento, dataInicio } = req.body;

        if (!idOrcamento || !dataInicio) {
            return res.status(400).json({ error: 'ID do Orçamento e Data de Início são obrigatórios' });
        }

        try {
            // 1. Busca o Orçamento pelo ID (usando o outro service)
            // Atenção: Verifique se o método no seu service se chama 'buscarPorId' ou similar
            const orcamentoEncontrado = orcamentosService.buscarPorId(Number(idOrcamento));

            // 2. Valida se existe
            if (!orcamentoEncontrado) {
                return res.status(404).json({ error: 'Orçamento não encontrado' });
            }

            // 3. Valida se está APROVADO (Regra de Negócio)
            // Ajuste a string 'APROVADO' conforme está no seu Model Orcamento
            if (orcamentoEncontrado.status !== 'APROVADO') {
                return res.status(400).json({ error: 'Este orçamento ainda não foi aprovado.' });
            }

            // 4. Cria a Obra
            const novaObra = new Obra(orcamentoEncontrado, new Date(dataInicio));

            // 5. Salva
            obrasService.adicionarObra(novaObra);

            return res.status(201).json({ mensagem: 'Obra iniciada com sucesso!', obra: novaObra });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao criar obra' });
        }
    }

    async remove(req: Request, res: Response) {
    const { id } = req.params; 
    try {
        const removido = obrasService.removerPorIdOrcamento(Number(id));
        if (!removido) return res.status(404).json({ error: 'Obra não encontrada' });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao remover obra' });
    }
}






}