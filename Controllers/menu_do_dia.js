const express = require('express');
const Prato = require('../Models/pratos');


const router = express.Router();

// GET todos
router.get('/', async (req, res) => {
  try {
    const pratos = await Prato.find({}).sort({ codigo: 1 });
    res.status(200).json(pratos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// GET por código
router.get('/:codigo', async (req, res) => {
  try {
    const codigo = Number(req.params.codigo);
    if (isNaN(codigo)) {
      return res.status(400).json({ erro: "Código inválido" });
    }
    const prato = await Prato.findOne({ codigo });
    if (!prato) {
      return res.status(404).json({ erro: "Prato não encontrado" });
    }
    res.status(200).json(prato);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// POST criar
router.post('/', async (req, res) => {
  try {
    const { nome, categoria, tipo } = req.body;
    if (!nome || !categoria || !tipo) {
      return res.status(400).json({ erro: "Nome, categoria e tipo são obrigatórios" });
    }
    if (tipo !== "vegetariano" && tipo !== "normal") {
      return res.status(400).json({ erro: "Tipo: 'vegetariano' ou 'normal'" });
    }
    const pratosExistentes = await Prato.find({}).sort({ codigo: 1 });
    let novoCodigo = 1;
    while (pratosExistentes.some(p => p.codigo === novoCodigo)) {
      novoCodigo++;
    }
    const novoPrato = new Prato({ codigo: novoCodigo, nome, categoria, tipo });
    await novoPrato.save();
    res.status(201).json(novoPrato);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ erro: mensagens });
    }
    if (error.code === 11000) {
      return res.status(400).json({ erro: "Código do prato já existe" });
    }
    res.status(500).json({ erro: error.message });
  }
});

// PATCH atualizar
router.patch('/:codigo', async (req, res) => {
  try {
    const codigo = Number(req.params.codigo);
    if (isNaN(codigo)) {
      return res.status(400).json({ erro: "Código inválido" });
    }
    const updates = req.body;
    const prato = await Prato.findOneAndUpdate({ codigo }, updates, { new: true, runValidators: true });
    if (!prato) {
      return res.status(404).json({ erro: "Prato não encontrado" });
    }
    res.status(200).json(prato);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ erro: mensagens });
    }
    res.status(500).json({ erro: error.message });
  }
});

// DELETE por código
router.delete('/:codigo', async (req, res) => {
  try {
    const codigo = Number(req.params.codigo);
    if (isNaN(codigo)) {
      return res.status(400).json({ erro: "Código inválido" });
    }
    const prato = await Prato.findOneAndDelete({ codigo });
    if (!prato) {
      return res.status(404).json({ erro: "Prato não encontrado" });
    }
    res.status(200).json({ mensagem: "Prato removido com sucesso", prato });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// DELETE todos
router.delete('/', async (req, res) => {
  try {
    await Prato.deleteMany({});
    res.status(200).json({ mensagem: "Todos os pratos removidos" });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
