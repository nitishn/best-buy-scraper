"use strict;"

var socket = io();
socket.on('card-scraped', (msg) => {
  console.log(msg);
});
socket.on('checking-card', (msg) => {
  console.log(msg);
});

console.log(socket);
