const request = require('supertest');
const app = require('../app')

describe('API de produtos', () => {
    it('GET /produtos deve retornar uma lista com status 200', async () => {
      const resposta = await request(app).get('/produtos');

      expect(resposta.status).toBe(200);
      expect(Array.isArray(resposta.body.dados)).toBe(true); // mudou de resposta.body pra resposta.body.dados
    });

    it('POST /produtos deve criar um produto e retornar 201', async () => {
    const novoProduto = { nome: 'Produto de teste', preco: 50, estoque: 10 };

    const resposta = await request(app).post('/produtos').send(novoProduto);

    expect(resposta.status).toBe(201);
    expect(resposta.body.nome).toBe('Produto de teste');
  });

  it('POST /produtos sem "preco" deve retornar 400', async () => {
    const resposta = await request(app).post('/produtos').send({ nome: 'Sem preço' });

    expect(resposta.status).toBe(400);
  });
});
