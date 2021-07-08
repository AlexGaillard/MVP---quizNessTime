const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const axios = require('axios');
const STATIC_CHANNELS = ['global_notifications', 'global_chat'];
const port = 3000;

app.use(express.static('client/dist'));

app.get('/questions', async (req, res) => {

  const options = {
    method: 'get',
    url: 'https://opentdb.com/api.php?amount=10'
  }

  let questions = await axios(options);
  res.send(questions.data.results);
})

http.listen(port, () => {
  console.log(`QuizNessTime is now listening on http://localhost:${port}`);
})

let players = 0;
let playerOne;
let playerTwo;
let playerOneName;

io.on('connection', (socket) => {
  players++;
  console.log(`Player ${players} connected with id: ${socket.id}`);

  io.to(socket.id).emit('playerId', players, socket.id);

  if (players === 1) playerOne = socket.id;
  if (players === 2) playerTwo = socket.id;


  socket.on('setPlayerName', (arg) => {
    playerOneName = arg;
  })

  socket.on('readyToPlay', () => {
    io.to(playerTwo).emit('getPlayerName', playerOneName)
    socket.emit('startGame');
  })

  socket.on('currentState', (state) => {
    if (playerOne === socket.id) {
      io.to(playerTwo).emit('currentState', state)
    } else {
      io.to(playerOne).emit('currentState', state)
    }
  })

  socket.on('disconnect', () => {
    console.log(`Player ${players} disconnected`);
    players--
  });

});