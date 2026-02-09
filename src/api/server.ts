import express from 'express';
import cors from 'cors';
import { router } from './routes';

const app = express();

// Libera acesso externo
app.use(cors());

// Permite JSON no body
app.use(express.json());

// Usa as rotas
app.use(router);

const PORT = 3333;

// O SERVIDOR PRECISA DISSO PARA FICAR RODANDO:
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
  console.log(`➜ Acesse: http://localhost:${PORT}/status`);
});