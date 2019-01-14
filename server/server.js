/*
* Copyright 2019 Elias Sandner, Fabian Haas
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

//for generating id
const qrcode = require("qrcode");
const crypto = require("crypto");

//simple server to access index.html
const express = require("express");
const app = express();
app.use(express.static("../client"));
app.listen(3000, () => {
  console.log("listening on port 3000");
});


//import module
const WebSocket = require("ws");

//create server on port 8080
const wss = new WebSocket.Server({
  clientTracking: true, //enables wss.clients
  port: 8080
});

function errHandler(err) {
  if (err)
    console.error(err);
}

wss.on("error", err => {
  if (err)
    console.error(err);
});

//event handling
wss.on("connection", ws => {
  //generate id
  const id = crypto.randomBytes(8).toString("hex");

  console.log(`The user ${id} connected.`);
  ws.on("error", err => errHandler(err));
  ws.on("close", (code, reason) => console.log(`Closed connection to ${id} with code ${code} because of ${reason}.`));

  qrcode.toDataURL(id, function (err, url) {
    if (err) {
      console.error(err);
      return;
    }

    ws.send(Buffer.from(url), err => errHandler(err));
  });

  //send message when connection is established
  ws.send(JSON.stringify({ "type": "sendID", "data": id }), err => errHandler(err));

  //listen for messages
  ws.on("message", function incoming(data) {
    const msg = JSON.parse(data);

    switch (msg.type) {
      case "msg":
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN)
            client.send(JSON.stringify({ "type": "msg", "sender": id, "data": msg.data }), err => errHandler(err));
        });
        console.log("received: %s from %s", msg.data, id);
        break;
      default:
        console.error("Unknown type");
        break;
    }
  });
});