// script.js

document.addEventListener('DOMContentLoaded', () => {
    const X_CLASS = 'x';
    const O_CLASS = 'o';
    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    const cellElements = document.querySelectorAll('[data-cell]');
    const board = document.getElementById('board');
    const winningMessageElement = document.getElementById('winningMessage');
    const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
    const restartButton = document.getElementById('restartButton');
    const modeSelection = document.getElementById('modeSelection');
    const singlePlayerButton = document.getElementById('singlePlayerButton');
    const twoPlayerButton = document.getElementById('twoPlayerButton');
    const scoreboard = document.getElementById('scoreboard');
    const xWinsElement = document.getElementById('xWins');
    const oWinsElement = document.getElementById('oWins');
    
    let oTurn;
    let singlePlayer = false;
    let xWins = 0;
    let oWins = 0;

    singlePlayerButton.addEventListener('click', () => {
        singlePlayer = true;
        startGame();
    });

    twoPlayerButton.addEventListener('click', () => {
        singlePlayer = false;
        startGame();
    });

    restartButton.addEventListener('click', startGame);

    function startGame() {
        oTurn = true; // Player O starts
        cellElements.forEach(cell => {
            cell.classList.remove(X_CLASS);
            cell.classList.remove(O_CLASS);
            cell.innerText = '';
            cell.removeEventListener('click', handleClick);
            cell.addEventListener('click', handleClick, { once: true });
        });
        setBoardHoverClass();
        winningMessageElement.classList.remove('show');
        modeSelection.style.display = 'none';
        board.style.display = 'grid';
        scoreboard.style.display = 'block';
    }

    function handleClick(e) {
        const cell = e.target;
        const currentClass = oTurn ? O_CLASS : X_CLASS;
        placeMark(cell, currentClass);
        if (checkWin(currentClass)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            setBoardHoverClass();
            if (singlePlayer && !oTurn) {
                computerMove();
            }
        }
    }

    function computerMove() {
        const availableCells = [...cellElements].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
        const cell = availableCells[Math.floor(Math.random() * availableCells.length)];
        if (cell) {
            placeMark(cell, X_CLASS);
            if (checkWin(X_CLASS)) {
                endGame(false);
            } else if (isDraw()) {
                endGame(true);
            } else {
                swapTurns();
                setBoardHoverClass();
            }
        }
    }

    function endGame(draw) {
        if (draw) {
            winningMessageTextElement.innerText = 'Draw!';
        } else {
            winningMessageTextElement.innerText = `${oTurn ? "O's" : "X's"} Wins!`;
            if (oTurn) {
                oWins++;
                oWinsElement.innerText = oWins;
            } else {
                xWins++;
                xWinsElement.innerText = xWins;
            }
        }
        winningMessageElement.classList.add('show');
    }

    function isDraw() {
        return [...cellElements].every(cell => {
            return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
        });
    }

    function placeMark(cell, currentClass) {
        cell.classList.add(currentClass);
        cell.innerText = currentClass.toUpperCase(); // Add X or O text to the cell
    }

    function swapTurns() {
        oTurn = !oTurn;
    }

    function setBoardHoverClass() {
        board.classList.remove(X_CLASS);
        board.classList.remove(O_CLASS);
        if (oTurn) {
            board.classList.add(O_CLASS);
        } else {
            board.classList.add(X_CLASS);
        }
    }

    function checkWin(currentClass) {
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return cellElements[index].classList.contains(currentClass);
            });
        });
    }

    document.querySelectorAll('.unique-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${e.clientX - e.target.offsetLeft}px`;
            ripple.style.top = `${e.clientY - e.target.offsetTop}px`;
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});
