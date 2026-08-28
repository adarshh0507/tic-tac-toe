/*
  ============================================
  TIC-TAC-TOE GAME - GAME LOGIC
  ============================================
  
  v1.0 - Basic Game Logic
    - Single Player vs AI
    - Minimax Algorithm
    - Win Detection
    - Score Tracking
  
  v2.0 - Ultimate Edition
    - Game Mode Selection
    - Two-Player Support
    - Player Names & Symbols
    - Theme Toggle (Dark/Light)
    - Screen Navigation
    - Enhanced Game Logic
  
  ============================================
*/

// ==================== TIC-TAC-TOE ULTIMATE - JAVASCRIPT ====================

// Game Variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gameMode = null; // 'single' or 'two-player'
let playerSymbols = { player1: 'X', player2: 'O' };
let playerNames = { player1: 'You', player2: 'AI' };
let scores = { player1: 0, player2: 0, draw: 0 };

// DOM Elements
const modeScreen = document.getElementById('mode-screen');
const singleSetupScreen = document.getElementById('single-setup-screen');
const twoSetupScreen = document.getElementById('two-setup-screen');
const gameScreen = document.getElementById('game-screen');

const modeButtons = {
    singlePlayer: document.getElementById('single-player-mode'),
    twoPlayer: document.getElementById('two-player-mode')
};

const setupButtons = {
    singleX: document.getElementById('single-x-btn'),
    singleO: document.getElementById('single-o-btn'),
    backFromSingle: document.getElementById('back-from-single'),
    backFromTwo: document.getElementById('back-from-two'),
    startGame: document.getElementById('start-game-btn')
};

const gameElements = {
    cells: document.querySelectorAll('.cell'),
    statusText: document.getElementById('status-text'),
    resetBtn: document.getElementById('reset-btn'),
    homeBtn: document.getElementById('home-btn'),
    playAgainBtn: document.getElementById('play-again-btn'),
    homeFromModal: document.getElementById('home-from-modal-btn'),
    gameOverModal: document.getElementById('game-over-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalMessage: document.getElementById('modal-message'),
    aiThinking: document.getElementById('ai-thinking'),
    gameTitle: document.getElementById('game-title'),
    gameModeInfo: document.getElementById('game-mode-info'),
    player1Label: document.getElementById('player1-label'),
    player2Label: document.getElementById('player2-label'),
    player1Score: document.getElementById('player1-score'),
    player2Score: document.getElementById('player2-score'),
    drawScore: document.getElementById('draw-score')
};

const themeBtn = document.getElementById('theme-btn');

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// ==================== THEME TOGGLE ==================== 

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    themeBtn.innerHTML = document.body.classList.contains('dark-mode') 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
}

// ==================== SCREEN NAVIGATION ====================

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

function backToMode() {
    showScreen(modeScreen);
}

// ==================== MODE SELECTION ====================

modeButtons.singlePlayer.addEventListener('click', () => {
    gameMode = 'single';
    showScreen(singleSetupScreen);
});

modeButtons.twoPlayer.addEventListener('click', () => {
    gameMode = 'two-player';
    showScreen(twoSetupScreen);
});

// ==================== SINGLE PLAYER SETUP ====================

setupButtons.singleX.addEventListener('click', () => {
    playerSymbols.player1 = 'X';
    playerSymbols.player2 = 'O';
    playerNames.player1 = 'You';
    playerNames.player2 = 'AI';
    startSinglePlayerGame();
});

setupButtons.singleO.addEventListener('click', () => {
    playerSymbols.player1 = 'O';
    playerSymbols.player2 = 'X';
    playerNames.player1 = 'You';
    playerNames.player2 = 'AI';
    startSinglePlayerGame();
});

setupButtons.backFromSingle.addEventListener('click', backToMode);

// ==================== TWO PLAYER SETUP ====================

const player1Input = document.getElementById('player1-name');
const player2Input = document.getElementById('player2-name');
let player1Selected = 'X';
let player2Selected = 'O';

