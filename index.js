require('dotenv').config();
const axios = require('axios');
const cron = require('node-cron');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const https = require('https');
const readline = require('readline');
const { format } = require('date-fns');

// Utiliza a chave de API do DALL-E do arquivo .env
const DALLE_API_KEY = process.env.DALLE_API_KEY;
var totalGenerated = 1;

// Caminho para o arquivo de prompt e para a pasta de fotos
const promptFilePath = path.join(__dirname, 'prompt.txt');
const photosFolderPath = path.join(__dirname, 'fotos');
const currentDateTime = format(new Date(), 'yyyy-MM-dd');//-HH-mm-ss
const currentSessionFolderPath = path.join(photosFolderPath, currentDateTime);
const entriesFolderPath = path.join(__dirname, 'entradas');

async function readRandomTxtFile() {
  try {
    const files = await fsp.readdir(entriesFolderPath);
    const txtFiles = files.filter(file => path.extname(file) === '.txt');

    if (txtFiles.length === 0) {
      console.log('Nenhum arquivo .txt encontrado.');
      return null;
    }

    const selectedFile = txtFiles[Math.floor(Math.random() * txtFiles.length)];
    const filePath = path.join(entriesFolderPath, selectedFile);
    const content = await fsp.readFile(filePath, 'utf8');

    return {
      nome: selectedFile,
      conteudo: content
    };
  } catch (err) {
    console.error('Erro:', err);
    return null;
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, ans => {
    resolve(ans);
    rl.close();
  }));
}

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(resolve(true));
      });
    }).on('error', function(err) { // Handle errors
      fs.unlink(filepath); // Delete the file async. (But we don't check the result)
      reject(err);
    });
  });
}

async function generateAndSaveImage() {
  // busca um dos prompts
  let chosenPrompt = await readRandomTxtFile();

  console.log("Prompt selecionado: "+chosenPrompt.nome);

  const prompt = chosenPrompt.conteudo.trim();//fs.readFileSync(promptFilePath, 'utf8').trim();

  try {
    const response = await axios.post('https://api.openai.com/v1/images/generations', {
      prompt: prompt,
      n: 1, // Número de imagens a serem geradas
    }, {
      headers: {
        'Authorization': `Bearer ${DALLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Verifica se a pasta 'fotos' existe, se não, cria
    if (!fs.existsSync(photosFolderPath)) {
      fs.mkdirSync(photosFolderPath);
    }
    if (!fs.existsSync(currentSessionFolderPath)) {
      fs.mkdirSync(currentSessionFolderPath);
    }

    const imageUrl = response.data.data[0].url;
    const filename = `image-${Date.now()}.png`;
    const filepath = path.join(currentSessionFolderPath, filename);

    await downloadImage(imageUrl, filepath);
    console.log(`Imagem salva como ${filename}`);
  } catch (error) {
    console.error('Erro ao gerar ou salvar a imagem:', error);
  }
}

async function start() {
  // Verifica se e um número válido, caso contrário, assume o valor 1
  const n = await askQuestion("Quantas imagens você gostaria de gerar? ");
  const nrToGenerate = parseInt(n, 10); // Converte a resposta para um inteiro
  if (!isNaN(nrToGenerate) && nrToGenerate >= 1) {
    totalGenerated = nrToGenerate;
  } else console.log("Entrada inválida. Gerando 1 imagem...");

  for (var i = 1; i <= totalGenerated; i++) {
    console.log('Gerando imagem ('+(i)+'/'+totalGenerated+')...'); 
    await generateAndSaveImage();
  }
}


start();
