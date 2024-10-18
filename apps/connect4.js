import { input, setButtonColor, sleep, setupCleaners, COLORS } from '../utils.js';

const buttonMap = [
  [81, 82, 83, 84, 85, 86, 87, 88, 89],
  [71, 72, 73, 74, 75, 76, 77, 78, 79],
  [61, 62, 63, 64, 65, 66, 67, 68, 69],
  [51, 52, 53, 54, 55, 56, 57, 58, 59],
  [41, 42, 43, 44, 45, 46, 47, 48, 49],
  [31, 32, 33, 34, 35, 36, 37, 38, 39],
  [21, 22, 23, 24, 25, 26, 27, 28, 29],
  [11, 12, 13, 14, 15, 16, 17, 18, 19],
];

await sleep(100);

const board = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
];

const flashColumn = async (index) => {
  let flash = true;
  const interval = setInterval(() => {
    buttonMap.map((row, i) => {
      setButtonColor(row[index], flash ? COLORS.WHITE : COLORS.OFF);
    });
    flash = !flash;
  }, 75);

  setTimeout(() => {
    clearInterval(interval);

    buttonMap.map((row, i) => {
      setButtonColor(row[index], board[i][index] === 'red' ? COLORS.RED : COLORS.YELLOW);
      flash = !flash;
    });
  }, 500);
};

const checkWinner = () => {
  const rows = board.length;
  const cols = board[0].length;
  const winLength = 4;

  const checkFour = (a, b, c, d) => a.val !== 0 && a.val === b.val && a.val === c.val && a.val === d.val;

  // Check horizontal
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= cols - winLength; c++) {
      const a = { val: board[r][c], coord: [r, c] };
      const b = { val: board[r][c+1], coord: [r, c+1] };
      const c1 = { val: board[r][c+2], coord: [r, c+2] };
      const d = { val: board[r][c+3], coord: [r, c+3] };

      if (checkFour(a, b, c1, d)) {
        return { winner: a.val, coordinates: [a.coord, b.coord, c1.coord, d.coord] };
      }
    }
  }

  // Check vertical
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r <= rows - winLength; r++) {
      const a = { val: board[r][c], coord: [r, c] };
      const b = { val: board[r+1][c], coord: [r+1, c] };
      const c1 = { val: board[r+2][c], coord: [r+2, c] };
      const d = { val: board[r+3][c], coord: [r+3, c] };

      if (checkFour(a, b, c1, d)) {
        return { winner: a.val, coordinates: [a.coord, b.coord, c1.coord, d.coord] };
      }
    }
  }

  // Check diagonal (top-left to bottom-right)
  for (let r = 0; r <= rows - winLength; r++) {
    for (let c = 0; c <= cols - winLength; c++) {
      const a = { val: board[r][c], coord: [r, c] };
      const b = { val: board[r+1][c+1], coord: [r+1, c+1] };
      const c1 = { val: board[r+2][c+2], coord: [r+2, c+2] };
      const d = { val: board[r+3][c+3], coord: [r+3, c+3] };

      if (checkFour(a, b, c1, d)) {
        return { winner: a.val, coordinates: [a.coord, b.coord, c1.coord, d.coord] };
      }
    }
  }

  // Check diagonal (bottom-left to top-right)
  for (let r = winLength - 1; r < rows; r++) {
    for (let c = 0; c <= cols - winLength; c++) {
      const a = { val: board[r][c], coord: [r, c] };
      const b = { val: board[r-1][c+1], coord: [r-1, c+1] };
      const c1 = { val: board[r-2][c+2], coord: [r-2, c+2] };
      const d = { val: board[r-3][c+3], coord: [r-3, c+3] };

      if (checkFour(a, b, c1, d)) {
        return { winner: a.val, coordinates: [a.coord, b.coord, c1.coord, d.coord] };
      }
    }
  }

  return null;
}

let currentPlayer = 'red';
let canPlay = true;

const handleMove = async (note) => {
  canPlay = false;
  const columnIndex = Number(String(note).split('')[1]) - 1;
  const CURRENT_COLOR = currentPlayer === 'red' ? COLORS.RED : COLORS.YELLOW;

  let currentHeighest = board.findIndex((row) => row[columnIndex] !== 0);
  currentHeighest = currentHeighest === -1 ? 7 : (currentHeighest - 1);

  // Reached top, can't play in this column anymore. Flash column then let player pick another move
  if (currentHeighest === -1) {
    await flashColumn(columnIndex);
    canPlay = true;
    return;
  }

  // Animate the dropping of the player's color piece
  for (let i = 0; i < currentHeighest; i++) {
    setButtonColor(buttonMap[i][columnIndex], CURRENT_COLOR);
    await sleep(25);

    for (let j = 0; j <= i; j++) {
      setButtonColor(buttonMap[i][columnIndex], COLORS.OFF);  
    }
  }

  setButtonColor(buttonMap[currentHeighest][columnIndex], CURRENT_COLOR);
  board[currentHeighest][columnIndex] = currentPlayer;

  const winner = checkWinner();

  if (winner) {
    let winnerFlash = true;
    setInterval(() => {
      winner.coordinates.forEach(([x,y]) => setButtonColor(buttonMap[x][y], winnerFlash ? CURRENT_COLOR : COLORS.OFF));
      winnerFlash = !winnerFlash;
    }, 200);
  } else {
    currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
  
    for (const row in Array.from({ length: 8 })) {
      setButtonColor(buttonMap[row][8], currentPlayer === 'red' ? COLORS.RED : COLORS.YELLOW);
    }
  
    canPlay = true;
  }
}

// Initialize right side control pad colors as RED (starting player's color)
for (const row in Array.from({ length: 8 })) {
  setButtonColor(buttonMap[row][8], currentPlayer === 'red' ? COLORS.RED : COLORS.YELLOW);
}

input.on('noteon', ({ note, velocity, channel } ) => {
  if (velocity === 0 || !canPlay) return;

  handleMove(note);
});

setupCleaners();