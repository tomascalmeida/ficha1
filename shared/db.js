const mongoose = require('mongoose');

const url = 'mongodb+srv://tomas:tomas@teste.8cyfxwq.mongodb.net/?appName=Teste';

async function connectDB() {
  try {
    await mongoose.connect(url);
    console.log('Conectado a MongoDB com Mongoose');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
  }
}

function getDB() {
  return mongoose.connection;
}

module.exports = { connectDB, getDB };