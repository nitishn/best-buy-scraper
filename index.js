// Web scraper using Puppeteer
// Process each product with a source that can be different logic per product
const puppeteer = require('puppeteer');
let productsConfig = [
    {
      'product'   : 'rtx 3070',
      'url'       : 'https://www.bestbuy.com/site/nvidia-geforce-rtx-3070-8gb-gddr6-pci-express-4-0-graphics-card-dark-platinum-and-black/6429442.p?skuId=6429442',
    },
    {
      'product' : 'rtx 3080',
      'url'     : 'https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429440.p?skuId=6429440'
    }
];

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

  productsConfig.foreach((product) => {
    console.log(product);
  });

  // Do the actual page vist
  await page.goto('https://www.bestbuy.com/site/nvidia-geforce-rtx-3070-8gb-gddr6-pci-express-4-0-graphics-card-dark-platinum-and-black/6429442.p?skuId=6429442');

  // Grab the add to cart button and check it's text
  let buttons = await page.$$(addToCartSelctor);
  if(buttons.length) {
    // Only grab one button in case more than one match
    buttons = buttons.shift();
    let inStockText = await buttons.evaluate(el => el.textContent )
    console.log(inStockText);
  }
  await browser.close();
})();
