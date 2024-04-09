require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const DALLE_API_KEY = process.env.DALLE_API_KEY;
const MongooseKey = process.env.mongodb_str.replace("<password>", process.env.mongodb_pass);

mongoose.connect(MongooseKey, { useNewUrlParser: true, useUnifiedTopology: true });

// Import routes
const indexRouter = require('./routes/index');

// Middleware
app.use(express.json());

// Use routes
app.use('/', indexRouter);

// Start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});