const messageModel = require('../models/messageModel');

exports.messageFunction = async(req, res) => {
  const data = await messageModel.getData();
  res.json(data);
};

exports.setMessageFunction = async(req, res) => {
  await messageModel.setData(req.body.message);
  const data = await messageModel.getData();
  res.json(data);
};
