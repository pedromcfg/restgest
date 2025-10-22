# RESTGEST - Sistema de Gestão de Restauração com MongoDB

Sistema completo de gestão de restauração escolar desenvolvido com Node.js, React e MongoDB.

## 🏗️ Arquitetura do Sistema

### Backend (Node.js + TypeScript + MongoDB)
- **Framework**: Express.js
- **Base de Dados**: MongoDB
- **Autenticação**: JWT (JSON Web Tokens)
- **Upload de Ficheiros**: Multer
- **Porta**: 3001

### Frontend (React + TypeScript + Bootstrap)
- **Framework**: React 18
- **Styling**: Bootstrap 5 + React Bootstrap
- **Ícones**: FontAwesome
- **Roteamento**: React Router DOM
- **HTTP Client**: Axios
- **Porta**: 3000

## 🗄️ Base de Dados (MongoDB)

### Coleções Principais:
- **users** - Utilizadores do sistema
- **comidas** - Gestão de alimentos
- **bebidas** - Gestão de bebidas
- **materialsala** - Material de sala/cozinha
- **students** - Alunos das turmas
- **services** - Serviços de restauração
- **quebras** - Registro de quebras/consumo

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- MongoDB (versão 4.4 ou superior)
- npm ou yarn

### 1. Instalar Dependências

```bash
# Instalar dependências do projeto principal
npm install

# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

### 2. Configurar Variáveis de Ambiente

A aplicação está configurada para usar MongoDB Atlas. Editar o ficheiro `backend/.env`:

```env
PORT=3001
MONGODB_URI=mongodb+srv://admin:<db_password>@gestorrestauracao.cb8bhkk.mongodb.net/?retryWrites=true&w=majority&appName=GestorRestauracao
JWT_SECRET=restgest_jwt_secret_2024_secure_key
UPLOAD_PATH=uploads
```

**⚠️ IMPORTANTE:** Substituir `<db_password>` pela password real do utilizador `admin` da base de dados MongoDB Atlas.

### 3. Configurar MongoDB Atlas

A aplicação está configurada para usar MongoDB Atlas. Certifique-se de que:

1. A base de dados `GestorRestauracao` está acessível
2. O utilizador `admin` tem permissões de leitura/escrita
3. A password está correta no ficheiro `.env`

### 4. Executar a Aplicação

```bash
# Executar backend e frontend simultaneamente
npm run dev

# Ou executar separadamente:
# Backend
npm run dev:backend

# Frontend
npm run dev:frontend
```

## 🎯 Funcionalidades Principais

### 1. Sistema de Autenticação
- ✅ Registo de utilizadores com hash de passwords (bcrypt)
- ✅ Login com JWT tokens
- ✅ Middleware de autenticação para proteger rotas
- ✅ Gestão de sessões no frontend

### 2. Gestão de Inventário
- ✅ **Comidas**: Adicionar/editar/eliminar comidas
- ✅ **Bebidas**: Gestão de bebidas com tipos (Com/Sem Álcool)
- ✅ **Material de Sala**: Gestão de materiais por categoria
- ✅ Upload de imagens
- ✅ Gestão de quantidades e datas de validade
- ✅ Sistema de badges para status

### 3. Gestão de Alunos
- ✅ CRUD completo de alunos
- ✅ Organização por turmas (R1, R2, R3)
- ✅ Interface com tabs para cada turma
- ✅ Ordenação alfabética

### 4. Gestão de Serviços
- ✅ Criação de serviços de restauração
- ✅ Associação de alunos aos serviços
- ✅ Gestão de datas e descrições
- ✅ Visualização expandível da lista de alunos

### 5. Sistema de Quebras (Futuro)
- ✅ Registro de consumo por serviço
- ✅ Seleção de itens do inventário
- ✅ Atualização automática do inventário

## 🔧 APIs do Backend

### Rotas de Autenticação:
- `POST /api/auth/register` - Registo
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Utilizador atual

### Rotas de Inventário:
- `GET/POST/PUT/DELETE /api/comidas` - CRUD comidas
- `GET/POST/PUT/DELETE /api/bebidas` - CRUD bebidas
- `GET/POST/PUT/DELETE /api/material-sala` - CRUD materiais

### Rotas de Gestão:
- `GET/POST/PUT/DELETE /api/students` - CRUD alunos
- `GET/POST/PUT/DELETE /api/services` - CRUD serviços
- `GET/POST/DELETE /api/quebras` - CRUD quebras

## 🎨 Interface do Utilizador

### Componentes Principais:
- **Login.tsx** - Autenticação com tabs para login/registo
- **Inventory.tsx** - Gestão de inventário com tabs
- **Students.tsx** - Gestão de alunos por turma
- **Services.tsx** - Gestão de serviços
- **Navigation.tsx** - Barra de navegação
- **PrivateRoute.tsx** - Proteção de rotas

### Design System:
- Bootstrap 5 para layout responsivo
- FontAwesome para ícones
- Modais para formulários
- Tabs para organização
- Badges coloridos para categorização
- Tabelas responsivas

## 📊 Fluxo de Trabalho

1. **Login** → Autenticação do utilizador
2. **Inventário** → Gestão de stock (comidas, bebidas, materiais)
3. **Alunos** → Registo de alunos por turma
4. **Serviços** → Criação de serviços com alunos
5. **Quebras** → Registro de consumo por serviço (futuro)

## 🛠️ Desenvolvimento

### Estrutura do Projeto:
```
restgest/
├── backend/
│   ├── src/
│   │   ├── models/          # Modelos MongoDB
│   │   ├── routes/          # Rotas da API
│   │   ├── middleware/      # Middleware (auth, upload)
│   │   ├── config/          # Configurações
│   │   └── server.ts        # Servidor principal
│   ├── uploads/             # Ficheiros enviados
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── contexts/        # Contextos (Auth)
│   │   ├── services/        # Serviços API
│   │   ├── types/           # Tipos TypeScript
│   │   └── App.tsx
│   └── package.json
└── package.json
```

### Scripts Disponíveis:
```bash
npm run dev          # Executar backend e frontend
npm run dev:backend  # Apenas backend
npm run dev:frontend # Apenas frontend
npm run build        # Build do backend
npm start            # Executar produção
```

## 🔒 Segurança

- Autenticação JWT com expiração
- Hash de passwords com bcrypt
- Middleware de autenticação
- Validação de tokens
- Upload seguro de ficheiros

## 📱 Responsividade

- Interface totalmente responsiva
- Design mobile-first
- Componentes Bootstrap otimizados
- Navegação adaptativa

## 🚀 Deploy

### Backend:
1. Configurar variáveis de ambiente de produção
2. `npm run build`
3. `npm start`

### Frontend:
1. `npm run build`
2. Servir ficheiros estáticos

## 📝 Notas de Desenvolvimento

- Sistema desenvolvido com TypeScript para type safety
- Componentes React funcionais com hooks
- Context API para gestão de estado global
- Axios para comunicação HTTP
- Bootstrap 5 para UI/UX
- MongoDB com Mongoose para ODM

## 🤝 Contribuição

1. Fork do projeto
2. Criar branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit das alterações (`git commit -m 'Add some AmazingFeature'`)
4. Push para branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Ver `LICENSE` para mais detalhes.
