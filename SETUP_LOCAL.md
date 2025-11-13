# 🖥️ Guia de Setup Local - Lobianco Investimentos

Este guia mostra como executar o projeto localmente no seu computador usando VSCode.

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js 18+** - [Download](https://nodejs.org)
   ```bash
   node --version  # Verifique a versão
   ```

2. **pnpm** - Gerenciador de pacotes rápido
   ```bash
   npm install -g pnpm
   pnpm --version
   ```

3. **Git** - [Download](https://git-scm.com)
   ```bash
   git --version
   ```

4. **MySQL 8.0+** ou **TiDB Cloud**
   - macOS: `brew install mysql`
   - Windows: [Download MySQL](https://dev.mysql.com/downloads/mysql/)
   - Linux: `sudo apt-get install mysql-server`

5. **VSCode** - [Download](https://code.visualstudio.com)

## 🚀 Passo 1: Clone o Repositório

```bash
# Clone o repositório
git clone https://github.com/Wevertonlds/manus.git

# Entre na pasta do projeto
cd manus/lobianco-site
```

## 📦 Passo 2: Instale as Dependências

```bash
pnpm install
```

Isso vai instalar todas as dependências do projeto (pode levar alguns minutos).

## 🔧 Passo 3: Configure o Banco de Dados

### Opção A: MySQL Local (Recomendado para desenvolvimento)

**macOS:**
```bash
# Instale MySQL
brew install mysql

# Inicie o serviço
brew services start mysql

# Crie o banco de dados
mysql -u root -e "CREATE DATABASE lobianco_dev;"

# Verifique a conexão
mysql -u root -e "SELECT 1;"
```

**Windows:**
1. Baixe [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
2. Execute o instalador
3. Configure com usuário `root` e senha vazia (ou sua senha)
4. Abra Command Prompt e crie o banco:
   ```bash
   mysql -u root -p
   CREATE DATABASE lobianco_dev;
   EXIT;
   ```

**Linux (Ubuntu/Debian):**
```bash
# Instale MySQL
sudo apt-get update
sudo apt-get install mysql-server

# Inicie o serviço
sudo systemctl start mysql

# Crie o banco
sudo mysql -u root -e "CREATE DATABASE lobianco_dev;"
```

### Opção B: TiDB Cloud (Alternativa)

1. Acesse [TiDB Cloud](https://tidbcloud.com)
2. Crie uma conta gratuita
3. Crie um cluster
4. Copie a string de conexão

## 🔑 Passo 4: Configure as Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.local.example .env.local
```

Abra `.env.local` no VSCode e preencha:

```env
# ========== BANCO DE DADOS ==========
# Para MySQL local:
DATABASE_URL="mysql://root:@localhost:3306/lobianco_dev"

# Para TiDB Cloud (copie a string de conexão):
# DATABASE_URL="mysql://[user]:[password]@[host]:4000/lobianco_dev"

# ========== SUPABASE ==========
# 1. Acesse https://supabase.com
# 2. Crie um projeto
# 3. Vá para Settings > API
# 4. Copie as chaves abaixo:

SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ========== OUTRAS VARIÁVEIS ==========
# Deixe em branco ou use valores padrão:
VITE_APP_TITLE="Lobianco Investimentos"
VITE_APP_LOGO="/logo.png"
NODE_ENV="development"
```

## 🗄️ Passo 5: Configure o Supabase

### Criar Buckets de Storage

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá para **Storage** > **Buckets**
3. Crie 3 buckets:
   - `carrossel` (para slides)
   - `investimentos` (para fotos de imóveis)
   - `config` (para logo e banner)

### Criar Tabelas

1. Vá para **SQL Editor**
2. Crie uma nova query
3. Cole o conteúdo do arquivo `supabase-setup.sql`
4. Execute (clique em "Run")

### Configurar RLS (Segurança)

1. Vá para **SQL Editor**
2. Crie uma nova query
3. Cole o conteúdo do arquivo `supabase-rls-fix.sql`
4. Execute

## 📊 Passo 6: Execute as Migrações do Banco

```bash
pnpm db:push
```

Isso vai criar todas as tabelas no seu banco de dados local.

## 🌱 Passo 7: Popule com Dados de Exemplo (Opcional)

```bash
node seed-db.mjs
```

Isso vai inserir dados de exemplo (carrossel, investimentos, configurações).

## 🎉 Passo 8: Inicie o Servidor

```bash
pnpm dev
```

Você verá algo como:
```
VITE v5.0.0  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

## 🌐 Acesse o Site

Abra seu navegador e acesse: **http://localhost:5173**

## 🔐 Acessar a Área de Gestão

1. Clique em "Área de Gestão" no footer
2. Faça login (sem autenticação local, clique em "Entrar")
3. Acesse o painel administrativo

## 📝 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor com hot reload

# Build
pnpm build            # Build para produção
pnpm preview          # Preview do build

# Database
pnpm db:push          # Aplica migrações
pnpm db:studio        # Abre visualizador de banco (Drizzle Studio)

# Linting
pnpm lint             # Verifica erros
```

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

**Solução:**
```bash
# Verifique se MySQL está rodando
mysql -u root -e "SELECT 1;"

# Se não funcionar, inicie o MySQL:
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql
# Windows: Abra Services e inicie MySQL
```

### Erro: "Unknown column 'endereco'"

**Solução:**
```bash
pnpm db:push
```

### Erro: "Supabase connection failed"

**Solução:**
1. Verifique se as chaves em `.env.local` estão corretas
2. Verifique se o projeto Supabase está ativo
3. Teste a conexão no [Supabase Dashboard](https://app.supabase.com)

### Porta 5173 já em uso

**Solução:**
```bash
# Use outra porta
pnpm dev -- --port 3000
```

## 📚 Próximos Passos

1. **Explore o código** - Abra `client/src/pages/Home.tsx` para entender a estrutura
2. **Modifique o design** - Edite `client/src/index.css` para mudar cores
3. **Adicione funcionalidades** - Crie novos componentes em `client/src/components/`
4. **Teste localmente** - Clique em "Ver Mais" nos cards para testar

## 💡 Dicas

- Use **Drizzle Studio** para visualizar o banco: `pnpm db:studio`
- Pressione `h` no terminal durante `pnpm dev` para ver atalhos
- Abra DevTools do navegador (F12) para debug
- Use **VS Code Extensions**: Tailwind CSS IntelliSense, Prettier

## 🚀 Fazer Deploy

Quando estiver pronto para publicar:

```bash
# Build para produção
pnpm build

# Deploy em Vercel, Netlify, ou seu servidor
# Exemplo Vercel:
npm i -g vercel
vercel deploy
```

## ❓ Dúvidas?

Se tiver problemas:
1. Verifique o [README.md](./README.md)
2. Abra uma issue no GitHub
3. Verifique os logs no console (F12 no navegador)

---

**Bom desenvolvimento! 🚀**
