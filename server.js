const net = require('net');
const port = 8124;
let seed = 0;

const server = net.createServer((client) => {
    const fs = require('fs');
    client.id = Date.now() + seed++;
    fs.writeFile(client.id + ".txt", client.id + " connected.\r\n", (err)=>{});
    console.log('Client connected, ' + client.id);
    client.write('\r\nHello!\r\nRegards,\r\nServer\r\n');
    client.setEncoding('utf8');
    var userAuthorized = false;
    var answersArray = [];

    client.on('data', (data) => {
        if (userAuthorized) {
            console.log("User " + client.id + " asked: " + data);
            var answer = Math.round(Math.random() * 2);
            client.write(answersArray[answer]);
            fs.appendFile(client.id + ".txt", "User asked: " + data + "\r\n", (err) => {});
            console.log("Answer to user " + client.id + ": " + answersArray[answer]);
            fs.appendFile(client.id + ".txt", "Answer: " + answersArray[answer] + "\r\n", (err) => {});
        }
        else if (data === "QA") {
            userAuthorized = true;
            var qa = require('./qa.json');
            answersArray = [qa.Q1, qa.Q2, qa.Q3];
            client.write("ACK");
            console.log("User " + client.id + " sent: " + data);
            fs.appendFile(client.id + ".txt", "User sent: " + data + "\r\n", (err) => {});
            console.log("To user " + client.id + ":ACK");
            fs.appendFile(client.id + ".txt", "Answer: ACK" + "\r\n", (err) => {});
        }
        else {
            console.log("User " + client.id + " sent: " + data);
            fs.appendFile(client.id + ".txt", "User sent: " + data +"\r\n", (err) => {});
            console.log("To user " + client.id + ":DEC");
            fs.appendFile(client.id + ".txt", "Answer: DEC" + "\r\n", (err) => {});
            client.write("DEC");
            client.destroy();
            fs.appendFile(client.id + ".txt", "Client disconnected!" + "\r\n", (err) => {});
        }
      });

  client.on('end', () => {
      console.log('Client disconnected, ' + client.id); 
      fs.appendFile(client.id + ".txt", "Client disconnected!" + "\r\n", (err) => {});
    });
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});