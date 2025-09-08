// Tic-Tac-Toe game logic
const board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let winLine = null;
let mode = 'pvp'; // 'pvp' or 'pvc'

const gameBoard = document.getElementById('game-board');
const statusSpan = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const pvpBtn = document.getElementById('pvp');
const pvcBtn = document.getElementById('pvc');

pvpBtn.addEventListener('click', () => {
    mode = 'pvp';
    restartGame();
    pvpBtn.classList.add('active');
    pvcBtn.classList.remove('active');
});
pvcBtn.addEventListener('click', () => {
    mode = 'pvc';
    restartGame();
    pvcBtn.classList.add('active');
    pvpBtn.classList.remove('active');
});

function renderBoard() {
    gameBoard.innerHTML = '';
    board.forEach((cell, idx) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.dataset.index = idx;
        cellDiv.textContent = cell || '';
        cellDiv.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cellDiv);
    });
    if (winLine) {
        drawWinLine(winLine);
    }
}

function handleCellClick(e) {
    const idx = e.target.dataset.index;
    if (!gameActive || board[idx]) return;
    if (mode === 'pvp' || currentPlayer === 'X') {
        board[idx] = currentPlayer;
        winLine = null;
        renderBoard();
        const win = checkWin();
        if (win) {
            if (mode === 'pvc' && currentPlayer === 'X') {
                statusSpan.textContent = 'Player has won!';
            } else {
                statusSpan.textContent = `Player ${currentPlayer} wins!`;
            }
            gameActive = false;
            winLine = win;
            renderBoard();
        } else if (board.every(cell => cell)) {
            statusSpan.textContent = "It's a draw!";
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusSpan.textContent = `Player ${currentPlayer}'s turn`;
            if (mode === 'pvc' && currentPlayer === 'O' && gameActive) {
                setTimeout(computerMove, 400);
            }
        }
    }
}

function computerMove() {
    // Simple random AI for O
    const emptyCells = board.map((cell, idx) => cell ? null : idx).filter(idx => idx !== null);
    if (emptyCells.length === 0) return;
    const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[move] = 'O';
    winLine = null;
    renderBoard();
    const win = checkWin();
    if (win) {
        if (mode === 'pvc') {
            statusSpan.textContent = 'Computer has won!';
        } else {
            statusSpan.textContent = 'Player O wins!';
        }
        gameActive = false;
        winLine = win;
        renderBoard();
    } else if (board.every(cell => cell)) {
        statusSpan.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = 'X';
        statusSpan.textContent = `Player X's turn`;
    }
}

function checkWin() {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8], // rows
        [0,3,6],[1,4,7],[2,5,8], // cols
        [0,4,8],[2,4,6]          // diags
    ];
    for (let i = 0; i < winPatterns.length; i++) {
        const [a,b,c] = winPatterns[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return winPatterns[i];
        }
    }
    return null;
}

function drawWinLine(pattern) {
    // Use percentage-based coordinates for SVG overlay
    let x1, y1, x2, y2;
    if (pattern[0] === 0 && pattern[1] === 1 && pattern[2] === 2) { // Top row
        x1 = '10%'; y1 = '16.66%'; x2 = '90%'; y2 = '16.66%';
    } else if (pattern[0] === 3 && pattern[1] === 4 && pattern[2] === 5) { // Middle row
        x1 = '10%'; y1 = '50%'; x2 = '90%'; y2 = '50%';
    } else if (pattern[0] === 6 && pattern[1] === 7 && pattern[2] === 8) { // Bottom row
        x1 = '10%'; y1 = '83.33%'; x2 = '90%'; y2 = '83.33%';
    } else if (pattern[0] === 0 && pattern[1] === 3 && pattern[2] === 6) { // Left col
        x1 = '16.66%'; y1 = '10%'; x2 = '16.66%'; y2 = '90%';
    } else if (pattern[0] === 1 && pattern[1] === 4 && pattern[2] === 7) { // Middle col
        x1 = '50%'; y1 = '10%'; x2 = '50%'; y2 = '90%';
    } else if (pattern[0] === 2 && pattern[1] === 5 && pattern[2] === 8) { // Right col
        x1 = '83.33%'; y1 = '10%'; x2 = '83.33%'; y2 = '90%';
    } else if (pattern[0] === 0 && pattern[1] === 4 && pattern[2] === 8) { // Diagonal TL-BR
        x1 = '10%'; y1 = '10%'; x2 = '90%'; y2 = '90%';
    } else if (pattern[0] === 2 && pattern[1] === 4 && pattern[2] === 6) { // Diagonal TR-BL
        x1 = '90%'; y1 = '10%'; x2 = '10%'; y2 = '90%';
    }
    const winLineDiv = document.createElement('div');
    winLineDiv.className = 'win-line';
    winLineDiv.innerHTML = `<svg viewBox='0 0 100 100'><line x1='${parseFloat(x1)}' y1='${parseFloat(y1)}' x2='${parseFloat(x2)}' y2='${parseFloat(y2)}' /></svg>`;
    gameBoard.appendChild(winLineDiv);
}

function restartGame() {
    for (let i = 0; i < board.length; i++) board[i] = null;
    currentPlayer = 'X';
    gameActive = true;
    winLine = null;
    statusSpan.textContent = `Player X's turn`;
    renderBoard();
}

// Event listeners
restartBtn.addEventListener('click', restartGame);

// Initialize game
renderBoard();
