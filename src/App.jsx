import { useEffect, useMemo, useRef, useState } from 'react'
import Confetti from 'react-confetti';
import './App.css'

const gameIcons = ["😶‍🌫️","🧞","👨‍🍳","👩‍🚀","🙆‍♂️","🎉"];

function App() {
  const [pieces, setpieces] = useState([]);
  let timeOut = useRef()

  const isGameCompleted = useMemo(()=> {
    if (pieces.length>0 && pieces.every(itm=> itm.resolved)) {
      debugger;
      return true ;
    }
    return false ;
  },[pieces]) 

  const startGame = ()=> {
    const repeatedIcons =[...gameIcons,...gameIcons];
    const newGameIcons = [];

    while (newGameIcons.length < gameIcons.length*2) {
      const randomIndex = Math.floor(Math.random()*repeatedIcons.length)
      newGameIcons.push( {
      emoji : repeatedIcons[randomIndex],
      flipped : false,
      resolved : false,
      position : newGameIcons.length
      });
      repeatedIcons.splice(randomIndex,1)
    }
    setpieces(newGameIcons)
  };

  useEffect(() => {
    startGame()
  }, [])
  

  const handleActive = (data)=> {
    const flipData = pieces.filter(itm => itm.flipped && !itm.resolved)
    if (flipData.length === 2)  return ;

    const newPieces =pieces.map (itm=> {
      if (itm.position === data.position) {
        itm.flipped =!pieces.flipped
      }
      return itm;
    });
    setpieces(newPieces)
  }

  const gameLogicForFlipped = () => {
    const flippedData = pieces.filter((data) => data.flipped && !data.resolved);
    if (flippedData.length === 2) {
      timeOut.current = setTimeout(() => {
        setpieces(
          pieces.map((piece) => {
            if (
              piece.position === flippedData[0].position ||
              piece.position === flippedData[1].position
            ) {
              if (flippedData[0].emoji === flippedData[1].emoji) {
                piece.resolved = true;
              } else {
                piece.flipped = false;
              }
            }
            return piece;
          })
        );
      }, 800);
    }
  };

  useEffect(() => {
    gameLogicForFlipped();

    return () => {
      clearTimeout(timeOut.current);
    };
  }, [pieces]);

 

  return (
    <div className="app-container">
      <h1>The Game App</h1>
      <div className="game-container">
        {pieces.map((data, index) => (
            <div
              className={`flip-card ${
                data.flipped || data.resolved ? "active" : "" } `}
              key={index}
              onClick={() => handleActive(data)}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front" />
                <div className="flip-card-back">{data.emoji}</div>
              </div>
            </div>
          ))}
        </div>

       {isGameCompleted && (
          <div className="game-completed">
            <h2>Congratulation YOU WINN.......!!!</h2>
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          </div>
        )} 

    </div>
  )
}

export default App
