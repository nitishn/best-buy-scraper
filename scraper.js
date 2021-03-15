// Best buy web scraper using axios and cheerio
// Process each product with a source that can be different logic per product
const utilities = require('./inc/utilities');

// Configs
const productsConfig = require('./productsConfig');

module.exports = async(io) => {

  // This loops forever checking products!
  let counter = 0;
  while (true) {
    if (counter == productsConfig.length) {
      counter = 0;
    }
    let index = counter % productsConfig.length;
    io.emit('checking-card', 'Scraping: ' + productsConfig[index].product);
    
    try {
      // Process product and return with scape data  
      const product = await utilities.processProduct(productsConfig[index]);
      io.emit('card-scraped', product); // This will emit the event to all connected sockets
      counter++;
      // Artificially delay scrapes by 3s 
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch(e) {
      // Update counter even if we catch an error 
      console.log(e);
      counter++;
      // Artificially delay scrapes by 3s 
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

  }
}
