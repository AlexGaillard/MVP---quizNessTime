import React from 'react';
import Question from './Question.jsx';
import Scoreboard from './Scoreboard.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      currentRound: 0,
      currentQuestion: {},
      playerOneScore: 0,
      playerTwoScore: 0,
      statusMessage: '',
      correctAnswer: '',
      playerOne: '',
      playerTwo: '',
      playerTurn: 1,
      playerOneGuess: '',
      playerTwoGuess: '',
      gameOver: false
    }

  }

  componentDidMount() {
    let playerOne = prompt("Please enter your name Player 1");
    let playerTwo = prompt("Please enter your name Player 2");

    axios.get('/questions')
    .then((res) => {
      this.setState({
        questions: res.data,
        playerOne: playerOne,
        playerTwo: playerTwo
      });
      this.loadQuestion();
    });
  }

  loadQuestion() {
    let round = this.state.currentRound + 1;
    this.setState({
      currentRound: round,
      currentQuestion: this.state.questions[round - 1],
      correctAnswer: this.state.questions[round - 1].correct_answer
    });
  }

  checkAnswer() {
    let correctAnswer = this.state.correctAnswer;
    alert(this.state.playerOneGuess)
    alert(this.state.playerTwoGuess)
    alert(this.state.correctAnswer)
    if (this.state.playerOneGuess === correctAnswer && this.state.playerTwoGuess === correctAnswer) {
      this.setState({
        playerOneScore: this.state.playerOneScore + 1,
        playerTwoScore: this.state.playerTwoScore + 1,
        statusMessage: `Both players guessed correctly!`,
        correctAnswer: '',
        // playerOneGuess: '',
        // playerTwoGuess: '',
      })
    } else if (this.state.playerOneGuess === correctAnswer && this.state.playerTwoGuess !== correctAnswer) {
      this.setState({
        playerOneScore: this.state.playerOneScore + 1,
        statusMessage: `${this.state.playerOne} guessed correctly!`,
        correctAnswer: '',
        // playerOneGuess: '',
        // playerTwoGuess: '',
      })
    } else if (this.state.playerOneGuess !== correctAnswer && this.state.playerTwoGuess === correctAnswer) {
      this.setState({
        playerTwoScore: this.state.playerTwoScore + 1,
        statusMessage: `${this.state.playerTwo} guessed correctly!`,
        correctAnswer: '',
        // playerOneGuess: '',
        // playerTwoGuess: '',
      })
    } else {
      this.setState({
        statusMessage: 'Neither player guessed correctly!',
        correctAnswer: '',
        // playerOneGuess: '',
        // playerTwoGuess: '',
      })
    }

    this.loadQuestion();
  }

  endRound(e) {
    if (this.state.currentRound !== 10) {
      if (this.state.playerTurn === 1) {
        this.setState({
          playerOneGuess: e.target.innerText,
          statusMessage: '',
          playerTurn: 2
        })
      } else {
        this.setState({
          playerTwoGuess: e.target.innerText,
          playerTurn: 1
        })
        this.checkAnswer(e);
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
  }

  render() {
    return(
      <div>
      {this.state.currentQuestion.question &&
      <Question currentQuestion={this.state.currentQuestion} currentRound={this.state.currentRound} endRound={this.endRound.bind(this)} />}

      {this.state.currentQuestion.question &&
      <Scoreboard playerOneScore={this.state.playerOneScore} playerTwoScore={this.state.playerTwoScore} statusMessage={this.state.statusMessage} playerOne={this.state.playerOne} playerTwo={this.state.playerTwo} correctAnswer={this.state.correctAnswer} endRound={this.endRound.bind(this)} currentRound={this.state.currentRound} gameOver={this.state.gameOver} endGame={this.endGame.bind(this)}/>
      }

      { this.state.playerTurn === 1 ? <h3>It is {this.state.playerOne}'s turn to play</h3> : <h3>It is {this.state.playerTwo}'s turn to play</h3> }

      </div>
    )
  }
}

export default App;