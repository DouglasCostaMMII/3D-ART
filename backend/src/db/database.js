const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../../data.db');
const db = new Database(dbPath);

function initializeDatabase() {
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      active INTEGER DEFAULT 1,
      stock INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      url TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_variations (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      type TEXT NOT NULL,
      value TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
  if (count.cnt === 0) {
    seedProducts();
  }
}

function seedProducts() {
  const insertProduct = db.prepare(`
    INSERT INTO products (id, name, description, price, category, active, stock)
    VALUES (?, ?, ?, ?, ?, 1, ?)
  `);

  const insertImage = db.prepare(`
    INSERT INTO product_images (id, product_id, url, is_primary) VALUES (?, ?, ?, ?)
  `);

  const insertVariation = db.prepare(`
    INSERT INTO product_variations (id, product_id, type, value) VALUES (?, ?, ?, ?)
  `);

  const products = [
    {
      id: uuidv4(),
      name: 'Vaso Modular Orgânico',
      description: 'Vaso decorativo com formas orgânicas e modulares, impresso em PLA de alta qualidade. Perfeito para plantas pequenas e suculentas. Design exclusivo que combina modernidade e natureza.',
      price: 45.00,
      category: 'Decoração',
      stock: 15,
      imageIndex: 1,
      colors: ['Branco', 'Preto', 'Azul'],
    },
    {
      id: uuidv4(),
      name: 'Porta-Treco Geométrico',
      description: 'Porta-treco com design geométrico inspirado na arquitetura moderna. Ideal para organizar objetos pequenos em cima da mesa ou criado-mudo. Resistente e elegante.',
      price: 35.00,
      category: 'Decoração',
      stock: 20,
      imageIndex: 2,
      colors: ['Branco', 'Preto'],
    },
    {
      id: uuidv4(),
      name: 'Suporte para Celular',
      description: 'Suporte ergonômico para celular, compatível com todos os modelos de smartphones. Ângulo de visão ajustado para conforto máximo. Antiderrapante e durável.',
      price: 28.00,
      category: 'Utilidades',
      stock: 30,
      imageIndex: 3,
      sizes: ['P', 'M', 'G'],
    },
    {
      id: uuidv4(),
      name: 'Organizador de Mesa',
      description: 'Organizador modular para mesa de trabalho. Compartimentos para canetas, clipes, post-its e outros acessórios de escritório. Aumenta a produtividade com estilo.',
      price: 55.00,
      category: 'Utilidades',
      stock: 10,
      imageIndex: 4,
      colors: ['Branco', 'Preto', 'Azul'],
      sizes: ['M', 'G'],
    },
    {
      id: uuidv4(),
      name: 'Miniatura Arquitetônica',
      description: 'Miniatura detalhada de edificações arquitetônicas famosas. Impressa com resolução ultra-alta para capturar todos os detalhes. Uma obra de arte em miniatura para colecionadores.',
      price: 89.00,
      category: 'Arte',
      stock: 5,
      imageIndex: 5,
      colors: ['Branco'],
    },
    {
      id: uuidv4(),
      name: 'Kit Brinquedos Educativos',
      description: 'Kit completo com brinquedos educativos para crianças de 3 a 10 anos. Peças coloridas que estimulam a criatividade, coordenação motora e aprendizado. Feito com material atóxico e seguro.',
      price: 120.00,
      category: 'Educação',
      stock: 8,
      imageIndex: 6,
      colors: ['Branco', 'Azul'],
      sizes: ['P', 'M'],
    },
  ];

  const seedAll = db.transaction(() => {
    for (const product of products) {
      insertProduct.run(
        product.id,
        product.name,
        product.description,
        product.price,
        product.category,
        product.stock
      );

      const imageUrl = `https://placehold.co/400x400/4f46e5/ffffff?text=Produto+${product.imageIndex}`;
      insertImage.run(uuidv4(), product.id, imageUrl, 1);

      if (product.colors) {
        for (const color of product.colors) {
          insertVariation.run(uuidv4(), product.id, 'cor', color);
        }
      }
      if (product.sizes) {
        for (const size of product.sizes) {
          insertVariation.run(uuidv4(), product.id, 'tamanho', size);
        }
      }
    }
  });

  seedAll();
  console.log('Database seeded with 6 sample products.');
}

initializeDatabase();

module.exports = { db };
