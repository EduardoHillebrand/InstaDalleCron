require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const https = require('https');
const { format } = require('date-fns');

const DALLE_API_KEY = process.env.DALLE_API_KEY;
const photosFolderPath = path.join(__dirname, '../fotos');

exports.createPromptsFunction = async(question) => {
  try {

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      "model": "gpt-4",
      "messages": [
        {
          "role": "system",
          "content": "You are a social media expert with extensive knowledge, especially on Instagram."
        },
        {
          "role": "user",
          "content": question
        }
      ],
      "max_tokens": 300
    }, {
      headers: {
        'Authorization': `Bearer ${DALLE_API_KEY}`, // Substitua `seu_token_de_acesso` pelo seu token da API da OpenAI.
        'Content-Type': 'application/json'
      }
    });

    // Exibe a resposta do ChatGPT
    //console.log("response.data.choices[0].message",response.data.choices[0].message);
    return response.data.choices[0].message.content;
  } catch (error) {
    if (error.response) {
        // A requisição foi feita e o servidor respondeu com um status code
        // que não está no intervalo de 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.log(error.request);
    } else {
        // Algo aconteceu na configuração da requisição que causou um erro
        console.log('Error', error.message);
    }    
    throw error;
  }
}

exports.createMusicListFunction = async(question) => {
  try {

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      "model": "gpt-4",
      "messages": [
        {
          "role": "system",
          "content": "You are a social media expert with extensive knowledge, especially on Instagram."
        },
        {
          "role": "user",
          "content": question
        }
      ],
      "max_tokens": 900
    }, {
      headers: {
        'Authorization': `Bearer ${DALLE_API_KEY}`, // Substitua `seu_token_de_acesso` pelo seu token da API da OpenAI.
        'Content-Type': 'application/json'
      }
    });

    // Exibe a resposta do ChatGPT
    //console.log("response.data.choices[0].message",response.data.choices[0].message);
    return response.data.choices[0].message.content;
  } catch (error) {
    if (error.response) {
        // A requisição foi feita e o servidor respondeu com um status code
        // que não está no intervalo de 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.log(error.request);
    } else {
        // Algo aconteceu na configuração da requisição que causou um erro
        console.log('Error', error.message);
    }    
    throw error;
  }
}

exports.createImageFunction = async(question) => {
  try {

    const currentDateTime = format(new Date(), 'yyyy-MM-dd');//-HH-mm-ss
    const currentSessionFolderPath = path.join(photosFolderPath, currentDateTime);
    const response = await axios.post('https://api.openai.com/v1/images/generations', {
      prompt: question,
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
    //console.log("await response.data.data[0].url",await response.data.data[0].url);
    const imageUrl = await response.data.data[0].url;
    const filename = `image-${Date.now()}.png`;
    const filepath = path.join(currentSessionFolderPath, filename);

    await downloadImage(imageUrl, filepath);
    console.log(`Imagem salva como ${filename}`);

    return "/fotos/"+currentDateTime+"/"+filename;
  } catch (error) {
    console.error('Erro ao gerar ou salvar a imagem:', error);
    throw error;
  }
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