// Symbol selection for two-player
document.querySelectorAll('.symbol-option').forEach(btn => {
    btn.addEventListener('click', () => {
        const player = btn.dataset.player;
        const symbol = btn.dataset.symbol;
        
        // Remove previous selection for this player
        document.querySelectorAll(`.symbol-option[data-player="${player}"]`).forEach(b => {
            b.classList.remove('selected');
        });
        
        // Add selection to clicked button
        btn.classList.add('selected');
        
        if (player === '1') {
            player1Selected = symbol;
            player2Selected = symbol === 'X' ? 'O' : 'X';
        } else {
            player2Selected = symbol;
            player1Selected = symbol === 'X' ? 'O' : 'X';
        }
        
        // Update display
        document.querySelectorAll(`.symbol-option[data-player="2"]`).forEach(b => {
            b.classList.remove('selected');
        });
        document.querySelector(`.symbol-option[data-player="2"][data-symbol="${player2Selected}"]`)?.classList.add('selected');
    });
});

setupButtons.backFromTwo.addEventListener('click', backToMode);

setupButtons.startGame.addEventListener('click', () => {
    const player1Name = player1Input.value.trim() || 'Player 1';
    const player2Name = player2Input.value.trim() || 'Player 2';
    
    playerNames.player1 = player1Name;
    playerNames.player2 = player2Name;
    playerSymbols.player1 = player1Selected;
    playerSymbols.player2 = player2Selected;
    
    startTwoPlayerGame();
});

// ==================== START GAMES ====================

function startSinglePlayerGame() {
    initGame();
    gameElements.gameTitle.textContent = 'Tic-Tac-Toe';
    gameElements.gameModeInfo.textContent = 'Single Player vs AI';
    gameElements.player1Label.textContent = `You (${playerSymbols.player1})`;
    gameElements.player2Label.textContent = `AI (${playerSymbols.player2})`;
    showScreen(gameScreen);
}

function startTwoPlayerGame() {
    initGame();
    gameElements.gameTitle.textContent = 'Tic-Tac-Toe';
    gameElements.gameModeInfo.textContent = 'Two Players - Offline';
    gameElements.player1Label.textContent = `${playerNames.player1} (${playerSymbols.player1})`;
    gameElements.player2Label.textContent = `${playerNames.player2} (${playerSymbols.player2})`;
    showScreen(gameScreen);
}

// ==================== INITIALIZE GAME ====================

function initGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = playerSymbols.player1;
    gameActive = true;
    updateStatus();
    
    gameElements.cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    
    gameElements.player1Score.textContent = scores.player1;
    gameElements.player2Score.textContent = scores.player2;
    gameElements.drawScore.textContent = scores.draw;
}

// ==================== UPDATE STATUS ====================

function updateStatus() {
    if (!gameActive) return;
    
    const currentName = currentPlayer === playerSymbols.player1 
        ? playerNames.player1 
        : playerNames.player2;
    
    gameElements.statusText.textContent = `${currentName}'s Turn (${currentPlayer})`;
}

// ==================== CELL CLICK HANDLER ====================

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.dataset.index);

    if (board[index] !== '' || !gameActive) return;

    // Make move
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    // Check win/draw
    if (checkWin(currentPlayer)) {
        endGame(currentPlayer === playerSymbols.player1 ? playerNames.player1 : playerNames.player2, 'win');
        return;
    }

    if (isBoardFull()) {
        endGame(null, 'draw');
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === playerSymbols.player1 ? playerSymbols.player2 : playerSymbols.player1;
    updateStatus();

    // AI move (single player mode)
    if (gameMode === 'single' && currentPlayer === playerSymbols.player2) {
        disableBoard();
        gameElements.aiThinking.classList.add('active');
        
        setTimeout(() => {
            makeAIMove();
            gameElements.aiThinking.classList.remove('active');
            enableBoard();
            
            if (checkWin(playerSymbols.player2)) {
                endGame('AI', 'win');
                return;
            }

            if (isBoardFull()) {
                endGame(null, 'draw');
                return;
            }

            currentPlayer = playerSymbols.player1;
            updateStatus();
        }, 1000);
    }
}

