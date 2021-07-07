import React from 'react';
import socketClient  from "socket.io-client";
const SERVER = "http://localhost:3000";
var socket = socketClient (SERVER);
import Question from './Question.jsx';
import Scoreboard from './Scoreboard.jsx';
import axios from 'axios';
// socket.on('newPlayer', (arg) => {
//   alert(arg)
// })

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newGame: false,
      alreadyRun: false,
      questions: [],
      currentRound: 0,
      currentQuestion: {},
      playerOneScore: 0,
      playerTwoScore: 0,
      statusMessage: '',
      correctAnswer: '',
      previousAnswer: '',
      playerOne: '',
      playerTwo: '',
      playerTurn: 1,
      playerOneGuess: '',
      playerTwoGuess: '',
      gameOver: false,
      winner: ''
    }
  }

  newGame() {

    axios.get('/questions')
    .then((res) => {
      this.setState({
        questions: res.data,
      });
      this.loadQuestion();
    });

  }

  componentDidMount() {
    let playerOne = prompt("Please enter your name Player 1");
    let playerTwo = prompt("Please enter your name Player 2");

    this.setState({
      playerOne: playerOne,
      playerTwo: playerTwo
    })
  }

  loadQuestion() {
    let round = this.state.currentRound + 1;
    this.setState({
      currentRound: round,
      currentQuestion: this.state.questions[round - 1],
      correctAnswer: this.state.questions[round - 1].correct_answer
    });

    socket.emit('currentState', this.state);
  }

  checkAnswer() {
    let correctAnswer = this.state.correctAnswer;
    if (this.state.playerOneGuess === correctAnswer && this.state.playerTwoGuess === correctAnswer) {
      this.setState({
        playerOneScore: this.state.playerOneScore + 1,
        playerTwoScore: this.state.playerTwoScore + 1,
        statusMessage: `Both players guessed correctly!`,
        correctAnswer: '',
        previousAnswer: correctAnswer,
        playerOneGuess: '',
        playerTwoGuess: '',
      })
    } else if (this.state.playerOneGuess === correctAnswer && this.state.playerTwoGuess !== correctAnswer) {
      this.setState({
        playerOneScore: this.state.playerOneScore + 1,
        statusMessage: `${this.state.playerOne} guessed correctly!`,
        correctAnswer: '',
        previousAnswer: correctAnswer,
        playerOneGuess: '',
        playerTwoGuess: '',
      })
    } else if (this.state.playerOneGuess !== correctAnswer && this.state.playerTwoGuess === correctAnswer) {
      this.setState({
        playerTwoScore: this.state.playerTwoScore + 1,
        statusMessage: `${this.state.playerTwo} guessed correctly!`,
        correctAnswer: '',
        previousAnswer: correctAnswer,
        playerOneGuess: '',
        playerTwoGuess: '',
      })
    } else {
      this.setState({
        statusMessage: 'Neither player guessed correctly!',
        correctAnswer: '',
        previousAnswer: correctAnswer,
        playerOneGuess: '',
        playerTwoGuess: '',
      })
    }

    this.loadQuestion();
  }

  endRound(e) {

    let playerGuess;

    if (e) playerGuess = e.target.innerText
    else playerGuess = '';

    if (this.state.currentRound !== 10) {
      if (this.state.playerTurn === 1) {
        this.setState({
          playerOneGuess: playerGuess,
          statusMessage: '',
          playerTurn: 2
        })
        socket.emit('currentState', this.state);
      } else {
        new Promise((resolve, reject) => {
          this.setState({
            playerTwoGuess: playerGuess,
            playerTurn: 1
          })
          resolve();
        })
        .then(() => {
          this.checkAnswer();
        })
      }
    } else {
      this.endGame();
    }
  }

  endGame() {
    this.setState({
      gameOver: true,
      statusMessage: 'GAME OVER',
      correctAnswer: ''
    });

    if (this.state.playerOneScore > this.state.playerTwoScore) {
      this.setState({winner: this.state.playerOne});
    } else {
      this.setState({winner: this.state.playerTwo});
    }

  }

  render() {

    socket.on('currentState', (state) => {
      this.setState(state)
    })

    socket.on('newPlayer', (arg) => {
      this.setState({newGame: true})
    })

    if (this.state.newGame && !this.state.alreadyRun) {
      this.setState({alreadyRun: true})
      this.newGame();
    }

    return(
      <div>

        {this.state.currentQuestion.question &&
        <Question currentQuestion={this.state.currentQuestion} currentRound={this.state.currentRound} endRound={this.endRound.bind(this)} />}

        {this.state.currentQuestion.question &&
        <Scoreboard playerOneScore={this.state.playerOneScore} playerTwoScore={this.state.playerTwoScore} statusMessage={this.state.statusMessage} playerOne={this.state.playerOne} playerTwo={this.state.playerTwo} previousAnswer={this.state.previousAnswer} endRound={this.endRound.bind(this)} currentRound={this.state.currentRound} gameOver={this.state.gameOver} endGame={this.endGame.bind(this)}/>
        }

        <div id="status">
          { this.state.playerTurn === 1 && this.state.gameOver === false ? <h3>It is {this.state.playerOne}'s turn to play</h3> : this.state.playerTurn === 2 && this.state.gameOver === false ? <h3>It is {this.state.playerTwo}'s turn to play</h3> : '' }

          { this.state.gameOver && <h3>The winner is {this.state.winner}</h3> }
        </div>


      </div>
    )
  }
}

export default App;