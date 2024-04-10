const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const messageController = require('../controllers/messageController');
const chatGptController = require('../controllers/chatGptController');


// Rota existente para recuperar ultima postagem
router.get('/message', messageController.messageFunction);
// Rota existente para criar postagem
router.post('/message', messageController.setMessageFunction);


// Rota existente para Gerar prompt principal
router.get('/generatePrompt', chatGptController.createPromptFunction);

// Rota existente para Gerar titulo e hashtags
router.get('/generateTitle', chatGptController.createNameAndHashtagsFunction);

// Rota existente para Gerar musicas
router.get('/generateMusics', chatGptController.createMusicListFunction);

// Rota existente para Gerar imagem
router.get('/generateImage', chatGptController.createImageFunction);

router.get('/fotos/:pasta/:imagem', (req, res) => {
    const { pasta, imagem } = req.params;
    const caminhoDoArquivo = path.join(__dirname, '../fotos', pasta, imagem);
    //console.log(caminhoDoArquivo);
    // Checa se o arquivo existe
    fs.access(caminhoDoArquivo, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('Arquivo não encontrado:', caminhoDoArquivo);
            return res.sendStatus(404);
        }

        // Retorna o arquivo de imagem
        res.sendFile(caminhoDoArquivo);
    });
});

// Adicionando uma rota para a URL raiz
router.get('/', (req, res) => {
  res.json({ 
    message: "Bem-vindo à aplicação.",
    paths: ["message", "generatePrompt"]
  });
});

module.exports = router;
