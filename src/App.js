import React from 'react';
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"


export default function App() {
  // States to keep in check
  const [dice, setDice] = React.useState(createDice())
  const [win, setWin] = React.useState(false)
  const [time, setTime] = React.useState(Date.now())
  const [bestTime, setBestTime] = React.useState(()=>localStorage.getItem('bestTime') || 10000)
  const [rolls, setRolls] = React.useState(0)

  React.useEffect(() => {
    // checks if user wins every dice change
    dice.every(die => die.isHeld && die.value === dice[0].value) && setWin(true)
    
  },[dice])
  React.useEffect(() => {
  if (win){
    // calculates the finish time and upload it to localStorage if its better than best time
    let timeEnd = ((Date.now() - time)/1000)
    if (timeEnd < bestTime){
      setBestTime(timeEnd)
       localStorage.setItem('bestTime', timeEnd)
    }
  }
    
  },[win])
  
  function createDie(){
    // creates die objects
    return {value: Math.ceil(Math.random() * 6), id:nanoid(), isHeld:false}
  }

  function createDice() {
    // crates an array of die objects
    let diceArray = []
    for (let i = 0; i < 10; i++) {
      diceArray.push(createDie())
    }
    return diceArray
  }

  function rollDice(){
    // rolls dice if its not held, and increments rolls
    setDice(prev => prev.map(die => die.isHeld ? die : createDie() )) 
    setRolls(prev=> prev+1)
  }

  function holdDice(id){
    // hold the die if its id same as given id.
    !win && setDice(prevDice => prevDice.map(die => die.id === id ? {...die, isHeld:!die.isHeld} : die ))
  }
  
  function restart(){
    // restarts the game
    setWin(false)
    setDice(createDice())
    setTime(0)
    setRolls(0)
  }
  // creates Die components
  const diceElement = dice.map(die=> 
  <Die  value={die.value} 
        id={die.id} 
        key={die.id} 
        isHeld={die.isHeld}
        holdDice={() => holdDice(die.id)}/>)
  // takes the width and height of the screen to display Confetti correctly 
  const width = window.innerWidth
  const height = window.innerHeight - 1
  return (
    <main>
      <h1>Tenzies</h1>
      <p className="instructions">Roll until all dice are the same.
         Click each die to freeze it at its current value between rolls.
      </p>
      <div className="dice-container"> 
        {diceElement}
      </div>
                                  {/* checks what function to run depending on win situation */}
      <button className="Roll-btn" onClick={ win ? restart : rollDice}>{win ? "New game": "Roll"}</button>
                                          {/* shows best time as 0 when user doest have one */}
      <h2 className="best-time">Best time: {bestTime === 10000 ? 0 : bestTime}s</h2>
      {win && <Confetti 
        width={width}
        height={height}/>}
      <h2 className="rolls-counter">Rolls: {rolls}</h2>
    </main>
  );
}

