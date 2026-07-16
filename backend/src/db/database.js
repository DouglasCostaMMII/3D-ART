const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '6543'),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT,
        active INTEGER DEFAULT 1,
        stock INTEGER DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS product_images (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        is_primary INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS product_variations (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        value TEXT NOT NULL
      );
    `);

    const { rows } = await client.query('SELECT COUNT(*) as cnt FROM products');
    if (parseInt(rows[0].cnt) === 0) {
      await seedProducts(client);
    }

    console.log('Database initialized.');
  } finally {
    client.release();
  }
}

async function seedProducts(client) {
  const products = [
    {
      id: uuidv4(), name: 'Vaso Modular Orgânico',
      description: 'Vaso decorativo com formas orgânicas e modulares, impresso em PLA de alta qualidade. Perfeito para plantas pequenas e suculentas.',
      price: 45.00, category: 'Decoração', stock: 15, imageIndex: 1,
      colors: ['Branco', 'Preto', 'Azul'],
    },
    {
      id: uuidv4(), name: 'Porta-Treco Geométrico',
      description: 'Porta-treco com design geométrico inspirado na arquitetura moderna. Ideal para organizar objetos pequenos na mesa.',
      price: 35.00, category: 'Decoração', stock: 20, imageIndex: 2,
      colors: ['Branco', 'Preto'],
    },
    {
      id: uuidv4(), name: 'Suporte para Celular',
      description: 'Suporte ergonômico para celular, compatível com todos os smartphones. Ângulo ajustado para conforto máximo.',
      price: 28.00, category: 'Utilidades', stock: 30, imageIndex: 3,
      sizes: ['P', 'M', 'G'],
    },
    {
      id: uuidv4(), name: 'Organizador de Mesa',
      description: 'Organizador modular para mesa de trabalho com compartimentos para canetas, clipes e acessórios de escritório.',
      price: 55.00, category: 'Utilidades', stock: 10, imageIndex: 4,
      colors: ['Branco', 'Preto', 'Azul'], sizes: ['M', 'G'],
    },
    {
      id: uuidv4(), name: 'Miniatura Arquitetônica',
      description: 'Miniatura detalhada de edificações famosas, impressa com resolução ultra-alta. Uma obra de arte para colecionadores.',
      price: 89.00, category: 'Arte', stock: 5, imageIndex: 5,
      colors: ['Branco'],
    },
    {
      id: uuidv4(), name: 'Kit Brinquedos Educativos',
      description: 'Kit com brinquedos educativos para crianças de 3 a 10 anos. Estimula criatividade e coordenação motora. Material atóxico.',
      price: 120.00, category: 'Educação', stock: 8, imageIndex: 6,
      colors: ['Branco', 'Azul'], sizes: ['P', 'M'],
    },
  ];

  for (const p of products) {
    await client.query(
      `INSERT INTO products (id, name, description, price, category, active, stock) VALUES ($1,$2,$3,$4,$5,1,$6)`,
      [p.id, p.name, p.description, p.price, p.category, p.stock]
    );

    const imageUrl = `https://placehold.co/400x400/4f46e5/ffffff?text=Produto+${p.imageIndex}`;
    await client.query(
      `INSERT INTO product_images (id, product_id, url, is_primary) VALUES ($1,$2,$3,1)`,
      [uuidv4(), p.id, imageUrl]
    );

    for (const color of (p.colors || [])) {
      await client.query(
        `INSERT INTO product_variations (id, product_id, type, value) VALUES ($1,$2,'cor',$3)`,
        [uuidv4(), p.id, color]
      );
    }
    for (const size of (p.sizes || [])) {
      await client.query(
        `INSERT INTO product_variations (id, product_id, type, value) VALUES ($1,$2,'tamanho',$3)`,
        [uuidv4(), p.id, size]
      );
    }
  }

  console.log('Database seeded with 6 sample products.');
}

module.exports = { pool, initializeDatabase };
