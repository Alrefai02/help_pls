// Dependencies
const webSocketPort = 8000;
const webServer = require('websocket').server;
const http = require('http');
const clients = {};
const { v4: uuidv4 } = require('uuid');

// Create a web server listening on port 8000
const server = http.createServer();
server.listen(webSocketPort);
console.log('Websocket server listening on port ' + webSocketPort);

// spawn a websocket server using the web (http) server
const wsServer = new webServer({
    httpServer: server
});

// create a random unique ID for each client
function getUniqueID() {
    uuidv4(); 
}

wsServer.on('request', function(request) {
    var userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');

    const connection = request.accept(null, request.origin); // create connection for the user
    clients[userID] = connection; // store the connection method
    console.log('connected: ' + userID);

    // when a user sends a message
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only text (unicode)
            console.log('Received Message: ' + message.utf8Data);
            // broadcast message to all connected clients
            for (key in clients) {
                clients[key].sendUTF(message.utf8Data);
                console.log('sent Message to: ' + key);
            }
        }
    });
});

