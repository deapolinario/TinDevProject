const express = require('express');
const mongoose = require ('mongoose');
const cors = require ('cors');


const routes = require('./routes');

const app = express();
const server = require("http").Server(app);
const io = require('socket.io')(server);

// aramazenamento dos dados para envio dos dois dev (user and devId) - não é a melhor forma de fazer o correto
// seria utilizar base de dados com chave e valor para essa ação de relacionar id de dev com id de socket
// essa solução não é stateless
const connectedUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query;

    console.log(user, socket.id);

    connectedUsers[user] = socket.id;

    
    //Realização de testes com o WebSocket
    //
    // console.log('Nova conexão', socket.id);
    // socket.on('Hello', message => {
    //     console.log(message)
    // })

    // setTimeout(() => {
    //     socket.emit('word', {
    //         message: 'CURINTIA'
    //     });
    // }, 5000)
});

mongoose.connect('mongodb+srv://engenharia:engenharia@cluster0-ctzhq.mongodb.net/tindev?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);


server.listen(3333);

