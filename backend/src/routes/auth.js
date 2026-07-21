const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

const COOKIE_NAME = 'adminToken';
const isProd = process.env.NODE_ENV === 'production';
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: isProd ? 'none' : 'lax',
  secure: isProd,
  maxAge: 24 * 60 * 60 * 1000, // 24h
  path: '/',
};

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Usuário e senha são obrigatórios.' });
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminPasswordHash) {
    console.error('ADMIN_PASSWORD_HASH not set in environment');
    return res.status(500).json({ success: false, message: 'Erro de configuração do servidor.' });
  }

  const usernameMatch = username === adminUsername;
  const passwordMatch = await bcrypt.compare(password, adminPasswordHash);

  if (!usernameMatch || !passwordMatch) {
    return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
  return res.json({ success: true });
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  return res.json({ success: true });
});

router.get('/check', (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ success: false });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ success: true });
  } catch {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    return res.status(401).json({ success: false });
  }
});

module.exports = router;
