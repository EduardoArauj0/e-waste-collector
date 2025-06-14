# E-Waste Collector

**E-Waste Collector** é uma plataforma completa projetada para conectar geradores de lixo eletrônico (clientes) com empresas especializadas em coleta e reciclagem. A aplicação facilita o descarte correto e sustentável de resíduos eletrônicos, oferecendo dashboards intuitivos para cada tipo de usuário: cliente, empresa e administrador.

## ✨ Funcionalidades

- **Três Tipos de Usuários**: A plataforma suporta perfis para Clientes, Empresas coletoras e Administradores, cada um com seu próprio painel de controle.
- **Cadastro e Login**: Sistema de autenticação seguro com senhas criptografadas para todos os usuários.
- **Dashboard do Cliente**:
    - Solicitação de novas coletas de lixo eletrônico.
    - Visualização e gerenciamento do status dos pedidos (Pendente, Aceito, Em Coleta, Concluído).
    - Edição e exclusão de pedidos pendentes.
- **Dashboard da Empresa**:
    - Visualização de pedidos de coleta disponíveis.
    - Aceitação ou recusa de novos pedidos.
    - Gerenciamento do ciclo de vida dos pedidos aceitos (Aceito -> Em Coleta -> Concluído).
    - Geração de PDF com os detalhes da ordem de coleta.
- **Painel do Administrador**:
    - Visão geral de toda a plataforma.
    - Gerenciamento completo de todos os pedidos, clientes e empresas.
    - Ferramentas para filtrar, editar e excluir registros.

## 🛠️ Tecnologias Utilizadas

O projeto é dividido em duas partes principais: o frontend e o backend.

**Frontend:**
- **React 19**
- **Vite** como ferramenta de build
- **React Router 7** para gerenciamento de rotas
- **TailwindCSS** para estilização
- **Axios** para chamadas de API
- **Yup** para validação de formulários
- **Lucide React** para ícones

**Backend:**
- **Node.js**
- **Express 5** para a criação da API REST
- **Sequelize** como ORM para interagir com o banco de dados
- **MySQL** (ou outro dialeto SQL suportado pelo Sequelize)
- **JSON Web Tokens (JWT)** para autenticação
- **Bcrypt** para criptografia de senhas

## 🚀 Começando

Para executar este projeto localmente, você precisará configurar o backend e o frontend separadamente.

### Pré-requisitos

- Node.js (versão 18 ou superior recomendada)
- Um gerenciador de pacotes (npm ou yarn)
- Um banco de dados SQL (como MySQL, PostgreSQL, etc.)

### Configuração do Backend

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/EduardoArauj0/e-waste-collector
    cd e-waste-collector/backend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz da pasta `backend` e adicione as seguintes variáveis, substituindo pelos seus valores.

    ```env
    # Configuração do Banco de Dados
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=sua_senha_do_banco
    DB_NAME=ewaste_collector_db
    DB_DIALECT=mysql

    # Segredo para o JWT
    JWT_SECRET=seu_segredo_super_secreto

    # Credenciais do Admin (para o seeder)
    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=admin_password

    # Porta da Aplicação
    PORT=3000
    ```

4.  **Configure o Banco de Dados:**
    Execute as migrações e os seeders para criar as tabelas e o usuário administrador padrão.
    ```bash
    npx sequelize-cli db:create
    npx sequelize-cli db:migrate
    npx sequelize-cli db:seed:all
    ```

5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O servidor backend estará rodando em `http://localhost:3000`.

### Configuração do Frontend

1.  **Navegue até a pasta do frontend:**
    ```bash
    cd ../frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação frontend estará acessível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

## 📂 Estrutura do Projeto

```
/
├── backend/
│   ├── src/
│   │   ├── config/       # Configuração do banco de dados
│   │   ├── controllers/  # Lógica de negócio das rotas
│   │   ├── migrations/   # Migrações do banco de dados
│   │   ├── models/       # Modelos do Sequelize
│   │   ├── routes/       # Definição das rotas da API
│   │   ├── seeders/      # Seeders para popular o banco
│   │   └── validations/  # Esquemas de validação
│   └── server.js         # Ponto de entrada do backend
│
└── frontend/
    ├── src/
    │   ├── assets/       # Ícones e imagens
    │   ├── components/   # Componentes React reutilizáveis
    │   ├── pages/        # Componentes de página
    │   └── routes.jsx    # Configuração das rotas do React Router
    ├── index.html        # Ponto de entrada do frontend
    └── vite.config.js    # Configuração do Vite
