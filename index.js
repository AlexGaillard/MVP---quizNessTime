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

io.on('connection', (socket) => {
  players++;
  console.log(`Player ${players} connected`);
  socket.broadcast.emit('newPlayer');

  socket.on('disconnect', () => {
    console.log(`Player ${players} disconnected`);
  });

});