// ==================== DISABLE/ENABLE BOARD ====================

function disableBoard() {
    gameElements.cells.forEach(cell => cell.style.pointerEvents = 'none');
}

function enableBoard() {
    gameElements.cells.forEach(cell => cell.style.pointerEvents = 'auto');
}

// ==================== AI MOVE (MINIMAX) ====================

function makeAIMove() {
    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = playerSymbols.player2;
            let score = minimax(board, 0, false);
            board[i] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    board[bestMove] = playerSymbols.player2;
    const cell = document.querySelector(`[data-index="${bestMove}"]`);
    cell.textContent = playerSymbols.player2;
    cell.classList.add(playerSymbols.player2.toLowerCase());
}

// ==================== MINIMAX ALGORITHM ====================

function minimax(currentBoard, depth, isMaximizing) {
    if (checkWinBoard(currentBoard, playerSymbols.player2)) return 10 - depth;
    if (checkWinBoard(currentBoard, playerSymbols.player1)) return depth - 10;
    if (isBoardFullBoard(currentBoard)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] === '') {
                currentBoard[i] = playerSymbols.player2;
                let score = minimax(currentBoard, depth + 1, false);
                currentBoard[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] === '') {
                currentBoard[i] = playerSymbols.player1;
                let score = minimax(currentBoard, depth + 1, true);
                currentBoard[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// ==================== CHECK WIN ====================

function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

function checkWinBoard(currentBoard, player) {
    return winningCombinations.some(combination => {
        return combination.every(index => currentBoard[index] === player);
    });
}

// ==================== CHECK BOARD FULL ====================

function isBoardFull() {
    return board.every(cell => cell !== '');
}

function isBoardFullBoard(currentBoard) {
    return currentBoard.every(cell => cell !== '');
}

// ==================== END GAME ====================

function endGame(winner, result) {
    gameActive = false;
    
    setTimeout(() => {
        if (result === 'win') {
            gameElements.modalTitle.textContent = '🎉 Congratulations!';
            gameElements.modalMessage.textContent = `${winner} Won!`;
            if (winner === playerNames.player1) {
                scores.player1++;
            } else {
                scores.player2++;
            }
        } else if (result === 'draw') {
            gameElements.modalTitle.textContent = '🤝 Draw!';
            gameElements.modalMessage.textContent = "It's a tie!";
            scores.draw++;
        }
        
        gameElements.player1Score.textContent = scores.player1;
        gameElements.player2Score.textContent = scores.player2;
        gameElements.drawScore.textContent = scores.draw;
        
        gameElements.gameOverModal.classList.add('active');
    }, 500);
}

// ==================== RESET & HOME ====================

gameElements.resetBtn.addEventListener('click', () => {
    initGame();
    gameElements.gameOverModal.classList.remove('active');
});

gameElements.playAgainBtn.addEventListener('click', () => {
    initGame();
    gameElements.gameOverModal.classList.remove('active');
});

gameElements.homeBtn.addEventListener('click', () => {
    scores = { player1: 0, player2: 0, draw: 0 };
    backToMode();
});

gameElements.homeFromModal.addEventListener('click', () => {
    scores = { player1: 0, player2: 0, draw: 0 };
    gameElements.gameOverModal.classList.remove('active');
    backToMode();
});

// ==================== CELL EVENTS ====================

gameElements.cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// ==================== KEYBOARD SUPPORT ====================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && gameActive === false) {
        initGame();
        gameElements.gameOverModal.classList.remove('active');
    }
});

// ==================== INITIALIZE ====================

showScreen(modeScreen);

function initGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusText.textContent = 'Your Turn (X)';
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'disabled');
    });
}

