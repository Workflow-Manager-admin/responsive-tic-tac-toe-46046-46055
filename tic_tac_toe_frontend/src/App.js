import React, { useState, useEffect } from 'react';
import './App.css';

// Board cell component
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      aria-label={value ? `Cell ${value}` : 'Empty Cell'}
    >
      {value}
    </button>
  );
}

// Calculate winner and which cells comprise the win
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // Theme state
  const [theme, setTheme] = useState('light');
  // Board and game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [hasStarted, setHasStarted] = useState(false); // To animate in
  const winnerObj = calculateWinner(squares);
  const isBoardFull = squares.every(Boolean);
  const gameOver = !!winnerObj || isBoardFull;
  const status = winnerObj
    ? `Winner: ${winnerObj.winner}`
    : isBoardFull
    ? "It's a draw!"
    : `Current Player: ${xIsNext ? 'X' : 'O'}`;

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  const handleClick = idx => {
    if (gameOver || squares[idx]) return;
    setHasStarted(true);
    const newSquares = squares.slice();
    newSquares[idx] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setHasStarted(false);
  };

  // Handle theme on mount and theme change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Responsive: focus on mobile first, centered layout
  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <main className="ttt-main">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <section className={`ttt-board${hasStarted ? ' started' : ''}`}>
          {[0, 1, 2].map(
            row =>
              <div className="ttt-row" key={row}>
                {[0, 1, 2].map(col => {
                  const idx = row * 3 + col;
                  const highlight = winnerObj?.line?.includes(idx);
                  return (
                    <Square
                      key={idx}
                      value={squares[idx]}
                      onClick={() => handleClick(idx)}
                      highlight={highlight}
                    />
                  );
                })}
              </div>
          )}
        </section>
        <div className={`ttt-status${gameOver ? ' gameover' : ''}`}>{status}</div>
        <button className="ttt-restart-btn" onClick={handleRestart} aria-label="Restart Game">
          Restart
        </button>
        <footer className="ttt-footer">
          <span>
            Two-player mode | Minimalist Design | <span className="ttt-credit">Made with React</span>
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
