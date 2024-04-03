const sampleModel = require('../models/sampleModel');

exports.sampleFunction = (req, res) => {
  const data = sampleModel.getData();
  res.json(data);
};
