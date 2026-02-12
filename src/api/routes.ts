import { Router } from 'express';
import { ClienteController } from './controllers/ClienteController';
import { FuncionarioController } from './controllers/FuncionarioController';
import { ObraController } from './controllers/ObraController';
import { OrcamentoController } from './controllers/OrcamentoController'; // <--- Import novo

const router = Router();

// Instâncias
const clienteController = new ClienteController();
const funcionarioController = new FuncionarioController();
const obraController = new ObraController();
const orcamentoController = new OrcamentoController(); // <--- Instância nova

router.get('/status', (req, res) => res.json({ online: true }));

// --- CLIENTES ---
router.get('/clientes', clienteController.index);
router.post('/clientes', clienteController.create);
router.delete('/clientes/:id', clienteController.delete);

// --- FUNCIONÁRIOS ---
router.get('/funcionarios', funcionarioController.index);
router.post('/funcionarios', funcionarioController.create);
router.delete('/funcionarios/:id', funcionarioController.delete);

// --- ORÇAMENTOS (O Fluxo começa aqui) ---
router.get('/orcamentos', orcamentoController.index);
router.post('/orcamentos', orcamentoController.create);
router.patch('/orcamentos/:id/aprovar', orcamentoController.aprovar);
router.put('/orcamentos/:id',orcamentoController.update) // Rota para aprovar!

// --- OBRAS (Depende do Orçamento Aprovado) ---
router.get('/obras', obraController.index);
router.post('/obras', obraController.create);

export { router };