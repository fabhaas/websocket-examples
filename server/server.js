//simple server to access index.html
const express = require("express");
const app = express();
app.use(express.static("../client"));
app.listen(3000);


//import module
const WebSocket = require("ws");

//create server on port 8080
const wss = new WebSocket.Server({ 
  port: 8080
});

//event handling
wss.on("connection", function connection(ws) {
  //send message when connection is established
  ws.send("connection established");

  //listen for messages
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });
});