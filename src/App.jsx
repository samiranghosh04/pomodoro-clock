import { useState, useEffect } from 'react'

import './App.css'


function App() {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [time, setTime] = useState(workTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const audio = new Audio('./src/assets/digital-alarm-3-151917.mp3');


  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (time === 0) {
      setIsActive(false);
      setIsBreak((prevIsBreak) => !prevIsBreak);
      audio.play();
      setTime(isBreak ? workTime * 60 : breakTime * 60);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, time, isBreak, workTime, breakTime]);

  const startTimer = () => {
    setIsActive((prevIsActive) => !prevIsActive);
    audio.currentTime = 0;
    audio.pause();
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setWorkTime(25);
    setBreakTime(5);
    setTime(25 * 60);
    audio.currentTime = 0;
    audio.pause();
  };

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const incrementWorkTime = () => {
    setWorkTime((prevWorkTime) => 
    {
      if (prevWorkTime < 60) {
        return prevWorkTime + 1;
      }
      return prevWorkTime;
    });
    if (!isActive && !isBreak) {
      setTime((prevTime) => (prevTime + 60 >= 3600 ? 3600 : prevTime + 60));
    }
  };

  const decrementWorkTime = () => {
    setWorkTime((prevWorkTime) => (prevWorkTime > 1 ? prevWorkTime - 1 : prevWorkTime));
    if (!isActive && !isBreak) {
      setTime((prevTime) => (prevTime - 60 <= 0 ? 60 : prevTime - 60));
    }
  };

  const incrementBreakTime = () => {
    setBreakTime((prevBreakTime) =>
    {
      if (prevBreakTime < 60) {
        return prevBreakTime + 1;
      }
      return prevBreakTime;
    });
    if (!isActive && isBreak) {
      setTime((prevTime) => (prevTime + 60 >= 3600 ? 3600 : prevTime + 60));
    }
  };

  const decrementBreakTime = () => {
    setBreakTime((prevBreakTime) => (prevBreakTime > 1 ? prevBreakTime - 1 : prevBreakTime));
    if (!isActive && isBreak) {
      setTime((prevTime) => (prevTime - 60 <= 0 ? 60 : prevTime - 60));
    }
  };

  return (
    <>
      <div id="container">
        <h1>Pomodoro Clock</h1>
        <div id="duration-fix">
          <div className="session-fix">
            <button id="session-increment" onClick={incrementWorkTime}>+</button>
            <div id="session-label">Work Time: <h5 id="session-length">{workTime}</h5> <h6>minutes</h6></div>
            <button id="session-decrement" onClick={decrementWorkTime}>-</button>
          </div>
          <div className="break-fix">
            <button id="break-increment" onClick={incrementBreakTime}>+</button>
            <div id="break-label">Break Time: <h5 id="break-length">{breakTime}</h5> <h6>minutes</h6></div>
            <button id="break-decrement" onClick={decrementBreakTime}>-</button>
          </div>
        </div>
        <h2 id="timer-label">{isBreak ? 'Break Time' : 'Work Time'}</h2>
        <div><h1 id="time-left">{formatTime(time)}</h1></div>
        <button id="start_stop" onClick={startTimer}>Start / Stop</button>
        <button id="reset" onClick={resetTimer}>Reset</button>
      </div>
    </>
  )
}

export default App
