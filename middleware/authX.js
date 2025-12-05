const User = require('../Models/user.js');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic');
    return res.status(401).send('Cabeçalho de autorização ausente');
  }

  try {
    const base64Credentials = authHeader.split(' ')[1];
    const decoded = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const [username, password] = decoded.split(':');

    if (!username || !password) {
      res.set('WWW-Authenticate', 'Basic');
      return res.status(401).send('Formato de autorização inválido');
    }

    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      res.set('WWW-Authenticate', 'Basic');
      return res.status(401).send('Nome de utilizador ou palavra-passe inválidos');
    }

    req.user = user;
    next();
  } catch (error) {
    res.set('WWW-Authenticate', 'Basic');
    return res.status(401).send('Erro de autenticação');
  }
}

module.exports = authMiddleware;
