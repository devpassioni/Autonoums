# 🎨 Frontend - Gerenciador de Clientes

Interface React + TypeScript moderna e elegante para gerenciar clientes.

## 🚀 Como Rodar

### 1️⃣ Instale as dependências

```bash
cd frontend
npm install
```

### 2️⃣ Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação vai abrir automaticamente em: **http://localhost:3000**

### 3️⃣ Certifique-se que o backend está rodando

Em outro terminal, na pasta raiz do projeto:

```bash
npm run dev
```

O backend deve estar em: **http://localhost:3333**

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/
│   │   └── clientes/
│   │       ├── GerenciadorClientes.tsx  ← Componente principal
│   │       └── GerenciadorClientes.css  ← Estilos
│   ├── App.tsx                          ← App principal
│   ├── main.tsx                         ← Ponto de entrada
│   └── index.css                        ← Estilos globais
├── index.html                           ← HTML base
├── package.json                         ← Dependências
├── vite.config.ts                       ← Configuração Vite
└── tsconfig.json                        ← Configuração TypeScript
```

## ✨ Funcionalidades

- ✅ Listar todos os clientes
- ✅ Adicionar novo cliente
- ✅ Remover cliente
- ✅ Dashboard com estatísticas
- ✅ Animações suaves
- ✅ Notificações de sucesso/erro
- ✅ Design responsivo

## 🎨 Design

- **Tipografia**: Playfair Display + Inter
- **Cores**: Gradientes roxo/índigo
- **Efeitos**: Glassmorphism, animações, hover states
- **Responsivo**: Desktop, tablet e mobile

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build de produção
```

## ⚙️ Configuração da API

A URL da API está configurada em:
`src/components/clientes/GerenciadorClientes.tsx`

```typescript
const API_URL = 'http://localhost:3333';
```

Se seu backend estiver em outra porta, altere aqui.

## 🐛 Troubleshooting

### Erro de CORS
Já está configurado no backend (`server.ts`):
```typescript
app.use(cors());
```

### Backend não conecta
1. Verifique se o backend está rodando: `http://localhost:3333/status`
2. Veja o console do navegador (F12) para erros

### Porta 3000 já está em uso
Altere em `vite.config.ts`:
```typescript
server: {
  port: 3001, // ou outra porta
}
```

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`

## 🎯 Próximos Passos

- [ ] Adicionar edição de clientes
- [ ] Implementar filtros e busca
- [ ] Adicionar paginação
- [ ] Criar telas para Funcionários, Orçamentos e Obras
- [ ] Adicionar rotas (React Router)

---

**Desenvolvido com 💜 React + TypeScript + Vite**
