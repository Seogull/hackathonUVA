// Multiplayer Arrow Game - Combined Keydown Version

let players = ["player1", "player2"];
let currentPlayerIndex = 0;
let round = 1;
const maxRounds = 3;
let combo = [];
let userInput = [];
let startTime;
let acceptingInput = false;

const arrows = {
  ArrowUp: document.getElementById('up'),
  ArrowDown: document.getElementById('down'),
  ArrowLeft: document.getElementById('left'),
  ArrowRight: document.getElementById('right')
};

const completionTimes = {
  player1: [],
  player2: []
};

const missedArrowsPerPlayer = {
  player1: {
    ArrowUp: 0,
    ArrowDown: 0,
    ArrowLeft: 0,
    ArrowRight: 0
  },
  player2: {
    ArrowUp: 0,
    ArrowDown: 0,
    ArrowLeft: 0,
    ArrowRight: 0
  }
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

    const img = document.createElement("img");
    img.src = getSwordImagePath(key);
    img.alt = key;
    img.style.width = "50px";  
    img.style.height = "50px";

    div.appendChild(img);
    container.appendChild(div);
  });
}
function getSwordImagePath(key) {
  switch (key) {
    case "ArrowUp": return "/swordup.png";
    case "ArrowDown": return "/sworddown.png";
    case "ArrowLeft": return "/swordleft.png";
    case "ArrowRight": return "/swordright.png";
    default: return "";
  }
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
      callback();
    }
  }, 1000);
}

function nextTurn() {
  if (round > maxRounds) {
    return endGame();
  }

  updateDisplay();
  combo = generateRandomCombo();
  userInput = [];
  acceptingInput = false;

  startCountdown(() => {
    displaySequence(combo);
    document.getElementById("combo-entry-status").textContent = "🎯 Memorize and repeat the combo!";
    startTime = Date.now();
    acceptingInput = true;
  });
}

function getMostMissedArrowText(player) {
  let mostMissed = "";
  let mostMissedCount = 0;

  for (let key in missedArrowsPerPlayer[player]) {
    if (missedArrowsPerPlayer[player][key] > mostMissedCount) {
      mostMissed = key;
      mostMissedCount = missedArrowsPerPlayer[player][key];
    }
  }

  if (mostMissedCount > 0) {
    return ` Most missed sword: ${getArrowText(mostMissed)} (${mostMissedCount} times)⚠️`;
  } else {
    return ` No swords missed!✅`;
  }
}

function endGame() {
  const p1 = completionTimes.player1.reduce((a, b) => a + b, 0);
  const p2 = completionTimes.player2.reduce((a, b) => a + b, 0);

  let result = `Game Over🏑<br>Player 1: ${p1.toFixed(2)}s<br>Player 2: ${p2.toFixed(2)}s<br>`;
  if (p1 < p2) result += "Winner: Player 1🏆";
  else if (p2 < p1) result += "Winner: Player 2🏆";
  else result += "It's a tie🤝";

  result += `<br><br>Player 1 Most Missed: ${getMostMissedArrowText("player1")}`;
  result += `<br>Player 2 Most Missed: ${getMostMissedArrowText("player2")}`;

  const finalResultDiv = document.getElementById("final-result");
  finalResultDiv.innerHTML = result;
  finalResultDiv.style.display = "block";

  document.getElementById("player1-time").textContent = p1.toFixed(2);
  document.getElementById("player2-time").textContent = p2.toFixed(2);

  window.removeEventListener("keydown", combinedKeydown);
}

function combinedKeydown(e) {
  if (!acceptingInput) return;

  const key = e.key;
  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) return;

  if (arrows[key]) {
    arrows[key].classList.add("pressed");
    setTimeout(() => {
      arrows[key].classList.remove("pressed");
    }, 50);
  }

  userInput.push(key);
  displaySequence(userInput);

  if (userInput.length === 4) {
    acceptingInput = false;
    const end = Date.now();
    const timeTaken = ((end - startTime) / 1000).toFixed(2);

    const currentPlayer = getCurrentPlayer();
    
    if (userInput.join() === combo.join()) {
      document.getElementById("combo-entry-status").textContent = `✅ Correct! Time: ${timeTaken}s`;
      completionTimes[currentPlayer].push(parseFloat(timeTaken));
    } else {
      document.getElementById("combo-entry-status").textContent = "❌ Wrong combo. +5s penalty.";
      completionTimes[currentPlayer].push(5.0);

      for (let i = 0; i < combo.length; i++) {
        if (userInput[i] !== combo[i]) {
          missedArrowsPerPlayer[currentPlayer][combo[i]]++;
        }
      }
    }
    const totalTime = completionTimes[currentPlayer].reduce((a, b) => a + b, 0).toFixed(2);
    document.getElementById(`${currentPlayer}-time`).textContent = totalTime;

    currentPlayerIndex++;
    if (currentPlayerIndex % players.length === 0) {
      round++;
    }

    setTimeout(nextTurn, 1500);
  }
}

function resetGame() {
  currentPlayerIndex = 0;
  round = 1;
  combo = [];
  userInput = [];
  completionTimes.player1 = [];
  completionTimes.player2 = [];

  document.getElementById("final-result").innerHTML = "";
  document.getElementById("final-result").style.display = "none";
  document.getElementById("player1-time").textContent = "0";
  document.getElementById("player2-time").textContent = "0";
  document.getElementById("output").textContent = "No key pressed";

  for (let player of players) {
    for (let key in missedArrowsPerPlayer[player]) {
      missedArrowsPerPlayer[player][key] = 0;
    }
  }

  window.addEventListener("keydown", combinedKeydown);
  updateDisplay();
  nextTurn();
}

document.getElementById("play-again-btn").addEventListener("click", resetGame);

window.addEventListener("keydown", combinedKeydown);
updateDisplay();
nextTurn();