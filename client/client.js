// create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080", "chat");

// connection opened
socket.addEventListener("open", function (event) {
    socket.send("Hello Server!");
});

// listen for messages
socket.addEventListener("message", function (event) {
    console.log("Message from server: %s", event.data);
});