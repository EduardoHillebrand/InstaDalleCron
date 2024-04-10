require('dotenv').config();
const axios = require('axios');

const DALLE_API_KEY = process.env.DALLE_API_KEY;
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
      "max_tokens": 350
    }, {
      headers: {
        'Authorization': `Bearer ${DALLE_API_KEY}`, // Substitua `seu_token_de_acesso` pelo seu token da API da OpenAI.
        'Content-Type': 'application/json'
      }
    });

    // Exibe a resposta do ChatGPT
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




