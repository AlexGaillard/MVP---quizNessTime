const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/quizness', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connection successful')
});

const playerSchema = new mongoose.Schema({
  name: String,
  wins: Number
})

const Player = mongoose.model('Player', playerSchema);

const getScores = async () => {
  let res = await Player.find({}).limit(5);
  return res;
}

const saveScore = async (name) => {

  const player = await Player.findOne({'name': name});

  if (!player) {
    const newPlayer = new Player({'name': name, wins: 1});
    await newPlayer.save();
    return 'Player added to database'
  } else {
    let winCount = player.wins + 1;
    let filter = player.id;
    await Player.findByIdAndUpdate(filter, {wins: winCount})
    return 'Player score updated'
  }

}

module.exports = {
  db,
  getScores,
  saveScore
};