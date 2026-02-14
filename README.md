# Autonoums - Aplicativo focado em pequenos empreendedores

![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

---

## 📖 Proposta do Projeto

Este projeto é uma aplicação **Full Stack de gestão financeira** destinada a pequenos empreendedores. O objetivo é oferecer uma ferramenta que auxilie profissionais que operam com parcerias, clientes informais e serviços a se profissionalizarem em seus métodos de controle.

O projeto foi desenvolvido originalmente para minha mãe, uma empreendedora da área de construção civil, com arquitetura pensada para futura adaptação a outros segmentos.

O desenvolvimento foi focado em **TypeScript** em ambas as pontas (Front e Back) para garantir tipagem estática, segurança no código e consistência entre camadas, utilizando **React** para uma interface reativa e moderna.

---

## 📸 Screenshots

### 1. Visão Geral (Clientes)
A tela principal onde o administrador poderá adicionar clientes, que futuramente serão utilizados para registro de dados em orçamentos e obras.

![Dashboard Principal](https://github.com/user-attachments/assets/37e683fe-18ae-428a-94d2-eb31f188f8fc)

### 2. Card de inserção de Clientes
Card para cadastro de Clientes Físicos ou Jurídicos.

<img src="https://github.com/user-attachments/assets/763c74f3-fcf3-4a52-8afd-d46d5b4e7323" width="400" />


### 3. Modulo Orcamentos
<img width="1919" height="921" alt="Image" src="https://github.com/user-attachments/assets/ae65cf5c-d0fe-4719-b810-1f74553662eb" />

### 4. Card Orcamentos
<img width="448" height="379" alt="Image" src="https://github.com/user-attachments/assets/3146637e-e02a-4628-9f15-09f72765f8f8" />

### 5. Obras (Modulo para controle andamento e financeiro)
<img width="1910" height="922" alt="Image" src="https://github.com/user-attachments/assets/53debdd7-0f0a-4cf0-a5c9-8d87a72d9adb" />

### 6. Configuracoes de empresa para impressao em PDF
<img width="1916" height="918" alt="Image" src="https://github.com/user-attachments/assets/e284d2d2-f971-4d84-b69c-1ca98a3b723b" />

### 7. Orcamento em PDF
<img width="602" height="838" alt="Image" src="https://github.com/user-attachments/assets/3dc95e47-a2d4-429a-a58c-1a376c68fc14" />

---

## ✅ Funcionalidades

- [x] Gerenciamento de Clientes (Pessoa Física e Jurídica)
- [x] Gerenciamento de Funcionários e Diárias
- [x] Criação e controle de Orçamentos com equipe e serviços
- [x] Aprovação de Orçamentos e conversão em Obras
- [x] Controle financeiro de Obras em andamento
- [x] Geração de Orçamento em PDF com dados da empresa, do cliente e aviso de adiantamento
- [x] Página de Configurações com logo e dados bancários persistidos localmente

---

## 🏗️ Arquitetura e Padrões de Projeto

Este projeto aplica de forma intencional padrões clássicos de engenharia de software, com foco em organização, reuso e manutenibilidade.

### MVC — Model · View · Controller

A camada de **backend** segue o padrão MVC:

| Camada | Responsabilidade | Exemplo |
|---|---|---|
| **Model** | Define a estrutura e regras de negócio da entidade | `Funcionario.ts`, `Orcamento.ts`, `Obra.ts` |
| **Controller** | Recebe a requisição HTTP, valida e delega ao Service | `FuncionarioController.ts`, `OrcamentoController.ts` |
| **Service** | Gerencia o estado em memória e a persistência dos dados | `GerenciadorFuncionarios.ts`, `GerenciadorOrcamento.ts` |

A **View** é desacoplada e implementada inteiramente no frontend React, consumindo a API via `fetch`.

---

### Singleton — Instância Compartilhada de Serviços

Os serviços de gerenciamento são instanciados **uma única vez** e compartilhados entre todos os controllers através de um módulo central:

```typescript
// src/services/instances.ts
export const orcamentosService   = new GerenciadorOrcamento();
export const obrasService        = new GerenciarObras();
export const funcionariosService = new GerenciadorFuncionarios();
```

Isso garante que todos os controllers operem sobre o **mesmo estado em memória**, evitando inconsistências como um orçamento criado pelo `OrcamentoController` não ser encontrado pelo `ObraController`.

> Sem o Singleton, cada controller carregaria seu próprio JSON independentemente, e alterações em um não seriam visíveis ao outro na mesma sessão.

---

### DTO — Data Transfer Object

Os dados trafegados entre o frontend e o backend seguem o conceito de DTO: objetos simples que carregam apenas as informações necessárias para aquela operação, sem expor a entidade completa.

**Exemplo — criação de Orçamento:**
```typescript
// O frontend envia apenas:
{
  nomeCliente: { id: 1, nome: "João Silva" },
  diasPrevistos: 15,
  margemdeLucro: 0.3
}
// O Controller extrai, valida e instancia o Model internamente
```

**Exemplo — criação de Obra:**
```typescript
// O frontend envia apenas:
{
  idOrcamento: 5,
  dataInicio: "2026-02-16"
}
// O Controller busca o Orçamento completo e valida o status antes de criar a Obra
```

---

### Persistência com JSON (File-based Storage)

Por ser uma aplicação local voltada para uso individual, o projeto utiliza um sistema de **persistência simples baseada em arquivos JSON**, gerenciada pela classe utilitária `Persistencia.ts`. Cada service carrega o arquivo ao inicializar e sincroniza após cada alteração.

---

## 🛠️ Tecnologias Utilizadas

**Front-end:**
- React + Vite
- TypeScript
- jsPDF + jspdf-autotable (geração de PDF no browser)

**Back-end:**
- Node.js
- TypeScript
- Express
- ts-node-dev

---

## 🚀 Como rodar o projeto

### Pré-requisitos

Certifique-se de ter o **Node.js** e o **Git** instalados.

```bash
# Clone o repositório
git clone https://github.com/devpassioni/Autonoums

# --- BACKEND ---
cd backend
npm install
npm run dev

# --- FRONTEND (em outro terminal) ---
cd frontend
npm install
npm run dev
```

O backend sobe em `http://localhost:3333` e o frontend em `http://localhost:5173`.

---

## 📁 Estrutura do Projeto

```
Autonoums/
├── backend/
│   └── src/
│       ├── api/
│       │   ├── controllers/     # Camada Controller (MVC)
│       │   └── routes.ts
│       ├── models/              # Camada Model (MVC) + regras de negócio
│       ├── services/            # Gerenciadores (Singleton)
│       │   └── instances.ts     # Ponto único de instanciação
│       └── utils/
│           └── Persistencia.ts  # File-based storage (JSON)
└── frontend/
    └── src/
        ├── components/
        │   ├── clientes/
        │   ├── Funcionarios/
        │   ├── Orcamentos/
        │   ├── Obras/
        │   └── Configuracoes/
        └── utils/
            └── gerarPdfOrcamento.ts
```

---

## 👩‍💼 Sobre o Projeto

Desenvolvido com carinho para auxiliar pequenos empreendedores a terem mais controle e profissionalismo no dia a dia — começando em casa. 🏗️
