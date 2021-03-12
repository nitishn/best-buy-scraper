// Best buy web scraper using axios and cheerio
// Process each product with a source that can be different logic per product
const axios = require('axios');
const cheerio = require('cheerio');

// Configs
const productsConfig = require('./productsConfig');
const addToCartSelctor = '.btn-lg.add-to-cart-button';

module.exports = async(io) => {


  // This loops forever checking products!
  let counter = 0;
  while (true) {
    if (counter == productsConfig.length) {
      counter = 0;
    }
    let index = counter % productsConfig.length;
    io.emit('checking-card', 'Scraping: ' + productsConfig[index].product);
    
    // Do the actual page vist
    try {
      let response = await axios(productsConfig[index].url); 

      if (response) {
        const html = response.data;  
        const $ = cheerio.load(html);    
    
        // Grab the add to cart button and check it's text
        let buttons = $('.btn-lg.add-to-cart-button');
    
        if(buttons.length) {
          // Only grab one button in case more than one match
          buttons = buttons.eq(0);
          let inStockText = $(buttons).text();
          productsConfig[index].status = inStockText;
          productsConfig[index].timeChecked = new Date().toLocaleTimeString();
          io.emit('card-scraped', productsConfig[index]); // This will emit the event to all connected sockets
        } else {
          io.emit('scrape-error', 'Error: Could not find cart button');
        }
      }
      counter++;
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch(e) {
      console.log(e);
      counter++;
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

  }
}
