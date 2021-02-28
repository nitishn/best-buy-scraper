(($) => {
  'use strict;'

  // Setup socket
  var socket = io();

  // Get data from server from cards being scraped
  socket.on('card-scraped', (card) => {

    // Update the dom with scraped card
    if (card) {
      console.log(card);
      // Find card row by product name
      let row = $("tr[data-row='" + card.product + "']");
      // Update status
      let status = $(row).find('td[data-column="status"]');
      switch (card.status) {
        case 'Sold Out':
          $(status).find('a').addClass('sold-out');
          $(status).find('a').removeClass('in-stock');
        break;
        case 'Add to Cart':
          $(status).find('a').removeClass('sold-out');
          $(status).find('a').addClass('in-stock');
        break;
      }
      // Update time checked
      let timeChecked = $(row).find('td[data-column="time-checked"]');
      $(timeChecked).html(card.timeChecked);
    }
  });

  // Basic server status for alerts/etc
  socket.on('checking-card', (msg) => {
    $('.js-server-message').html(msg);
  });

  // Serve error handling
  socket.on('scrape-error', (msg) => {
    $('.js-serer-error').html(msg);
  });
})(jQuery);
