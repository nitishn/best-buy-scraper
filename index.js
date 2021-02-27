// Web scraper using Puppeteer
// Process each product with a source that can be different logic per product
const puppeteer = require('puppeteer');
const productsConfig = require('./productsConfig');

const addToCartSelctor = '.btn-lg.add-to-cart-button';

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

  let counter = 0;

  while (true) {

    if (counter == productsConfig.length) {
      counter = 0;
    }

    console.log('Checking product: ' + productsConfig[counter % productsConfig.length].product);

    // Do the actual page vist
    await page.goto(productsConfig[counter % productsConfig.length].url);

    // Grab the add to cart button and check it's text
    let buttons = await page.$$(addToCartSelctor);
    if(buttons.length) {
      // Only grab one button in case more than one match
      buttons = buttons.shift();
      let inStockText = await buttons.evaluate(el => el.textContent )
      console.log(inStockText);
    } else {
      console.log('Could not find cart button');
    }
    counter++;
  }

})();
