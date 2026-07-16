const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas.'));
  }
};

const upload = multer({ storage, fileFilter, limits: { files: 5, fileSize: 10 * 1024 * 1024 } });

function getProductWithDetails(id) {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!product) return null;

  const images = db.prepare('SELECT * FROM product_images WHERE product_id = ?').all(id);
  const variations = db.prepare('SELECT * FROM product_variations WHERE product_id = ?').all(id);

  return { ...product, images, variations };
}

// GET /api/products - list all active products
router.get('/', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products WHERE active = 1 ORDER BY created_at DESC').all();

    const result = products.map((product) => {
      const images = db.prepare('SELECT * FROM product_images WHERE product_id = ?').all(product.id);
      const variations = db.prepare('SELECT * FROM product_variations WHERE product_id = ?').all(product.id);
      return { ...product, images, variations };
    });

    res.json({ success: true, products: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao buscar produtos.' });
  }
});

// GET /api/products/all - list ALL products (admin use)
router.get('/all', authMiddleware, (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();

    const result = products.map((product) => {
      const images = db.prepare('SELECT * FROM product_images WHERE product_id = ?').all(product.id);
      const variations = db.prepare('SELECT * FROM product_variations WHERE product_id = ?').all(product.id);
      return { ...product, images, variations };
    });

    res.json({ success: true, products: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao buscar produtos.' });
  }
});

// GET /api/products/:id - get single product
router.get('/:id', (req, res) => {
  try {
    const product = getProductWithDetails(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    }
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao buscar produto.' });
  }
});

// POST /api/products - create product
router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, description, price, category, active = 1, stock = 1, variations = [] } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Nome e preço são obrigatórios.' });
    }

    const id = uuidv4();

    db.prepare(`
      INSERT INTO products (id, name, description, price, category, active, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, description || '', parseFloat(price), category || 'Outro', active ? 1 : 0, parseInt(stock) || 1);

    const parsedVariations = typeof variations === 'string' ? JSON.parse(variations) : variations;
    const insertVariation = db.prepare(
      'INSERT INTO product_variations (id, product_id, type, value) VALUES (?, ?, ?, ?)'
    );
    for (const v of parsedVariations) {
      if (v.type && v.value) {
        insertVariation.run(uuidv4(), id, v.type, v.value);
      }
    }

    const product = getProductWithDetails(id);
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao criar produto.' });
  }
});

// PUT /api/products/:id - update product
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    }

    const { name, description, price, category, active, stock, variations } = req.body;

    db.prepare(`
      UPDATE products
      SET name = ?, description = ?, price = ?, category = ?, active = ?, stock = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      name ?? existing.name,
      description ?? existing.description,
      price !== undefined ? parseFloat(price) : existing.price,
      category ?? existing.category,
      active !== undefined ? (active ? 1 : 0) : existing.active,
      stock !== undefined ? parseInt(stock) : existing.stock,
      id
    );

    if (variations !== undefined) {
      const parsedVariations = typeof variations === 'string' ? JSON.parse(variations) : variations;
      db.prepare('DELETE FROM product_variations WHERE product_id = ?').run(id);
      const insertVariation = db.prepare(
        'INSERT INTO product_variations (id, product_id, type, value) VALUES (?, ?, ?, ?)'
      );
      for (const v of parsedVariations) {
        if (v.type && v.value) {
          insertVariation.run(uuidv4(), id, v.type, v.value);
        }
      }
    }

    const product = getProductWithDetails(id);
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao atualizar produto.' });
  }
});

// DELETE /api/products/:id - soft delete
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    }

    db.prepare("UPDATE products SET active = 0, updated_at = datetime('now') WHERE id = ?").run(id);
    res.json({ success: true, message: 'Produto removido com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao remover produto.' });
  }
});

// PUT /api/products/:id/toggle-active
router.put('/:id/toggle-active', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    }

    const newActive = existing.active === 1 ? 0 : 1;
    db.prepare("UPDATE products SET active = ?, updated_at = datetime('now') WHERE id = ?").run(newActive, id);

    const product = getProductWithDetails(id);
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao alternar status do produto.' });
  }
});

// POST /api/products/:id/images - upload images
router.post('/:id/images', authMiddleware, upload.array('images', 5), (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Nenhuma imagem enviada.' });
    }

    const existingImages = db.prepare('SELECT COUNT(*) as cnt FROM product_images WHERE product_id = ?').get(id);
    const insertImage = db.prepare(
      'INSERT INTO product_images (id, product_id, url, is_primary) VALUES (?, ?, ?, ?)'
    );

    const newImages = [];
    req.files.forEach((file, index) => {
      const imageId = uuidv4();
      const url = `/uploads/${file.filename}`;
      const isPrimary = existingImages.cnt === 0 && index === 0 ? 1 : 0;
      insertImage.run(imageId, id, url, isPrimary);
      newImages.push({ id: imageId, product_id: id, url, is_primary: isPrimary });
    });

    res.json({ success: true, images: newImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao fazer upload das imagens.' });
  }
});

// DELETE /api/products/:id/images/:imageId
router.delete('/:id/images/:imageId', authMiddleware, (req, res) => {
  try {
    const { id, imageId } = req.params;
    const image = db.prepare('SELECT * FROM product_images WHERE id = ? AND product_id = ?').get(imageId, id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Imagem não encontrada.' });
    }

    db.prepare('DELETE FROM product_images WHERE id = ?').run(imageId);

    if (image.is_primary) {
      const firstImage = db.prepare('SELECT * FROM product_images WHERE product_id = ? LIMIT 1').get(id);
      if (firstImage) {
        db.prepare('UPDATE product_images SET is_primary = 1 WHERE id = ?').run(firstImage.id);
      }
    }

    res.json({ success: true, message: 'Imagem removida com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao remover imagem.' });
  }
});

module.exports = router;
