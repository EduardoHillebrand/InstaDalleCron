const messageModel = require('../models/messageModel');
const messageSchema = require('../schemas/Message');
const chatGptModel = require('../models/chatGptModel');
const fsp = require('fs').promises;
const path = require('path');
const promptFilePath = path.join(__dirname, '../prompts/promptInicial.txt');
const photosFolderPath = path.join(__dirname, '../fotos');

exports.createPromptFunction = async(req, res) => {
  try {
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
