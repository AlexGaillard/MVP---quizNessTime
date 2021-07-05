import React from 'react';
import Question from './Question.jsx'
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      currentRound: 0,
      currentQuestion: {},
    }
  }

  componentDidMount() {
    axios.get('/questions')
    .then((res) => {
      this.setState({
        questions: res.data
      });
      this.loadQuestion();
    });
  }

  loadQuestion() {
    let round = this.state.currentRound + 1;
    this.setState({
      currentRound: round,
      currentQuestion: this.state.questions[round]
    });
  }

  checkAnswer(e) {
    if (e.target.innerText === this.state.currentQuestion.correct_answer) {
      alert("CORRECT")
    } else {
      alert("FALSE")
    }
    this.loadQuestion();
  }

  render() {
    return(
      <Question currentQuestion={this.state.currentQuestion} currentRound={this.state.currentRound} checkAnswer={this.checkAnswer.bind(this)} />
    )
  }
}

export default App;