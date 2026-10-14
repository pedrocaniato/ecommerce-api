const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

async function listar(req, res, next) {
  try {
    const pagina = Number(req.query.pagina) || 1;
    const limite = Number(req.query.limite) || 10;
    const nome = req.query.nome;

    const where = nome
      ? { nome: { contains: nome, mode: 'insensitive' } }
      : {};

    const [produtos, total] = await Promise.all([
      prisma.produto.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      prisma.produto.count({ where }),
    ]);

    res.json({
      dados: produtos,
      paginacao: {
        paginaAtual: pagina,
        totalPaginas: Math.ceil(total / limite),
        totalItens: total,
      },
    });
  } catch (erro) {
    next(erro);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const id = Number(req.params.id);
    const produto = await prisma.produto.findUnique({ where: { id } });

    if (!produto) {
      throw new AppError('Produto não encontrado', 404);
    }

    res.json(produto);
  } catch (erro) {
    next(erro);
  }
}

async function criar(req, res, next) {
  try {
    const { nome, preco, estoque } = req.body; // já validado pelo Zod

    const fotoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const novoProduto = await prisma.produto.create({
      data: { nome, preco, estoque: estoque ?? 0, fotoUrl },
    });

    res.status(201).json(novoProduto);
  } catch (erro) {
    next(erro);
  }
}

async function atualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { nome, preco, estoque } = req.body;

    const data = {};
    if (nome !== undefined) data.nome = nome;
    if (preco !== undefined) data.preco = preco;
    if (estoque !== undefined) data.estoque = estoque;
    if (req.file) data.fotoUrl = `/uploads/${req.file.filename}`;

    const produtoAtualizado = await prisma.produto.update({ where: { id }, data });
    res.json(produtoAtualizado);
  } catch (erro) {
    if (erro.code === 'P2025') {
      return next(new AppError('Produto não encontrado', 404));
    }
    next(erro);
  }
}

async function remover(req, res, next) {
  try {
    const id = Number(req.params.id);
    await prisma.produto.delete({ where: { id } });
    res.status(204).send();
  } catch (erro) {
    if (erro.code === 'P2025') {
      return next(new AppError('Produto não encontrado', 404));
    }
    next(erro);
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };