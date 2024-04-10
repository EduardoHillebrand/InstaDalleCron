const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');
const chatGptController = require('../controllers/chatGptController');


// Rota existente para recuperar ultima postagem
router.get('/message', messageController.messageFunction);
// Rota existente para criar postagem
router.post('/message', messageController.setMessageFunction);


// Rota existente para Gerar prompt principal
router.get('/generatePrompt', chatGptController.createPromptFunction);


// Adicionando uma rota para a URL raiz
router.get('/', (req, res) => {
  res.json({ 
    message: "Bem-vindo à aplicação.",
    paths: ["message", "generatePrompt"]
  });
});

module.exports = router;
