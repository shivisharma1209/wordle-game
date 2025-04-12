// import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const row3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
  const rows = 6;
  const columns = 5;
  const currentWord = 'chair';

  const isValidWord = async (word) => {
    try {
      const response = await axios.get(`https://wordsapiv1.p.mashape.com/words/${word}/entails`);
      return response.data.length > 0;
    } catch (error) {
      console.error('invalid word', error);
      return false;
    }
  }

  const [grid, setGrid] = useState(Array(rows).fill('').map(() => Array(columns).fill('')));
  const [colors, setColors] = useState(Array(rows).fill('').map(() => Array(columns).fill('#222c31')));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);

  const changeCellColor = (rowIndex, colIndex, newColor) => {
    const newColors = [...colors];
    newColors[rowIndex][colIndex] = newColor;
    setColors(newColors);
  };


  const handleKeyPress = (char) => {
    if (currentColumn < columns) {
      const newGrid = [...grid];
      newGrid[currentRow][currentColumn] = char;
      setGrid(newGrid);
      setCurrentColumn(currentColumn + 1);
    }
  }

  const handleDelete = () => {
    if (currentColumn > 0) {
      const newGrid = [...grid];
      newGrid[currentRow][currentColumn - 1] = '';
      setGrid(newGrid);
      setCurrentColumn(currentColumn - 1);
    }
  };

  const handleEnter = async () => {
    if (currentColumn === columns) {
      const word = grid[currentRow].join('');
      const isValid = await isValidWord(word);
      console.log('isValid:', isValid);
      if (!isValid) {
        const newGrid = [...grid];
        newGrid[currentRow].fill('');
        setGrid(newGrid);
        setCurrentColumn(0);
        alert('Invalid word');
        console.log('NO');
      }
      else{
        const newColors = [...colors];
        if (word === currentWord) {
          for (let i = 0; i < columns; i++) {
            changeCellColor(currentRow, i, '#538D4E');
          }
          console.log('Correct word!');
        } else {
          for (let i = 0; i < columns; i++) {
            if (word[i] === currentWord[i]) {
              newColors[currentRow][i] = '#538D4E';
              console.log('Correct letter in the correct position');
            } else if (currentWord.includes(word[i])) {
              newColors[currentRow][i] = '#B59F3B';
              console.log('Correct letter but in the wrong position');
            } else {
              newColors[currentRow][i] = '#3A3A3C';
              console.log('Incorrect letter');
            }
          }
          console.log('Incorrect answer');
        }
        setColors(newColors);
        setCurrentRow(currentRow + 1);
        if(currentRow === rows) {

          console.log('Game Over');
        }
      }

      console.log('Word entered:', grid[currentRow].join(''));
      setCurrentColumn(0);
    }
  };

  // const grid = [];
  // for (let i = 0; i < rows; i++) {
  //   const row = [];
  //   for (let j = 0; j < columns; j++) {
  //     row.push(
  //       <input type="text" id={`myInput-${cellId}`} key={`${i}-${j}`} className="w-10 h-10 border border-gray-500 m-1 hover:bg-gray-200"></input>
  //     );
  //     cellId++;
  //   }
  //   grid.push(
  //     <div key={i} className="grid-row flex">
  //       {row}
  //     </div>
  //   );
  // }

  return (
    <div className="App">
      <div className="flex flex-col items-center" id="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row flex">
            {row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                value={cell}
                style={{ backgroundColor: colors[rowIndex][colIndex] }}
                readOnly
                className="w-10 h-10 border border-gray-500 m-1 text-center"
              />
            ))}
          </div>
        ))}
      </div>
      <div id="keyboard">
        <div className="row">
          {row1.map((char, i) => (
            <button
              key={i}
              className="w-10 h-10 border border-gray-200 m-1 hover:bg-gray-400 rounded-md"
              onClick={() => handleKeyPress(char)}>
              {char}
            </button>
          ))}
        </div>
        <div className="row">
          {row2.map((char, i) => (
            <button
              key={i}
              className="w-10 h-10 border border-gray-200 m-1 hover:bg-gray-200 rounded-md"
              onClick={() => handleKeyPress(char)}>
              {char}
            </button>
          ))}
        </div>
        <div className="row">
          {row3.map((char, i) => (
            <button
              key={i}
              className="w-10 h-10 border border-gray-200 m-1 hover:bg-gray-200 rounded-md"
              onClick={() => handleKeyPress(char)}>
              {char}
            </button>
          ))}
        </div>
        <div className="row">
          <button
            className="w-20 h-10 border border-gray-200 m-1 hover:bg-gray-200 rounded-md"
            onClick={handleEnter}>
            Enter
          </button>
          <button
            className="w-20 h-10 border border-gray-200 m-1 hover:bg-gray-200 rounded-md"
            onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
