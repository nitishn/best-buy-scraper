const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {

    processProduct( product ) {
        // Grab the domain of product URL 
        const regex = /https?:\/\/(www\.)?(\w+)\..*/g;        
        let source = regex.exec(product.url);
        let updatedProduct = product;         
        // Domain will be the second capture group 
        if (source) {
            source = source[2];
            updatedProduct.source = source.toUpperCase();
            switch (source) {
                case 'bestbuy': 
                    updatedProduct = this.processBestBuy(product);
                break;
                case 'amd': 
                    updatedProduct = this.processAMD(product);
                break; 
            }
        }
        return updatedProduct;
    },

    // Processing best buy requires us to check the existance of a cart button 
    async processBestBuy(product) {
        let response = await axios(product.url); 
        if (response) {
          const html = response.data;  
          const $ = cheerio.load(html);    
          // Grab the add to cart button and check it's text
          let buttons = $('.btn-lg.add-to-cart-button');
          if(buttons.length) {
            // Only grab one button in case more than one match
            buttons = buttons.eq(0);
            let inStockText = $(buttons).text().trim();
            product.status = inStockText.toLowerCase();            
            product.timeChecked = new Date().toLocaleTimeString();            
          } else {
            product.status = "unknown";
          }
        }
        return product;
    },

    // Processing AMD is almost the same as bestbuy, just need to check for a button 
    async processAMD(product) {

        let response = await axios(product.url);
        if (response) {
            const html = response.data;  
            const $ = cheerio.load(html); 
            let buttons = $('.btn-shopping-cart.btn-shopping-neutral');  
            if(buttons.length) {
                // Only grab one button in case more than one match
                buttons = buttons.eq(0);                
                let inStockText = $(buttons).text().trim();                
                product.status = inStockText.toLowerCase();                            
              } else {
                // Add to cart doesn't exist on AMD if the product is out of stock
                product.status = "sold out";
              }
        }

        product.timeChecked = new Date().toLocaleTimeString();            
        return product;
    }
}


