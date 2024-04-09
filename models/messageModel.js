// Import the Message model that you defined
const Message = require('../schemas/Message');

// Rewrite the getData function to fetch from MongoDB
exports.getData = async () => {
  try {
    // Fetch the latest message in the collection
    const message = await Message.findOne().sort({ createdAt: -1 });
    return message;
  } catch (error) {
    console.error('Error fetching message:', error);
    return { message: "Error fetching data." };
  }
};

exports.setData = async (_message) => {
  //console.log("setData",_message);
  try {
      // Fetch the latest message in the collection
      const newMessage = new Message({
      message: _message,
      imagePath: null,
      imagePrompt: null,
      hashtags: null,
      musicPrompt: null,
      songs: []
    });

    // Salva o novo documento no MongoDB
    return await newMessage.save();

  } catch (error) {
    console.error('Error fetching message:', error);
    return { message: "Error saving data." };
  }
};





