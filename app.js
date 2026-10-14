const express = require('express');
const path = require('path');
const produtosRouters = require('./src/routes/produtos.routes');
const usuariosRouters = require ('./src/routes/usuarios.routes');
const rateLimit = require('express-rate-limit');

const app = express();

// app.js — antes das outras rotas
app.get('/', (req, res) => {
  res.json({ status: 'API no ar!', versao: '1.0.0' });
});

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/produtos', produtosRouters);
app.use('/usuarios', usuariosRouters);

const limitadorGeral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por IP nesse período
  message: { erro: 'Muitas requisições, tente novamente mais tarde' },
});

app.use(limitadorGeral);

const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // só 5 tentativas de login a cada 15 min
  message: { erro: 'Muitas tentativas de login, tente novamente mais tarde' },
});

app.use('/usuarios/login', limitadorLogin);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ erro: err.message || 'Erro interno do servidor' });
});

module.exports = app;