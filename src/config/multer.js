const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const nomeUnico = `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, nomeUnico);
  },
});

const tiposPermitidos = ['image/jpg', 'image/png', 'image/webp'];

function fileFilter(req, file, cb) {
  if (!tiposPermitidos.includes(file.mimetype)) {
    return cb(new Error('Tipo de Arquivo não Permitido. Envie apenas JPEG, PNG ou WEBP.'))
  }
  cb(null, true)
}

const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 5 * 1024 * 1024},
});

module.exports = upload