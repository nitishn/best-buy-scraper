// Best buy web scraper using Puppeteer
// Process each product with a source that can be different logic per product
const puppeteer = require('puppeteer');
// Configs
const productsConfig = require('./productsConfig');
const addToCartSelctor = '.btn-lg.add-to-cart-button';

module.exports = async(io) => {
  // Setup browser configs
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--ignore-certificate-errors',
    ],
  });

  // Setup page configs
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
  console.log(page);
  // This loops forever checking products!
  let counter = 0;
  while (true) {
    console.log('looping');
    if (counter == productsConfig.length) {
      counter = 0;
    }
    let index = counter % productsConfig.length;
    io.emit('checking-card', 'Scraping: ' + productsConfig[index].product);
    // Do the actual page vist
    await page.goto(productsConfig[index].url);

    // Grab the add to cart button and check it's text
    let buttons = await page.$$(addToCartSelctor);
    if(buttons.length) {
      // Only grab one button in case more than one match
      buttons = buttons.shift();
      let inStockText = await buttons.evaluate(el => el.textContent )
      productsConfig[index].status = inStockText;
      productsConfig[index].timeChecked = new Date().toLocaleTimeString();
      io.emit('card-scraped', productsConfig[index]); // This will emit the event to all connected sockets
    } else {
      io.emit('scrape-error', 'Error: Could not find cart button');
    }
    counter++;
  }
}
