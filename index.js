const express = require('express');
const { connectDB } = require('./shared/db');
const authMiddleware = require('./middleware/authX.js'); 
const User = require('./Models/user.js');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toLocaleString('pt-PT')}`);
  next();
});
app.get('/', (req, res) => {
  res.send('API do restaurante a correr');
});
// Rota protegida (teste da autenticação Basic)
app.get('/private', authMiddleware, (req, res) => {
  res.send('Acesso autorizado! Bem-vindo, ' + req.user.username);
});

// Rota de registo de utilizador (cria na coleção users)
app.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ erro: 'username e password são obrigatórios' });
    }

    const user = await User.create({ username, password });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

connectDB().then(() => {
  const pratosRouter = require('./Controllers/menu_do_dia');

  // Todas as rotas de /pratos protegidas por Basic Auth
  app.use('/pratos', authMiddleware, pratosRouter);

  app.use((err, req, res, next) => {
    console.error('Erro inesperado:', err.message);
    res.status(500).json({ erro: 'Erro inesperado: ' + err.message });
  });

  app.listen(PORT, () => {
    console.log('Restaurante de ~> Tomás <~ - Servidor funcional na porta', PORT);
  });
});
