-- Create tables for Lobianco Investimentos
-- Run this SQL in Supabase SQL Editor

-- Users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  open_id VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  login_method VARCHAR(64),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_signed_in TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carrossel table
CREATE TABLE IF NOT EXISTS carrossel (
  id BIGSERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investimentos table
CREATE TABLE IF NOT EXISTS investimentos (
  id BIGSERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('lancamentos', 'na_planta', 'aluguel')),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Config table
CREATE TABLE IF NOT EXISTS config (
  id BIGSERIAL PRIMARY KEY,
  quem_somos TEXT,
  cor_primaria VARCHAR(7),
  tamanho INTEGER DEFAULT 16,
  logo TEXT,
  banner TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('carrossel', 'carrossel', true)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('investimentos', 'investimentos', true)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('config', 'config', true)
ON CONFLICT DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE carrossel ENABLE ROW LEVEL SECURITY;
ALTER TABLE investimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Allow public read carrossel" ON carrossel
  FOR SELECT USING (true);

CREATE POLICY "Allow public read investimentos" ON investimentos
  FOR SELECT USING (true);

CREATE POLICY "Allow public read config" ON config
  FOR SELECT USING (true);

-- Create RLS policies for authenticated admin write access
CREATE POLICY "Allow admin write carrossel" ON carrossel
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.open_id = auth.uid()::text
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Allow admin update carrossel" ON carrossel
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.open_id = auth.uid()::text
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Allow admin delete carrossel" ON carrossel
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.open_id = auth.uid()::text
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Allow admin write investimentos" ON investimentos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.open_id = auth.uid()::text
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Allow admin update investimentos" ON investimentos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.open_id = auth.uid()::text
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Allow admin delete investimentos" ON investimentos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.open_id = auth.uid()::text
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Allow admin write config" ON config
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.open_id = auth.uid()::text
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Allow admin update config" ON config
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.open_id = auth.uid()::text
      AND users.role = 'admin'
    )
  );

-- Insert sample data
INSERT INTO carrossel (titulo, descricao, imagem_url)
VALUES
  ('Oportunidade de Ouro', 'Invista em projetos imobiliários premium com retorno garantido', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=500&fit=crop'),
  ('Crescimento Patrimonial', 'Aumente seu patrimônio com investimentos imobiliários seguros', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=500&fit=crop'),
  ('Futuro Seguro', 'Garanta seu futuro financeiro com a Lobianco', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=500&fit=crop');

INSERT INTO investimentos (tipo, titulo, descricao, imagem_url)
VALUES
  ('lancamentos', 'Residencial Lobianco Premium', 'Apartamentos de luxo no melhor bairro da cidade. Acabamento premium, localização estratégica e infraestrutura completa.', 'https://images.unsplash.com/photo-1512207736139-afc10e0e5e6f?w=400&h=300&fit=crop'),
  ('na_planta', 'Edifício Comercial Centro', 'Salas comerciais modernas no coração do centro. Perfeito para empresas que buscam visibilidade e acessibilidade.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'),
  ('aluguel', 'Condomínio Residencial Seguro', 'Casarões e apartamentos para aluguel em condomínio fechado. Segurança 24h, áreas de lazer e infraestrutura completa.', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop');

INSERT INTO config (quem_somos, cor_primaria, tamanho)
VALUES
  ('Lobianco Investimentos é uma empresa especializada em investimentos imobiliários, oferecendo oportunidades de crescimento patrimonial através de projetos imobiliários de qualidade. Com anos de experiência no mercado, garantimos transparência e segurança em cada investimento.', '#1E40AF', 16);
