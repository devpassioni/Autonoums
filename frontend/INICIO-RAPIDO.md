# 🚀 INÍCIO RÁPIDO - 3 PASSOS

## Estrutura Final do Projeto

Você vai ter isso:

```
seu-projeto/
├── frontend/           ← PASTA NOVA (todo o código React que criei)
│   ├── src/
│   ├── package.json
│   └── ...
├── src/               ← Seu backend (já existe)
│   └── api/
├── data/
└── package.json       ← Backend package.json
```

## 📋 Passo a Passo

### 1️⃣ Coloque a pasta `frontend` na raiz do seu projeto

```
seu-projeto/
├── frontend/     ← Toda a pasta que criei
├── src/
├── data/
└── package.json
```

### 2️⃣ Instale as dependências e rode

**Terminal 1 - Backend (já existente):**
```bash
# Na raiz do projeto
npm run dev
```

**Terminal 2 - Frontend (novo):**
```bash
cd frontend
npm install
npm run dev
```

### 3️⃣ Abra no navegador

O Vite vai abrir automaticamente em:
```
http://localhost:3000
```

## ✅ Pronto!

Você verá a tela de gerenciamento de clientes conectada à sua API! 🎉

---

## 🎯 O que acontece depois de `npm run dev`?

1. Vite compila o React
2. Abre automaticamente o navegador
3. Frontend conecta no backend (localhost:3333)
4. Você vê a lista de clientes

---

## ❌ Problemas Comuns

### "npm install" dá erro
**Solução:** Use Node.js 18 ou superior
```bash
node --version  # deve ser v18+
```

### Backend não conecta
**Solução:** Certifique-se que está rodando na porta 3333
```bash
# Teste acessando:
http://localhost:3333/clientes
```

### Porta 3000 já em uso
**Solução:** Mate o processo ou mude a porta em `vite.config.ts`

---

## 🔥 Dica Pro

Rode os dois servidores de uma vez com:

```bash
# Instale o concurrently
npm install -g concurrently

# Depois rode:
concurrently "npm run dev" "cd frontend && npm run dev"
```

---

**É isso! Simples assim! 🚀**
