//for generating id
const crypto = require("crypto");

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
  //generate id
  let id = crypto.randomBytes(8).toString("hex");

  //send message when connection is established
  ws.send(JSON.stringify({ "type": "sendID", "data": id }));

  //listen for messages
  ws.on("message", function incoming(data) {
    const msg = JSON.parse(data);

    switch (msg.type) {
      case "msg":
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN)
            client.send(JSON.stringify({ "type": "msg", "sender": id, "data": msg.data }));
        });
        console.log("received: %s from %s", msg.data, id);
        break;

      default:
        console.error("Unknown type");
        break;
    }
  });
});