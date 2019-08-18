const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;

  connectedUsers[user] = socket.id;
});

// mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-yohvt.mongodb.net/omnistack?retryWrites=true&w=majority', {
//   useNewUrlParser: true
// });

mongoose.connect('mongodb://localhost:27017/omnistack', {
  useNewUrlParser: true
});

mongoose.connection.on('error', function (error) {
  console.error('Database connection error:', error);
});

mongoose.connection.once('open', function () {
  console.log('Database connected');
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
})

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);