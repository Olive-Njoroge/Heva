const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World - Basic server working!');
});

app.listen(3001, () => {
  console.log('🚀 Basic test server running on port 3001');
});