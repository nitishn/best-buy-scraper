// Dependencies
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mustacheExpress = require('mustache-express');

// View engine setup
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.use(express.static('public'))

// Express setup
http.listen(3000, () => {
  console.log('listening on *:3000');
});

// Routes
app.get('/', (req, res) => {
  res.render('dashboard', );
});

// Scraper setup
// require('./scraper')(io);
