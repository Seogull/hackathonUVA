// multiplayer.js

let players = ["player1", "player2"];
let currentPlayerIndex = 0;
let round = 1; // current round per player
const maxRounds = 3; // number of rounds per player
let combo = [];
let userInput = [];
let startTime;
let acceptingInput = false; // flag to control when key presses are accepted

const completionTimes = {
  player1: [],
  player2: []
};

function getCurrentPlayer() {
  return players[currentPlayerIndex % players.length];
}

function updateDisplay() {
  document.getElementById("game-round").textContent = `Round ${round}`;
  document.getElementById("player-turn").textContent = `${getCurrentPlayer()}'s turn: Repeat the combo`;
  document.getElementById("arrows-to-press").innerHTML = "";
  document.getElementById("combo-entry-status").textContent = "";
}

function getArrowText(key) {
  switch (key) {
    case "ArrowUp": return "↑";
    case "ArrowDown": return "↓";
    case "ArrowLeft": return "←";
    case "ArrowRight": return "→";
    default: return "";
  }
}

function generateRandomCombo() {
  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  let combo = [];
  for (let i = 0; i < 4; i++) {
    combo.push(keys[Math.floor(Math.random() * keys.length)]);
  }
  return combo;
}

function displaySequence(seq) {
  const container = document.getElementById("arrows-to-press");
  container.innerHTML = "";
  seq.forEach(key => {
    const div = document.createElement("div");
    div.className = "arrow-display";
    div.textContent = getArrowText(key);
    container.appendChild(div);
  });
}

function startCountdown(callback) {
  let countdown = 3;
  const status = document.getElementById("combo-entry-status");
  status.textContent = `⏳ Starting in ${countdown}...`;

  const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      status.textContent = `⏳ Starting in ${countdown}...`;
    } else {
      clearInterval(interval);
      callback(); // Show combo after countdown
    }
  }, 1000);
}

function nextTurn() {
  if (round > maxRounds) {
    console.log("Round exceeds maxRounds, ending game");
    return endGame();
  }

  updateDisplay();
  combo = generateRandomCombo();
  userInput = [];
  acceptingInput = false; // disable input until combo is shown

  startCountdown(() => {
    displaySequence(combo);
    document.getElementById("combo-entry-status").textContent = "🎯 Memorize and repeat the combo!";
    startTime = Date.now();
    acceptingInput = true; // enable input after combo is displayed
  });
}

function endGame() {
  console.log("endGame called");
  const p1 = completionTimes.player1.reduce((a, b) => a + b, 0);
  const p2 = completionTimes.player2.reduce((a, b) => a + b, 0);

  let result = `Game Over🏁<br>Player 1: ${p1.toFixed(2)}s<br>Player 2: ${p2.toFixed(2)}s<br>`;
  if (p1 < p2) result += "Winner: Player 1🏆";
  else if (p2 < p1) result += "Winner: Player 2🏆";
  else result += "It's a tie🤝";

  console.log("Result:", result);
  const finalResultDiv = document.getElementById("final-result");
  finalResultDiv.innerHTML = result;
  finalResultDiv.style.display = "block"; // Ensure result is visible

  // Update scoreboard times
  document.getElementById("player1-time").textContent = p1.toFixed(2);
  document.getElementById("player2-time").textContent = p2.toFixed(2);

  // Stop listening to key presses
  window.removeEventListener("keydown", handleKeydown);
}

function handleKeydown(e) {
  if (!acceptingInput) return; // ignore key presses if not accepting input

  const key = e.key;
  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) return;

  document.getElementById("output").textContent = `You pressed: ${getArrowText(key)}`;
  userInput.push(key);
  // Display the user's input (this overwrites the generated combo display)
  displaySequence(userInput);

  if (userInput.length === 4) {
    acceptingInput = false; // disable further input
    const end = Date.now();
    const timeTaken = ((end - startTime) / 1000).toFixed(2);

    if (userInput.join() === combo.join()) {
      document.getElementById("combo-entry-status").textContent = `✅ Correct! Time: ${timeTaken}s`;
      completionTimes[getCurrentPlayer()].push(parseFloat(timeTaken));
    } else {
      document.getElementById("combo-entry-status").textContent = "❌ Wrong combo. +5s penalty.";
      completionTimes[getCurrentPlayer()].push(5.0);
    }

    // Increment turn: every key press turn increments the currentPlayerIndex.
    currentPlayerIndex++;
    // Increment round only after both players have taken their turn.
    if (currentPlayerIndex % players.length === 0) {
      round++;
    }

    console.log(`After turn: currentPlayerIndex=${currentPlayerIndex}, round=${round}`);
    setTimeout(nextTurn, 1500);
  }
}

function resetGame() {
  console.log("resetGame called");
  currentPlayerIndex = 0;
  round = 1;
  combo = [];
  userInput = [];
  completionTimes.player1 = [];
  completionTimes.player2 = [];

  // Reset final result display
  document.getElementById("final-result").innerHTML = "";
  document.getElementById("final-result").style.display = "none";
  document.getElementById("player1-time").textContent = "0";
  document.getElementById("player2-time").textContent = "0";
  document.getElementById("output").textContent = "No key pressed";

  // Restart game by re-adding the keydown listener and resetting display
  window.addEventListener("keydown", handleKeydown);
  updateDisplay();
  nextTurn();
}

document.getElementById("play-again-btn").addEventListener("click", resetGame);

// Start game on page load
window.addEventListener("keydown", handleKeydown);
updateDisplay();
nextTurn();
