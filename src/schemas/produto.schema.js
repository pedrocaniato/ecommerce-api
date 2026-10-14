const { z } = require('zod');

const produtoSchema = z.object({
  nome: z.string().min(2, 'nome deve ter pelo menos 2 caracteres'),
  preco: z.coerce.number().positive('preco deve ser maior que zero'),
  estoque: z.coerce.number().int().nonnegative('estoque não pode ser negativo').optional(),
});

module.exports = { produtoSchema };
