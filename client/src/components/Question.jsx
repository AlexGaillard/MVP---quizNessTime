import React from 'react';

const Question = ({ currentQuestion, currentRound, checkAnswer}) => {

  let category = currentQuestion.category;
  let questionBody = currentQuestion.question;
  let answers = [];

  const shuffleAnswers = () => {
    answers.push(currentQuestion.correct_answer);
    answers = answers.concat(currentQuestion.incorrect_answers);

    let currentIndex = answers.length;
    let randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [answers[currentIndex], answers[randomIndex]] =
      [answers[randomIndex], answers[currentIndex]];
    };
  };

  shuffleAnswers();

  return(
    <div id='question-box'>
      <h3>Question {currentRound || 1} </h3>
      <h4>Category: {category} </h4>
      <p>{questionBody}</p>
      <ul>
        { answers.map((answer) => <li onClick={checkAnswer}>{ answer }</li>)}
      </ul>
    </div>
  );
};

export default Question;