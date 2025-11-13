import { getDb } from './server/db.ts';
import { carrossel, investimentos, config } from './drizzle/schema.ts';

async function seedDatabase() {
  const db = await getDb();
  
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }

  try {
    // Insert carrossel data
    await db.insert(carrossel).values([
      {
        titulo: 'Oportunidade de Ouro',
        descricao: 'Invista em projetos imobiliários premium com retorno garantido',
        imagemUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=500&fit=crop'
      },
      {
        titulo: 'Crescimento Patrimonial',
        descricao: 'Aumente seu patrimônio com investimentos imobiliários seguros',
        imagemUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=500&fit=crop'
      },
      {
        titulo: 'Futuro Seguro',
        descricao: 'Garanta seu futuro financeiro com a Lobianco',
        imagemUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=500&fit=crop'
      }
    ]);

    // Insert investimentos data
    await db.insert(investimentos).values([
      {
        tipo: 'lancamentos',
        titulo: 'Residencial Lobianco Premium',
        descricao: 'Apartamentos de luxo no melhor bairro da cidade. Acabamento premium, localização estratégica e infraestrutura completa.',
        imagemUrl: 'https://images.unsplash.com/photo-1512207736139-afc10e0e5e6f?w=400&h=300&fit=crop'
      },
      {
        tipo: 'na_planta',
        titulo: 'Edifício Comercial Centro',
        descricao: 'Salas comerciais modernas no coração do centro. Perfeito para empresas que buscam visibilidade e acessibilidade.',
        imagemUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'
      },
      {
        tipo: 'aluguel',
        titulo: 'Condomínio Residencial Seguro',
        descricao: 'Casarões e apartamentos para aluguel em condomínio fechado. Segurança 24h, áreas de lazer e infraestrutura completa.',
        imagemUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop'
      }
    ]);

    // Insert config data
    await db.insert(config).values({
      quemSomos: 'Lobianco Investimentos é uma empresa especializada em investimentos imobiliários, oferecendo oportunidades de crescimento patrimonial através de projetos imobiliários de qualidade. Com anos de experiência no mercado, garantimos transparência e segurança em cada investimento.',
      corPrimaria: '#1E40AF',
      tamanho: 16
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
