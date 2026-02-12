# Autonoums - Aplicativo focado em pequenos empreendedores

![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)

## 📖 Proposta do Projeto
Este projeto é uma aplicação **Full Stack de gestão financeira**. O objetivo é oferecer um aplicativo que consiga auxiliar pequenos empreendedores que operam com parcerias, clientes (mesmo informal) a se profissionalizarem em seus métodos.
O projeto é destinado diretamente para minha mãe, uma empreendedora. Portanto, há necessidade de adaptação para outros tipos de negócio que fogem do âmbito de obras civis.

O desenvolvimento foi focado em **TypeScript** em ambas as pontas (Front e Back) para garantir tipagem estática e segurança no código, utilizando **React** para uma interface reativa e moderna.

### Funcionalidades em implementação no Front-End:
- [x] Dashboard de fechamento de salário para funcionários
- [x] Geração de Orçamentos em PDF
- [x] Gerenciamento de funcionários, diárias e participação em obras
- [x] Controle de 

## 📸 Screenshots

Abaixo, uma prévia do visual da aplicação rodando:

### 1. Visão Geral (Clientes):
A tela principal onde o administrador poderá adicionar clientes, que futuramente serão utilizados para registro de dados em orçamentos e obras.
![Dashboard Principal](https://github.com/user-attachments/assets/37e683fe-18ae-428a-94d2-eb31f188f8fc)

### 2. Card de inserção de Clientes
Card para cadastro de Clientes Fisicos ou Juridicos.

<img src="https://github.com/user-attachments/assets/763c74f3-fcf3-4a52-8afd-d46d5b4e7323" width="400" />

---

## 🛠️ Tecnologias Utilizadas

**Front-end:**
* React (Vite)
* TypeScript



**Back-end:**
* Node.js
* TypeScript
* Express / Fastify (ajuste conforme o framework)
* Banco de dados (SQL/NoSQL)

## 🚀 Como rodar o projeto

### Pré-requisitos
Certifique-se de ter o **Node.js** e o **Git** instalados.

```bash
# Clone o repositório
git clone <(https://github.com/devpassioni/Autonoums)>

# --- BACKEND ---
cd backend
npm install
npm run dev

# --- FRONTEND (em outro terminal) ---
cd frontend
npm install
npm run dev
