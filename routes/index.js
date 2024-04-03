// Arquivo: routes/index.js

const express = require('express');
const router = express.Router();

const sampleController = require('../controllers/sampleController');

// Rota existente para /sample
router.get('/sample', sampleController.sampleFunction);

// Adicionando uma nova rota para a URL raiz
router.get('/', (req, res) => {
  res.json({ message: "Bem-vindo à aplicação MVC!" });
});

module.exports = router;