// ==================== CELL CLICK HANDLER ====================

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.dataset.index);

    // Check if cell is empty and game is active
    if (board[index] !== '' || !gameActive) {
        return;
    }

    // Player makes move (X)
    board[index] = 'X';
    cell.textContent = 'X';
    cell.classList.add('x');

    // Check if player won
    if (checkWin('X')) {
        endGame('You Won! 🎉');
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
        return;
    }

    // Check if board is full
    if (isBoardFull()) {
        endGame('It\'s a Draw! 🤝');
        drawScore++;
        drawScoreDisplay.textContent = drawScore;
        return;
    }

    // AI's turn
    currentPlayer = 'O';
    statusText.textContent = 'AI is thinking...';
    cells.forEach(c => c.style.pointerEvents = 'none');
    aiThinking.classList.add('active');

    // AI makes move after delay
    setTimeout(() => {
        makeAIMove();
        aiThinking.classList.remove('active');
        cells.forEach(c => c.style.pointerEvents = 'auto');

        // Check if AI won
        if (checkWin('O')) {
            endGame('AI Won! 🤖');
            aiScore++;
            aiScoreDisplay.textContent = aiScore;
            return;
        }

        // Check if board is full
        if (isBoardFull()) {
            endGame('It\'s a Draw! 🤝');
            drawScore++;
            drawScoreDisplay.textContent = drawScore;
            return;
        }

        // Back to player's turn
        currentPlayer = 'X';
        statusText.textContent = 'Your Turn (X)';
    }, 1000);
}

// ==================== AI MOVE (MINIMAX ALGORITHM) ====================

function makeAIMove() {
    // Find best move using Minimax
    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    // Make the best move
    board[bestMove] = 'O';
    const cell = document.querySelector(`[data-index="${bestMove}"]`);
    cell.textContent = 'O';
    cell.classList.add('o');
}

// ==================== MINIMAX ALGORITHM ====================

function minimax(currentBoard, depth, isMaximizing) {
    // Check terminal states
    if (checkWinBoard(currentBoard, 'O')) return 10 - depth;
    if (checkWinBoard(currentBoard, 'X')) return depth - 10;
    if (isBoardFullBoard(currentBoard)) return 0;

    if (isMaximizing) {
        // AI is maximizing
        let bestScore = -Infinity;
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] === '') {
                currentBoard[i] = 'O';
                let score = minimax(currentBoard, depth + 1, false);
                currentBoard[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        // Player is minimizing
        let bestScore = Infinity;
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] === '') {
                currentBoard[i] = 'X';
                let score = minimax(currentBoard, depth + 1, true);
                currentBoard[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// ==================== CHECK WIN FUNCTION ====================

function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

function checkWinBoard(currentBoard, player) {
    return winningCombinations.some(combination => {
        return combination.every(index => currentBoard[index] === player);
    });
}

// ==================== CHECK FULL BOARD ====================

function isBoardFull() {
    return board.every(cell => cell !== '');
}

function isBoardFullBoard(currentBoard) {
    return currentBoard.every(cell => cell !== '');
}

// ==================== END GAME ====================

function endGame(message) {
    gameActive = false;
    statusText.textContent = message;
    
    // Show modal
    setTimeout(() => {
        modalMessage.textContent = message;
        if (message.includes('Won! 🎉')) {
            modalTitle.textContent = 'Congratulations!';
        } else if (message.includes('Won! 🤖')) {
            modalTitle.textContent = 'AI Won!';
        } else {
            modalTitle.textContent = 'Draw!';
        }
        gameOverModal.classList.add('active');
    }, 500);
}

// ==================== RESET GAME ====================

function resetGame() {
    initGame();
    gameOverModal.classList.remove('active');
}

function newGame() {
    playerScore = 0;
    aiScore = 0;
    drawScore = 0;
    playerScoreDisplay.textContent = playerScore;
    aiScoreDisplay.textContent = aiScore;
    drawScoreDisplay.textContent = drawScore;
    resetGame();
}

// ==================== EVENT LISTENERS ====================

// Cell click events
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Button events
resetBtn.addEventListener('click', resetGame);
newGameBtn.addEventListener('click', newGame);
playAgainBtn.addEventListener('click', resetGame);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        resetGame();
    }
});

// ==================== START GAME ====================

initGame();
