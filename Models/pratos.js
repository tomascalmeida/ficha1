const mongoose = require('mongoose');

const pratoSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    required: [true, 'Código do prato é obrigatório'],
    unique: [true, 'Código do prato deve ser único'],
  },
  nome: {
    type: String,
    required: [true, 'Nome do prato é obrigatório'],
    minlength: [3, 'Nome deve ter no mínimo 3 caracteres'],
    maxlength: [100, 'Nome não pode exceder 100 caracteres'],
  },
  categoria: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    minlength: [3, 'Categoria deve ter no mínimo 3 caracteres'],
    maxlength: [50, 'Categoria não pode exceder 50 caracteres'],
  },
  tipo: {
    type: String,
    required: [true, 'Tipo é obrigatório'],
    enum: {
      values: ['vegetariano', 'normal'],
      message: 'Tipo deve ser "vegetariano" ou "normal"',
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Prato', pratoSchema);
