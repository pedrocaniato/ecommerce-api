const jwt = require('jsonwebtoken')

function autenticar(req, res, next) {
    console.log('Headers recebidos:', req.headers.authorization);
    const authHead = req.headers.authorization;

    if(!authHead) {
        return res.status(401).json({ erro: 'Token não fornecido '});
    }

    const [tipo, token] = authHead.split(' ')

    if(tipo !== 'Bearer' || !token ) {
        return res.status(401).json({ erro: 'Formato de token inválido' });
    }

    try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }

}

module.exports = autenticar;