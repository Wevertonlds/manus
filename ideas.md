# Lobianco Investimentos - Design Decisions

## Visão Geral
Site full-stack para "Lobianco Investimentos" (investimentos imobiliários) usando React 19 + Tailwind 4 + Express 4 + tRPC 11 com autenticação Manus OAuth integrada.

## Arquitetura Técnica
- **Frontend:** React 19 com Tailwind CSS 4 para estilização clean e responsiva
- **Backend:** Express 4 com tRPC 11 para APIs type-safe
- **Banco de Dados:** MySQL com Drizzle ORM
- **Autenticação:** Manus OAuth integrado (admin-only para área de gestão)
- **Storage:** S3 para fotos/imagens (via storagePut helper)
- **Hospedagem:** Manus (dev) e Vercel (produção)

## Paleta de Cores
- **Preto:** #000000 (textos principais, backgrounds)
- **Azul:** #1E40AF (links, botões, acentos)
- **Branco:** #FFFFFF (backgrounds claros)
- **Cinza:** #F3F4F6 (backgrounds secundários)
- **Vermelho:** #DC2626 (botões delete, alertas)

## Design & UX
- **Tema:** Clean e profissional
- **Tipografia:** Sans-serif (Inter via Tailwind)
- **Responsividade:** Mobile-first com breakpoints Tailwind (sm/md/lg)
- **Espaçamento:** Padding 1-2rem, bordas arredondadas (rounded-lg)
- **Sombras:** Sutis (shadow-md)
- **Logo:** Hexágono azul com edifícios, texto "LOBIANCO INVESTIMENTOS" em branco/azul

## Estrutura de Dados
### Tabelas Principais
1. **carrossel:** Slides dinâmicos (id, titulo, descricao, imagem_url, created_at)
2. **investimentos:** Cards de investimentos (id, tipo, titulo, descricao, imagem_url)
3. **config:** Configurações do site (id, quem_somos, cor_json, tamanho)

## Funcionalidades por Seção

### Homepage
- **Header:** Logo à esquerda, nav links (Home, Compra na Planta, Aluguel) à direita, botão "Entrar"
- **Carousel:** 3 slides dinâmicos com auto-play (5s), setas/indicadores, botão "Saiba Mais"
- **Cards Grid:** 3 cards com dados de investimentos, botão "Ver Mais"
- **Footer:** Seções "Quem Somos", "Volta Início", "Área de Gestão" (admin-only)

### Autenticação
- **Modal Login/Cadastro:** Email + senha (min 8 chars), validação, toast notifications
- **Proteção:** RLS no banco, admin-only para área de gestão

### Admin Panel
- **Upload:** Fotos/logos para S3 storage
- **Edição:** Títulos, descrições, cores, tamanhos
- **CRUD:** Criar, editar, deletar conteúdo com confirmação

## Implementação
1. Configurar banco de dados com tabelas
2. Implementar componentes (Header, Footer, Carousel, Cards, Modals)
3. Integrar autenticação Manus OAuth
4. Implementar área de admin com upload e edição
5. Testar funcionalidades
6. Deploy via Publish button

## Performance & SEO
- Lazy loading de imagens
- Code splitting automático
- Meta tags para SEO
- PWA basics (opcional)

## Notas Importantes
- O site usa o template tRPC + Manus Auth do Manus
- Não usar Supabase (usar banco de dados do Manus)
- Não usar Next.js App Router (usar React Router com Express)
- Usar storagePut para upload de arquivos (S3)
- Implementar RLS para segurança
