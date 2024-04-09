const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');


// Rota existente para recuperar ultima postagem
router.get('/message', messageController.messageFunction);

// Rota existente para criar postagem
router.post('/message', messageController.setMessageFunction);

// Adicionando uma nova rota para a URL raiz
router.get('/', (req, res) => {
  res.json({ 
    message: "Bem-vindo à aplicação.",
    paths: "message" 
  });
});

module.exports = router;
