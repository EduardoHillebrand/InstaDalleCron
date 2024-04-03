const express = require('express');
const app = express();
const port = 3000;

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