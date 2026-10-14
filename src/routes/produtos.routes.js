const express = require('express')
const router = express.Router();
const upload = require('../config/multer')
const controller = require('../controllers/produtos.controller')
const autenticar = require('../middleware/auth.middleware')
const validar = require('../middleware/validation.middleware');
const { produtoSchema } = require('../schemas/produto.schema');

router.post(
  '/',
  autenticar,
  upload.single('foto'),
  validar(produtoSchema),
  controller.criar
);

router.put(
  '/:id',
  autenticar,
  upload.single('foto'),
  validar(produtoSchema.partial()),
  controller.atualizar
);

router.get('/', controller.listar)
router.get('/:id', controller.buscarPorId)
router.post('/', autenticar,  upload.single('foto'), controller.criar)
router.put('/:id', autenticar, upload.single('foto'), controller.atualizar )
router.delete('/:id', autenticar, controller.remover)

module.exports = router;