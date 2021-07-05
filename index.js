const express = require('express');
const app = express();
const axios = require('axios');
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

app.listen(port, () => {
  console.log(`QuizNessTime is now listening on http://localhost:${port}`);
})