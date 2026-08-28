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
