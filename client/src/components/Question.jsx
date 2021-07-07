import React from 'react';

const Question = ({ currentQuestion, currentRound, endRound}) => {

  const convertText = (conversionText) => {
    conversionText = conversionText.replace(/&quot;/g, '\"');
    conversionText = conversionText.replace(/&#039;/g, '\'');
    conversionText = conversionText.replace(/&aacute;/g, '\á');
    conversionText = conversionText.replace(/&uuml;/g, '\Ü');
    conversionText = conversionText.replace(/&rsquo;/g, '\'');
    conversionText = conversionText.replace(/&eacute/g, '\é');
    return conversionText;
  }

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

  let category = currentQuestion.category;
  let questionBody = currentQuestion.question;
  let answers = [];

  shuffleAnswers();

  return(
    <div id='question-box'>
      <div>
        <h3>Question {currentRound || 1} </h3>
        <h4>Category: {category} </h4>
        <p>{convertText(questionBody)}</p>
        <ul>
          { answers.map((answer) => <li onClick={endRound} key={answer}>{ convertText(answer) }</li>)}
        </ul>
      </div>
    </div>
  );
};

export default Question;