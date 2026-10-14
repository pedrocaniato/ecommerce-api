const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

const SALT_ROUNDS = 10;

async function cadastrar(req, res, next) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      throw new AppError('nome, email e senha são obrigatórios', 400);
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash },
    });

    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json(usuarioSemSenha);
  } catch (erro) {
    if (erro.code === 'P2002') {
      return next(new AppError('E-mail já cadastrado', 409));
    }
    next(erro);
  }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      throw new AppError('email e senha são obrigatórios', 400);
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ mensagem: 'Login realizado com sucesso', token });
  } catch (erro) {
    next(erro);
  }
}

module.exports = { cadastrar, login };