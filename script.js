"use strict";

// game variables
let board = Array(9).fill(null);
let currentPlayer = "X";
let startingPlayer = "X";
let winner = "X";

// GUI references
const playerBtn = document.querySelector(".player");
playerBtn.addEventListener("click", startGame);

const computetBtn = document.querySelector(".computer");
computetBtn.addEventListener("click", startGame);

const cells = document.querySelectorAll(".cell");
cells.forEach((cell) => cell.addEventListener("click", makeMove));

const info = document.querySelector(".info");

// functions
function startGame(evt) {
  const firstPlayer = evt.currentTarget.dataset.player;

  board = Array(9).fill(null);
  cells.forEach((cell) => {
    cell.innerText = "";
    cell.disabled = false;
  });

  currentPlayer = firstPlayer;
  info.innerText = `Ruch gracza ${currentPlayer}`;

  if (currentPlayer === "O") getComputerMove();
}

function makeMove(evt) {
  if (checkForLoss() || isBoardFull()) return 0;
  if (startingPlayer != currentPlayer) return;

  const index = evt.currentTarget.dataset.id;

  if (board[index] !== null) return;

  board[index] = currentPlayer === "O" ? "O" : "X";
  cells[index].innerText = currentPlayer === "O" ? "O" : "X";

  if (checkForLoss()) {
    alert("Gracz X przegrał!");
    info.innerText = `Aby zagrac ponownie wybierz kto zaczyna`;
    return;
  }

  if (isBoardFull()) {
    alert("Remis!");
    info.innerText = `Aby zagrac ponownie wybierz kto zaczyna`;
    return 0;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  info.innerText = `Ruch gracza ${currentPlayer}`;

  if (currentPlayer === "O") {
    setTimeout(() => getComputerMove(), 700);
  }
}

function checkForLoss() {
  const winConditions = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  const winnerX = winConditions.some((condition) => condition.every((index) => board[index] === "X"));
  const winnerO = winConditions.some((condition) => condition.every((index) => board[index] === "O"));

  if (winnerX) {
    winner = "X";
    return winnerX;
  }

  if (winnerO) {
    winner = "O";
    return winnerO;
  }

  return false;
}

function minimax(isMaximizing) {
  if (checkForLoss()) return winner === "O" ? 10 : -10;
  if (isBoardFull()) return 0;

  let results = [];

  for (let i = 0; i < 9; i++) {
    if (board[i] != null) continue;

    board[i] = isMaximizing ? "X" : "O";
    results.push(minimax(!isMaximizing));

    board[i] = null;
  }

  return isMaximizing ? Math.max(...results) : Math.min(...results);
}

function getComputerMove() {
  let results = [];
  let moves = [];

  for (let i = 0; i < 9; i++) {
    if (board[i] !== null) continue;

    board[i] = "O";
    results.push(minimax(true));
    moves.push(i);

    board[i] = null;
  }

  let bestScore = results[0];
  let move = moves[0];

  for (let i = 1; i < results.length; i++) {
    if (results[i] < bestScore) {
      bestScore = results[i];
      move = moves[i];
    }
  }

  board[move] = "O";
  cells[move].innerText = "O";

  if (checkForLoss()) {
    alert("Gracz O przegrał!");
    info.innerText = `Aby zagrac ponownie wybierz kto zaczyna`;
    return;
  }

  if (isBoardFull()) {
    alert("Remis!");
    info.innerText = `Aby zagrac ponownie wybierz kto zaczyna`;
    return 0;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  info.innerText = `Ruch gracza ${currentPlayer}`;
}

function isBoardFull() {
  return board.every((cell) => cell !== null);
}