// Web scraper using Puppeteer
// Process each product with a source that can be different logic per product

// Dependencies
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Express setup
http.listen(3000, () => {
  console.log('listening on *:3000');
});

// Scraper setup
require('./scraper')(io);
