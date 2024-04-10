const messageModel = require('../models/messageModel');
const messageSchema = require('../schemas/Message');
const chatGptModel = require('../models/chatGptModel');
const fsp = require('fs').promises;
const path = require('path');
const photosFolderPath = path.join(__dirname, '../fotos');

exports.createPromptFunction = async(req, res) => {
  try {

    const promptFilePath = path.join(__dirname, '../prompts/promptInicial.txt');
    const messages = await messageModel.findMessagesWithStatus("message");
    const content = await fsp.readFile(promptFilePath, 'utf8');

    for (const message of messages) {
      var question = content.replace("<replace>", message.message);
      var prompt = await chatGptModel.createPromptsFunction(question);
      if(prompt != null){
        await messageSchema.findByIdAndUpdate(message._id, { 
          imagePrompt: prompt,
          status: "prompt"
        });
      }
    }
    res.json({ success: true, message: "Prompts updated successfully." });
  } catch (error) {
    console.error('Error updating imagePrompts:', error);
    res.status(500).json({ error: "Error processing your request." });
  }
};

exports.createNameAndHashtagsFunction = async(req, res) => {
  try {
    
    const promptFilePath = path.join(__dirname, '../prompts/nameAndHashtags.txt');
    const messages = await messageModel.findMessagesWithStatus("prompt");
    const content = await fsp.readFile(promptFilePath, 'utf8');

    for (const message of messages) {
      var question = content.replace("<replace>", message.imagePrompt);
      var prompt = await chatGptModel.createPromptsFunction(question);
      prompt = checkForBreaklines(prompt);
      if(prompt != null){
        await messageSchema.findByIdAndUpdate(message._id, { 
          hashtags: prompt,
          status: "NameHash"
        });
      }
    }
    res.json({ success: true, message: "Name & Hashtags updated successfully." });
  } catch (error) {
    console.error('Error updating name and hashtags:', error);
    res.status(500).json({ error: "Error processing your request." });
  }
};

exports.createMusicListFunction = async(req, res) => {
  try {
    
    const promptFilePath = path.join(__dirname, '../prompts/musicListPrompt.txt');
    const messages = await messageModel.findMessagesWithStatus("NameHash");
    const content = await fsp.readFile(promptFilePath, 'utf8');

    for (const message of messages) {
      var question = content.replace("<replace>", message.imagePrompt);
      var prompt = await chatGptModel.createMusicListFunction(question);
      //console.log(prompt);
      if(prompt != null){
        await messageSchema.findByIdAndUpdate(message._id, { 
          songs: JSON.parse(prompt),
          musicPrompt: question,
          status: "Music"
        });
      }
    }
    res.json({ success: true, message: "Musics updated successfully." });
  } catch (error) {
    console.error('Error updating music:', error);
    res.status(500).json({ error: "Error processing your request." });
  }
};

exports.createImageFunction = async(req, res) => {
  try {
    
    const promptFilePath = path.join(__dirname, '../prompts/imagePrompt.txt');
    const messages = await messageModel.findMessagesWithStatus("Music");
    const content = await fsp.readFile(promptFilePath, 'utf8');

    for (const message of messages) {
      var question = content.replace("<replace>", message.imagePrompt);
      var prompt = await chatGptModel.createImageFunction(question);
      //console.log(prompt);
      if(prompt != null){
        await messageSchema.findByIdAndUpdate(message._id, { 
          imagePath: prompt.toString(),
          status: "Image"
        });
      }
    }
    res.json({ success: true, message: "image updated successfully." });
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ error: "Error processing your request." });
  }
};


function checkForBreaklines(noBreaklinesString){
  // Verifica se a string possui quebras de linha
  if (noBreaklinesString.includes('\n')) {
    // Divide a string em um array usando a quebra de linha como delimitador
    const lines = noBreaklinesString.split('\n');
    // Retorna a primeira porção da linha (antes da quebra de linha)
    return lines[0];
  } else {
    // Se não houver quebra de linha, retorna a própria string
    return noBreaklinesString;
  }
}
