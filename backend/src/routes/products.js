const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const VALID_CATEGORIES = ['Decoração', 'Miniaturas', 'Utilidades', 'Arte', 'Personalizado', 'Outro'];

function validateProduct({ name, price, stock, category }) {
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 200) {
    return 'Nome deve ter entre 2 e 200 caracteres.';
  }
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice < 0 || parsedPrice > 999999) {
    return 'Preço inválido (deve ser entre 0 e 999999).';
  }
  if (stock !== undefined) {
    const parsedStock = parseInt(stock);
    if (isNaN(parsedStock) || parsedStock < 0 || parsedStock > 99999) {
      return 'Estoque inválido (deve ser entre 0 e 99999).';
    }
  }
  if (category && !VALID_CATEGORIES.includes(category)) {
    return `Categoria inválida. Use: ${VALID_CATEGORIES.join(', ')}.`;
  }
  return null;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});

const ALLOWED_EXTENSIONS = /\.(jpe?g|png|gif|webp|bmp|tiff?|heic|heif|avif)$/i;

const fileFilter = (req, file, cb) => {
  const extOk = ALLOWED_EXTENSIONS.test(path.extname(file.originalname));
  const mimeOk = file.mimetype.startsWith('image/');
  if (extOk || mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas.'));
  }
};

function uploadMiddleware(req, res, next) {
  upload.array('images', 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const msg = err.code === 'LIMIT_FILE_SIZE'
        ? 'Cada imagem deve ter no máximo 10MB.'
        : err.code === 'LIMIT_FILE_COUNT'
        ? 'Máximo de 5 imagens por produto.'
        : 'Erro no upload das imagens.';
      return res.status(400).json({ success: false, message: msg });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}

const upload = multer({ storage, fileFilter, limits: { files: 5, fileSize: 10 * 1024 * 1024 } });

async function getProductWithDetails(id) {
  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  if (!rows[0]) return null;
  const images = (await pool.query('SELECT * FROM product_images WHERE product_id = $1', [id])).rows;
  const variations = (await pool.query('SELECT * FROM product_variations WHERE product_id = $1', [id])).rows;
  return { ...rows[0], images, variations };
}

// GET /api/products - public
router.get('/', async (req, res) => {
  try {
    const { rows: products } = await pool.query('SELECT * FROM products WHERE active = 1 ORDER BY created_at DESC');
    const result = await Promise.all(products.map(async (p) => {
      const images = (await pool.query('SELECT * FROM product_images WHERE product_id = $1', [p.id])).rows;
      const variations = (await pool.query('SELECT * FROM product_variations WHERE product_id = $1', [p.id])).rows;
      return { ...p, images, variations };
    }));
    res.json({ success: true, products: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao buscar produtos.' });
  }
});

// GET /api/products/all - admin
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const { rows: products } = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    const result = await Promise.all(products.map(async (p) => {
      const images = (await pool.query('SELECT * FROM product_images WHERE product_id = $1', [p.id])).rows;
      const variations = (await pool.query('SELECT * FROM product_variations WHERE product_id = $1', [p.id])).rows;
      return { ...p, images, variations };
    }));
    res.json({ success: true, products: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao buscar produtos.' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await getProductWithDetails(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao buscar produto.' });
  }
});

// POST /api/products
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, category, active = 1, stock = 1, variations = [] } = req.body;
    const validationError = validateProduct({ name, price, stock, category });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }
    const id = uuidv4();
    await pool.query(
      `INSERT INTO products (id, name, description, price, category, active, stock) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, name, description || '', parseFloat(price), category || 'Outro', active ? 1 : 0, parseInt(stock) || 1]
    );
    const parsedVariations = typeof variations === 'string' ? JSON.parse(variations) : variations;
    for (const v of parsedVariations) {
      if (v.type && v.value) {
        await pool.query(
          `INSERT INTO product_variations (id, product_id, type, value) VALUES ($1,$2,$3,$4)`,
          [uuidv4(), id, v.type, v.value]
        );
      }
    }
    const product = await getProductWithDetails(id);
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao criar produto.' });
  }
});

// PUT /api/products/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    const existing = rows[0];
    const { name, description, price, category, active, stock, variations } = req.body;
    if (name !== undefined || price !== undefined) {
      const validationError = validateProduct({
        name: name ?? existing.name,
        price: price ?? existing.price,
        stock: stock ?? existing.stock,
        category: category ?? existing.category,
      });
      if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
      }
    }
    await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3, category=$4, active=$5, stock=$6, updated_at=NOW() WHERE id=$7`,
      [
        name ?? existing.name,
        description ?? existing.description,
        price !== undefined ? parseFloat(price) : existing.price,
        category ?? existing.category,
        active !== undefined ? (active ? 1 : 0) : existing.active,
        stock !== undefined ? parseInt(stock) : existing.stock,
        id,
      ]
    );
    if (variations !== undefined) {
      const parsed = typeof variations === 'string' ? JSON.parse(variations) : variations;
      await pool.query('DELETE FROM product_variations WHERE product_id = $1', [id]);
      for (const v of parsed) {
        if (v.type && v.value) {
          await pool.query(
            `INSERT INTO product_variations (id, product_id, type, value) VALUES ($1,$2,$3,$4)`,
            [uuidv4(), id, v.type, v.value]
          );
        }
      }
    }
    const product = await getProductWithDetails(id);
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao atualizar produto.' });
  }
});

// DELETE /api/products/:id (soft delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    await pool.query('UPDATE products SET active = 0, updated_at = NOW() WHERE id = $1', [id]);
    res.json({ success: true, message: 'Produto removido com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao remover produto.' });
  }
});

// PUT /api/products/:id/toggle-active
router.put('/:id/toggle-active', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    const newActive = rows[0].active === 1 ? 0 : 1;
    await pool.query('UPDATE products SET active = $1, updated_at = NOW() WHERE id = $2', [newActive, id]);
    const product = await getProductWithDetails(id);
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao alternar status.' });
  }
});

// POST /api/products/:id/images
router.post('/:id/images', authMiddleware, uploadMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Nenhuma imagem enviada.' });
    }
    const { rows: existing } = await pool.query('SELECT COUNT(*) as cnt FROM product_images WHERE product_id = $1', [id]);
    const newImages = [];
    for (const [index, file] of req.files.entries()) {
      const imageId = uuidv4();
      const url = `/uploads/${file.filename}`;
      const isPrimary = parseInt(existing[0].cnt) === 0 && index === 0 ? 1 : 0;
      await pool.query(
        `INSERT INTO product_images (id, product_id, url, is_primary) VALUES ($1,$2,$3,$4)`,
        [imageId, id, url, isPrimary]
      );
      newImages.push({ id: imageId, product_id: id, url, is_primary: isPrimary });
    }
    res.json({ success: true, images: newImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao fazer upload das imagens.' });
  }
});

// DELETE /api/products/:id/images/:imageId
router.delete('/:id/images/:imageId', authMiddleware, async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const { rows } = await pool.query('SELECT * FROM product_images WHERE id = $1 AND product_id = $2', [imageId, id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Imagem não encontrada.' });
    await pool.query('DELETE FROM product_images WHERE id = $1', [imageId]);
    if (rows[0].is_primary === 1) {
      const { rows: first } = await pool.query('SELECT id FROM product_images WHERE product_id = $1 LIMIT 1', [id]);
      if (first[0]) {
        await pool.query('UPDATE product_images SET is_primary = 1 WHERE id = $1', [first[0].id]);
      }
    }
    res.json({ success: true, message: 'Imagem removida.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao remover imagem.' });
  }
});

module.exports = router;
