# Lobianco Investimentos

Plataforma web moderna para gerenciamento e apresentação de investimentos imobiliários. Desenvolvida com React, TypeScript, Tailwind CSS, Express, tRPC e Supabase.

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** 18+ (recomendado 20+)
- **pnpm** (gerenciador de pacotes) - instale com `npm install -g pnpm`
- **MySQL 8.0+** ou **TiDB Cloud** (para banco de dados)
- **Supabase** (para armazenamento de arquivos)

### Setup Local (VSCode)

#### 1. Clone o repositório

```bash
git clone https://github.com/Wevertonlds/manus.git
cd manus/lobianco-site
```

#### 2. Instale as dependências

```bash
pnpm install
```

#### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus valores:

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
# Database (MySQL local ou TiDB Cloud)
DATABASE_URL="mysql://root:password@localhost:3306/lobianco_dev"

# Supabase (obtenha em https://supabase.com)
SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sua-chave-de-servico"
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="sua-chave-anonima"

# Outras variáveis opcionais...
```

#### 4. Configure o banco de dados

**Opção A: MySQL Local**

```bash
# Instale MySQL (macOS com Homebrew)
brew install mysql

# Inicie o MySQL
brew services start mysql

# Crie o banco de dados
mysql -u root -e "CREATE DATABASE lobianco_dev;"
```

**Opção B: TiDB Cloud**

1. Acesse [TiDB Cloud](https://tidbcloud.com)
2. Crie um cluster
3. Copie a string de conexão para `DATABASE_URL`

#### 5. Execute as migrações do banco de dados

```bash
pnpm db:push
```

#### 6. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

O site estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
lobianco-site/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas do site
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/           # Utilitários (tRPC, Supabase)
│   │   ├── App.tsx        # Router principal
│   │   └── index.css      # Estilos globais
│   └── index.html
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # Definição de procedures tRPC
│   ├── db.ts              # Queries do banco de dados
│   └── storage-router.ts  # Upload de arquivos
├── drizzle/               # Schema e migrações
│   ├── schema.ts          # Definição das tabelas
│   └── migrations/        # Histórico de migrações
├── shared/                # Código compartilhado
│   └── const.ts           # Constantes globais
├── .env.local.example     # Variáveis de ambiente (exemplo)
└── package.json
```

## 🔑 Variáveis de Ambiente

### Obrigatórias para desenvolvimento local

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | String de conexão MySQL/TiDB | `mysql://root:pass@localhost:3306/db` |
| `SUPABASE_URL` | URL do projeto Supabase | `https://xxxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço Supabase | `eyJhbGc...` |
| `VITE_SUPABASE_URL` | URL Supabase (frontend) | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima Supabase | `eyJhbGc...` |

### Opcionais (para autenticação)

| Variável | Descrição |
|----------|-----------|
| `VITE_APP_ID` | ID da aplicação Manus OAuth |
| `JWT_SECRET` | Chave secreta para sessões |
| `OAUTH_SERVER_URL` | URL do servidor OAuth |

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento

# Build
pnpm build            # Build para produção
pnpm preview          # Preview do build

# Database
pnpm db:push          # Aplica migrações
pnpm db:studio        # Abre Drizzle Studio (visualizador de BD)

# Linting
pnpm lint             # Verifica erros de linting
```

## 🗄️ Banco de Dados

### Tabelas principais

- **users** - Usuários autenticados
- **carrossel** - Slides do carrossel da homepage
- **investimentos** - Propriedades/investimentos imobiliários
- **config** - Configurações do site (quem somos, cor primária, etc)
- **settings** - Links de redes sociais (WhatsApp, Facebook, Instagram)

### Criar dados de exemplo

```bash
# Execute o script de seed
node seed-db.mjs
```

## 📸 Supabase Storage

O projeto usa Supabase para armazenar imagens:

- **Bucket: carrossel** - Imagens dos slides
- **Bucket: investimentos** - Fotos dos imóveis
- **Bucket: config** - Logo e banner do site

### Configurar RLS (Row Level Security)

Execute o arquivo `supabase-rls-fix.sql` no SQL Editor do Supabase para configurar as políticas de segurança.

## 🔐 Autenticação

O projeto usa **Manus OAuth** para autenticação. Para desenvolvimento local sem OAuth:

1. Deixe `VITE_APP_ID` em branco
2. O site funcionará em modo público
3. A área de gestão estará protegida por verificação de role

## 🚀 Deploy

### Deploy no Manus

1. Faça um checkpoint: `webdev_save_checkpoint`
2. Clique no botão "Publish" na interface de gerenciamento

### Deploy em outro servidor

```bash
# Build para produção
pnpm build

# Deploy a pasta dist/ para seu servidor
# Exemplo com Vercel:
vercel deploy dist/
```

## 🐛 Troubleshooting

### Erro: "Unknown column 'endereco' in 'field list'"

Execute as migrações do banco:
```bash
pnpm db:push
```

### Erro: "Cannot connect to database"

Verifique se:
- MySQL/TiDB está rodando
- `DATABASE_URL` está correto em `.env.local`
- Banco de dados foi criado

### Erro: "Supabase connection failed"

Verifique se:
- `SUPABASE_URL` e chaves estão corretos
- Projeto Supabase está ativo
- Buckets foram criados

## 📚 Documentação

- [React Documentation](https://react.dev)
- [tRPC Documentation](https://trpc.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Supabase Documentation](https://supabase.com/docs)

## 📝 Licença

Todos os direitos reservados © 2024 Lobianco Investimentos

## 📞 Suporte

Para dúvidas ou problemas, entre em contato através dos links de redes sociais no site.
