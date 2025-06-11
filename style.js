// DOM Elements
const buttons = document.querySelectorAll('.btn1');
const resetButton = document.querySelector('.reset');
const winnerDisplay = document.querySelector('.winner');

// Game State
let gameState = {
    isPlayerXTurn: true,
    moveCount: 0,
    board: ['', '', '', '', '', '', '', '', ''],
    gameOver: false,
    winner: null
};

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Save game state to localStorage
const saveGameState = () => {
    localStorage.setItem('ticTacToeGame', JSON.stringify(gameState));
};

// Load game state from localStorage
const loadGameState = () => {
    const savedState = localStorage.getItem('ticTacToeGame');
    if (savedState) {
        gameState = JSON.parse(savedState);
        updateBoardFromState();
        if (gameState.gameOver) {
            if (gameState.winner === 'X') {
                winnerDisplay.textContent = 'Player X wins!';
            } else if (gameState.winner === 'O') {
                winnerDisplay.textContent = 'Player O wins!';
            } else {
                winnerDisplay.textContent = 'Game is a draw!';
            }
            winnerDisplay.style.display = 'inline';
            disableAllButtons();
        }
    }
};

// Update the visual board from game state
const updateBoardFromState = () => {
    buttons.forEach((button, index) => {
        button.textContent = gameState.board[index];
        button.disabled = gameState.board[index] !== '' || gameState.gameOver;
    });
};

// Game Functions
const announceWinner = (winner) => {
    gameState.gameOver = true;
    gameState.winner = winner;
    winnerDisplay.style.display = 'inline';
    winnerDisplay.textContent = winner === 'X' ? 'Player X wins!' : 'Player O wins!';
    disableAllButtons();
    saveGameState();
};

const announceDraw = () => {
    gameState.gameOver = true;
    gameState.winner = null;
    winnerDisplay.style.display = 'inline';
    winnerDisplay.textContent = 'Game is a draw!';
    saveGameState();
};

const checkForWinner = () => {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameState.board[a] && 
            gameState.board[a] === gameState.board[b] && 
            gameState.board[a] === gameState.board[c]) {
            return gameState.board[a];
        }
    }
    return null;
};

const disableAllButtons = () => {
    buttons.forEach(button => button.disabled = true);
};

const resetGame = () => {
    gameState = {
        isPlayerXTurn: true,
        moveCount: 0,
        board: ['', '', '', '', '', '', '', '', ''],
        gameOver: false,
        winner: null
    };
    winnerDisplay.textContent = '';
    winnerDisplay.style.display = 'none';
    updateBoardFromState();
    localStorage.removeItem('ticTacToeGame');
};

// Event Handlers
const handleButtonClick = (event) => {
    if (gameState.gameOver) return;
    
    const clickedButton = event.target;
    const buttonIndex = Array.from(buttons).indexOf(clickedButton);
    
    if (gameState.board[buttonIndex]) return;
    
    const currentPlayer = gameState.isPlayerXTurn ? 'X' : 'O';
    gameState.board[buttonIndex] = currentPlayer;
    gameState.moveCount++;
    gameState.isPlayerXTurn = !gameState.isPlayerXTurn;
    
    updateBoardFromState();
    saveGameState();
    
    const winner = checkForWinner();
    if (winner) {
        announceWinner(winner);
    } else if (gameState.moveCount === 9) {
        announceDraw();
    }
};

const handleResetClick = () => {
    resetGame();
};
// Theme Toggle Functionality
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Set default to dark mode
body.classList.add('dark-mode');
themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
themeToggle.classList.add('light-button'); // Add light button class

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        // Switch to light mode
        body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.classList.remove('light-button');
        themeToggle.classList.add('dark-button');
    } else {
        // Switch to dark mode
        body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.classList.remove('dark-button');
        themeToggle.classList.add('light-button');
    }
});
// Event Listeners
buttons.forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

resetButton.addEventListener('click', handleResetClick);

// Initialize game
const init = () => {
    loadGameState();
    if (!localStorage.getItem('ticTacToeGame')) {
        resetGame();
    }
};

init();
