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

// create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080", "chat");

function appendMsg(msg, user) {
    document.getElementById("lbMsg").innerHTML += `<li>${user}: ${msg}</li>`;
}

function sendMsg(msg) {
    socket.send(JSON.stringify({ "type": "msg", "data": msg }));
}

function sendMsgEvent(e) {
    const txtMsg = document.getElementById("txtMsg");
    const msg = txtMsg.value;

    appendMsg(msg, "You");
    txtMsg.value = "";
    sendMsg(msg);
}

// connection opened
socket.addEventListener("open", e => {
    console.log("connection opened");
});

//event is called if error occurs
socket.addEventListener("error", err => {
    //log error
    console.error(err);
});

// listen for messages
socket.addEventListener("message", e => {
    if (e.data instanceof Blob) {
        const reader = new FileReader();

        reader.addEventListener('loadend', e => {
            document.getElementById("qrcode").src = e.target.result;
        });

        reader.readAsText(e.data);
        return;
    }

    const msg = JSON.parse(e.data);
    switch (msg.type) {
        case "msg":
            appendMsg(msg.data, msg.sender);
            break;
        case "sendID":
            document.getElementById("lUser").innerHTML = "User: " + msg.data;
            break;
        default:
            console.error("Unknown type");
            break;
    }
});

document.getElementById("btnSend").addEventListener("click", e => sendMsgEvent(e));
document.getElementById("txtMsg").addEventListener("keyup", e => {
    if (e.keyCode === 13)
        sendMsgEvent(e);
});