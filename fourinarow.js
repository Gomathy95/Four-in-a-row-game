const noOfRows = document.getElementById("noOfRows");
const noOfColumn = document.getElementById("noOfColumns");
const playerDiv = document.getElementById("player");
const players = ["yellow", "Red"];
let array2D = [];
let currentToken = "";
let currentTurn = 0;
let selectedColumn = 0;
let currentPlayer = "";
let countRed = 0;
let countYellow = 0;
let playerHasWon = false;
let rows = 0;
let cols = 0;

//Generates the game board based on user input
function generateBoard() {
    rows = parseInt(noOfRows.value);
    cols = parseInt(noOfColumn.value);
    document.getElementById("winner").innerText = "";

    if (rows >= 4 && cols >= 4) {
        resetBoard();
        document.getElementById("message").innerText = "";
        initializeBoard(rows, cols);
        displayBoard(rows, cols);
        takeTurn();
    } else {
        document.getElementById("message").innerText = "INVALID ROWS & COLUMNS";
    }
}

function initializeBoard(rows, cols) {
    array2D = [];
    for (let row = 0; row < rows; row++) {
        array2D[row] = [];
        for (let column = 0; column < cols; column++) {
            array2D[row][column] = "0";
        }
    }
}


function checkCircleCount() {
    if (currentToken === "R") {
        countRed++;
    }
    if (currentToken === "Y") {
        countYellow++;
    }
    return countRed > 3 || countYellow > 3;
}

function checkHorizontal(row) {
    let count = 0;
    for (let colvalue = 0; colvalue < cols; colvalue++) {
        if (array2D[row][colvalue] === currentToken) {
            count++;
            if (count === 4) {break;
            }
        } else {
            count = 0;
        }
    }
    return count;
}

function checkVertical(col) {
    let count = 0;
    for (let rowvalue = rows - 1; rowvalue >= 0; rowvalue--) { 
        if (array2D[rowvalue][col] === currentToken) {
            count++;
            if (count === 4) {break;
            }
        } else {
            count = 0;
        }
    }
    return count;
}

function checkDiagonalLeftToRight(rowIndex, colIndex) {
    let count = 1;
    // Check down-left direction
    for (let k = 1; k < 4; k++) {
        let row = rowIndex + k;
        let col = colIndex - k;
        if (row < rows && col >= 0 && array2D[row][col] === currentToken) {
            count++;
        } else{ break;
        }
    }
    // Check up-right direction
    for (let k = 1; k < 4; k++) {
        let row = rowIndex - k;
        let col = colIndex + k;
        if (row >= 0 && col < cols && array2D[row][col] === currentToken) {
            count++;
        } else {break
        };
    }
    return count;
}

function checkDiagonalRightToLeft(rowIndex, colIndex) {
    let count = 1;
    // Check up-left direction
    for (let k = 1; k < 4; k++) {
        let row = rowIndex - k;
        let col = colIndex - k;
        if (row >= 0 && col >= 0 && array2D[row][col] === currentToken) {
            count++;
        } else {
            break;
        }
    }
    // Check down-right direction
    for (let k = 1; k < 4; k++) {
        let row = rowIndex + k;
        let col = colIndex + k;
        if (row < rows && col < cols && array2D[row][col] === currentToken) {
            count++;
        } else{ break;
        }
    }
    return count;
}

function dropToken() {
    for (let row = rows - 1; row >= 0; row--) {
        if (isCellEmpty(row, selectedColumn)) {
            placeToken(row, selectedColumn);
            updateUI(row, selectedColumn);
            if (checkForWin(row, selectedColumn)) {
                playerHasWon = true;
            }
            break;
        }
    }
    return playerHasWon;
}

function isCellEmpty(row, selectedColumn) {
    return array2D[row][selectedColumn] === "0";
}

function placeToken(row, selectedColumn) {
    array2D[row][selectedColumn] = currentToken;
}

function updateUI(row, selectedColumn) {
    const circleId = `${row}-row-${selectedColumn}-column`;//5-row-3-column
    document.getElementById(circleId).style.background = currentPlayer;
}

//Checks if the current move results in a win condition
function checkForWin(row, selectedColumn) {
    return (
        checkHorizontal(row) >= 4 ||
        checkVertical(selectedColumn) >= 4 ||
        checkDiagonalRightToLeft(row, selectedColumn) >= 4 ||
        checkDiagonalLeftToRight(row, selectedColumn) >= 4
    );
}

//game-over message
function matchOver(message) {
    document.getElementById("winner").innerText = message;
}
//Function to handle player's turn
function takeTurn() {
    currentPlayer = players[currentTurn];
    currentToken = currentPlayer === "yellow" ? "Y" : "R";
    playerDiv.innerText = `${currentPlayer}'s Turn`.toUpperCase();
    playerDiv.style.background = currentPlayer;
    currentTurn = (currentTurn + 1) % players.length;
}

//Updates the page to reflect the token placement
function clickHandler(column) {
    if (!playerHasWon) {
        let count = countRed + countYellow; //0 =0+0
        selectedColumn = column;
        let isMatchFound = dropToken();
        if (!isMatchFound) {
            if (count === rows * cols) matchOver("GAME OVER");
            else takeTurn();
        } else matchOver(currentToken === "Y" ? "YELLOW WON" : "RED WON");
    }
}

function displayBoard(rows, cols) {
    const newBoard = document.createElement("table");
    newBoard.className = "board";
    newBoard.id = "board";
    for (let row = 0; row < rows; row++) {
        const rowDiv = document.createElement("tr");
        for (let column = 0; column < cols; column++) {
            const colsDiv = document.createElement("td");
            colsDiv.id = `${row}-row-${column}-column`;
            colsDiv.addEventListener("click", () => clickHandler(column));
            rowDiv.appendChild(colsDiv);
        }
        newBoard.appendChild(rowDiv);
    }
    document.getElementById("board").replaceWith(newBoard);
}

//Resets the board and game variables
function resetBoard() {
    array2D = [];
    currentToken = "";
    currentTurn = 0;
    selectedColumn = 0;
    currentPlayer = "";
    countRed = 0;
    countYellow = 0;
    playerHasWon = false;

    document.getElementById("board").innerHTML = "";
    document.getElementById("winner").innerText = "";
    document.getElementById("player").innerHTML = "";
    document.getElementById("message").innerText = "";
}