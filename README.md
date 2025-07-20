# Delícias da Ney - Sistema de Pedidos Online

Um sistema completo de pedidos online para bolos artesanais, desenvolvido com React (frontend) e Node.js + SQLite (backend).

## 🍰 Características

- **Frontend moderno** com React, Framer Motion e Tailwind CSS
- **Backend robusto** com Node.js, Express e SQLite
- **Painel administrativo** completo com estatísticas e gráficos
- **Sistema de carrinho** funcional
- **Design responsivo** e animações suaves
- **Autenticação simples** para área administrativa

## 🚀 Como executar

### Pré-requisitos
- Node.js (v14 ou superior)
- npm ou yarn

### Instalação
1. Clone o repositório ou copie os arquivos
2. Instale as dependências:
   ```bash
   npm install
   ```

### Executando a aplicação

#### Opção 1: Executar tudo junto
```bash
npm run dev:full
```

#### Opção 2: Executar separadamente
Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### Acesso
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Login Admin**: usuário `admin`, senha `admin123`

## 📁 Estrutura do Projeto

```
├── backend/
│   ├── server.js          # Servidor Express
│   ├── schema.sql         # Schema do banco
│   └── delicias.db        # Banco SQLite (gerado automaticamente)
├── src/
│   ├── components/        # Componentes React
│   ├── pages/            # Páginas da aplicação
│   ├── contexts/         # Context API (Auth, Cart)
│   └── common/           # Componentes compartilhados
└── ...
```

## 🛠 Funcionalidades

### Cliente
- ✅ Visualizar menu de bolos
- ✅ Adicionar itens ao carrinho
- ✅ Finalizar pedidos
- ✅ Interface responsiva e animada

### Administrador
- ✅ Dashboard com estatísticas
- ✅ Gerenciar usuários
- ✅ Visualizar e gerenciar pedidos
- ✅ Gráficos de receita
- ✅ Autenticação segura

## 🎨 Tecnologias Utilizadas

### Frontend
- React 18
- React Router DOM
- Framer Motion (animações)
- Tailwind CSS (estilização)
- ECharts (gráficos)
- React Icons

### Backend
- Node.js
- Express.js
- SQLite3
- CORS

## 📊 API Endpoints

- `GET /api/health` - Status da API
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `DELETE /api/users/:id` - Deletar usuário
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Criar pedido
- `DELETE /api/orders/:id` - Deletar pedido
- `GET /api/stats` - Estatísticas

## 🔐 Autenticação

Para acessar o painel administrativo:
- **Usuário**: admin
- **Senha**: admin123

## 🎯 Próximas Melhorias

- [ ] Autenticação JWT
- [ ] Sistema de notificações
- [ ] Upload de imagens dos bolos
- [ ] Integração com WhatsApp
- [ ] Sistema de pagamento
- [ ] Histórico de pedidos do cliente

## 📝 Licença

Este projeto é para fins educacionais e demonstrativos.