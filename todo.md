# Lobianco Investimentos - TODO

## Infraestrutura & Configuração
- [x] Inicializar projeto Next.js com TypeScript e Tailwind CSS
- [x] Configurar banco de dados com tabelas (carrossel, investimentos, config)
- [x] Configurar autenticação com Manus OAuth
- [x] Criar arquivo ideas.md com design decisions

## Componentes & Layout
- [x] Implementar Header com logo, navegação e botão "Entrar"
- [x] Implementar Footer com seções "Quem Somos", "Volta Início", "Área de Gestão"
- [x] Implementar Carousel dinâmico com 3 slides (dados do DB)
- [x] Implementar Cards Grid com dados de investimentos
- [x] Implementar Modal de Login/Cadastro
- [x] Implementar Modal de Admin/Configuração

## Funcionalidades
- [x] Integrar dados dinâmicos do Carousel (tabela carrossel)
- [x] Integrar dados dinâmicos dos Cards (tabela investimentos)
- [x] Implementar autenticação (login/cadastro)
- [x] Implementar área de admin para edição de conteúdo
- [x] Implementar upload de fotos para S3 Storage
- [x] Implementar edição de textos e configurações
- [x] Implementar proteção de rotas (RLS)
- [x] Implementar CRUD completo para Carrossel (editar e excluir slides)
- [x] Implementar CRUD completo para Investimentos
- [x] Implementar CRUD completo para Configurações

## Design & Estilo
- [x] Definir paleta de cores (preto #000000, azul #1E40AF, branco #FFFFFF, cinza #F3F4F6, vermelho #DC2626)
- [x] Aplicar Tailwind CSS com design clean e responsivo
- [x] Implementar design mobile-first
- [x] Adicionar logo do Lobianco

## Ajustes Finais
- [x] Adicionar campos Instagram, Facebook e WhatsApp no modal de configuração
- [x] Expandir modal "Ver Mais" com detalhes completos (endereço, banheiro, piscina, etc)
- [x] Remover login do header, deixar apenas no footer

## Testes & Deploy
- [x] Testar funcionalidades no localhost
- [x] Testar login/cadastro
- [x] Testar upload de imagens
- [x] Testar edição de conteúdo
- [x] Criar checkpoint para deploy
- [ ] Deploy no Vercel (via Publish)


## Integração Supabase
- [ ] Integrar Supabase (substituir banco MySQL local)
- [ ] Criar tabelas no Supabase (carrossel, investimentos, config)
- [ ] Criar bucket de storage para fotos
- [ ] Expandir modal de admin com upload de logo e banner
- [ ] Adicionar configurações de propriedades no modal
- [ ] Remover "Área de Gestão" do header
- [ ] Testar upload de imagens para Supabase Storage
- [ ] Testar CRUD completo com Supabase
