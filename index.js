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
http.listen(process.env.PORT || 80, () => {
  console.log('listening on *:80');
});

// Routes setup
// Use initial product config as the template for initial UI
const productsConfig = require('./models/productsConfig');
app.get('/', (req, res) => {
  const data = {
    products: productsConfig
  }
  res.render('dashboard', data);
});

app.use('/products', require('./routes/productRoutes'));

// Scraper setup
require('./scraper')(io);
