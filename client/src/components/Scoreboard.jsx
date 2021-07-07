import React from 'react';
import Timer from './Timer.jsx';

const Scoreboard = ({ playerOneScore, playerTwoScore, statusMessage, playerOne, playerTwo, previousAnswer, endRound, currentRound, gameOver, endGame }) => {
  return(
    <>
    <div id="scoreboard">
      {!gameOver && <Timer endRound={endRound} currentRound={currentRound} gameOver={gameOver} endGame={endGame} />}
      <div>
        <h2>{playerOne}</h2>
        <h2>{playerOneScore}</h2>
      </div>
      <div>
        <h2>{playerTwo}</h2>
        <h2>{playerTwoScore}</h2>
      </div>
      <div>
        <h2>{statusMessage}</h2>
        {previousAnswer && <h3>The correct answer was: {previousAnswer}</h3>}
      </div>
    </div>
    </>
  );
}

export default Scoreboard;