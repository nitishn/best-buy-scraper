// Web scraper using Puppeteer
// Process each product with a source that can be different logic per product

// Dependencies
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const puppeteer = require('puppeteer');

// Configs
const productsConfig = require('./productsConfig');
const addToCartSelctor = '.btn-lg.add-to-cart-button';

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Express configs
http.listen(3000, () => {
  console.log('listening on *:3000');
});

// Scraper
(async () => {
  // Setup browser configs
  const browser = await puppeteer.launch({
    args: [
      '--no-asndbox',
      '--disable-setuid-sandbox',
      '--ignore-certificate-errors',
    ],
  });

  // Setup page configs
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');

  // This loops forever checking products!
  let counter = 0;
  while (true) {

    if (counter == productsConfig.length) {
      counter = 0;
    }

    let index = counter % productsConfig.length;

    console.log('Checking product: ' + productsConfig[index].product);
    io.emit('checking-card', 'Checking product: ' + productsConfig[index].product);
    // Do the actual page vist
    await page.goto(productsConfig[index].url);

    // Grab the add to cart button and check it's text
    let buttons = await page.$$(addToCartSelctor);
    if(buttons.length) {
      // Only grab one button in case more than one match
      buttons = buttons.shift();
      let inStockText = await buttons.evaluate(el => el.textContent )
      console.log(inStockText);
      productsConfig[index].status = inStockText;
      io.emit('card-scraped', productsConfig[index]); // This will emit the event to all connected sockets
    } else {
      console.log('Could not find cart button');
    }
    counter++;
  }

})();
