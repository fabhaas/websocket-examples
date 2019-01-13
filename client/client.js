// create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080", "chat");

function appendMsg(msg, user) {
    document.getElementById("lbMsg").innerHTML += `<li>${user}: ${msg}</li>`;
}

function sendMsg(msg) {
    socket.send(JSON.stringify({ "type": "msg", "data": msg}));
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