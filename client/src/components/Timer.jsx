import React from 'react';

class Timer extends React.Component {
  constructor({props}) {
    super(props);
    this.state = {
      timer: 15
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.props.gameOver) {
        this.setState({ timer: 0 })
        this.endTimer();
      } else {
        this.setState({ timer: 15 })
      }
    }
  }

  setTimer() {
    this.myInterval = setInterval(() => {
      this.setState({timer: this.state.timer - 1})

      if (this.state.timer === 0) {
        if (this.props.currentRound === 10) {
          this.endTimer();
          this.props.endGame();
        } else {
          this.setState({timer: 15});
        }
        this.props.endRound();
      }

    }, 1000)
  }

  componentDidMount() {
    this.setTimer();
  }

  endTimer() {
    clearInterval(this.myInterval);
  }

  render() {
    return (
      <h3 className='timer'>{this.state.timer}</h3>
    )
  }

}

export default Timer;