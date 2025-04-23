# Vozzy - Sistema de Gerenciamento de Produtos e Feedbacks

## 📋 Descrição
O Vozzy é um sistema web moderno para gerenciamento de produtos e feedbacks, desenvolvido com Node.js e Express. O sistema permite que usuários autenticados gerenciem produtos, categorias e forneçam feedbacks sobre os produtos.

## 🚀 Funcionalidades

### Autenticação
- Login e registro de usuários
- Autenticação via JWT (JSON Web Token)
- Proteção de rotas para usuários autenticados

### Produtos
- Criar, visualizar, editar e excluir produtos
- Categorização de produtos
- Preços e descrições detalhadas
- Associação com categorias

### Categorias
- Gerenciamento completo de categorias
- Organização hierárquica de produtos
- Facilidade na classificação

### Feedbacks
- Sistema de avaliação com estrelas (1-5)
- Comentários sobre produtos
- Visualização de feedbacks por produto
- Gestão de feedbacks pelo usuário

## 🛠 Tecnologias Utilizadas

- **Backend:**
  - Node.js
  - Express.js
  - Sequelize ORM
  - JWT para autenticação
  - MySQL/PostgreSQL (banco de dados)

- **Frontend:**
  - EJS (template engine)
  - Bootstrap 5
  - Font Awesome
  - JavaScript vanilla

- **Segurança:**
  - Bcrypt para hash de senhas
  - Validação de dados
  - Proteção contra XSS
  - Middleware de autenticação

## 💻 Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- MySQL/PostgreSQL instalado
- Git

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/vozzy.git
cd vozzy
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=vozzy_db
JWT_SECRET=seu_jwt_secret
```

4. Execute as migrações do banco de dados:
```bash
npm run migrate
```

5. Inicie o servidor:
```bash
npm start
```

## 📚 Estrutura do Projeto

```
vozzy/
├── config/         # Configurações do projeto
├── controllers/    # Controladores da aplicação
├── middlewares/    # Middlewares personalizados
├── models/         # Modelos do Sequelize
├── public/         # Arquivos estáticos
├── routes/         # Rotas da aplicação
├── views/          # Templates EJS
└── app.js         # Arquivo principal
```

## 🔐 Rotas da API

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de novo usuário

### Produtos
- `GET /api/products` - Lista todos os produtos
- `POST /api/products` - Cria novo produto
- `PUT /api/products/:id` - Atualiza produto
- `DELETE /api/products/:id` - Remove produto

### Categorias
- `GET /api/categories` - Lista todas as categorias
- `POST /api/categories` - Cria nova categoria
- `PUT /api/categories/:id` - Atualiza categoria
- `DELETE /api/categories/:id` - Remove categoria

### Feedbacks
- `GET /api/feedbacks` - Lista todos os feedbacks
- `POST /api/feedbacks` - Cria novo feedback
- `DELETE /api/feedbacks/:id` - Remove feedback

## 👥 Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença GNU General Public License v3.0. Esta licença garante que o software permaneça livre e que todas as modificações e trabalhos derivados também sejam distribuídos sob os mesmos termos. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Principais pontos da licença:
- Liberdade para usar o software para qualquer finalidade
- Liberdade para modificar o software de acordo com suas necessidades
- Liberdade para compartilhar o software com seus amigos e vizinhos
- Liberdade para compartilhar as modificações que você fizer

## 🤝 Suporte

Para suporte, envie um email para seu-email@exemplo.com ou abra uma issue no repositório.

## ✨ Interface

O sistema possui uma interface moderna e responsiva, com:
- Design limpo e intuitivo
- Temas gradientes modernos
- Ícones Font Awesome
- Componentes Bootstrap personalizados
- Feedback visual para ações do usuário
- Sistema de avaliação com estrelas interativo

## 🔄 Atualizações Futuras

- [ ] Dashboard com estatísticas
- [ ] Sistema de notificações
- [ ] Exportação de relatórios
- [ ] Integração com sistemas externos
- [ ] Área administrativa avançada 
