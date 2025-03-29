const userScoreElement = document.getElementById('user-score');
const opponentScoreElement = document.getElementById('opponent-score');
const arrows = {
    ArrowUp: document.getElementById('up'),
    ArrowDown: document.getElementById('down'),
    ArrowLeft: document.getElementById('left'),
    ArrowRight: document.getElementById('right')
};

let userScore = 0;
let opponentScore = 0;
let round = 1;

let sequence = [];
let userInput = [];

// Generate a random sequence of arrow keys
function generateSequence() {
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    sequence = [];
    userInput = [];
    for (let i = 0; i < round + 2; i++) { // Increase sequence length with each round
        sequence.push(keys[Math.floor(Math.random() * keys.length)]);
    }
    console.log("Generated sequence:", sequence);
    displaySequence(); // Display the sequence after generating it
}


// Display the sequence on the screen
function displaySequence() {
    const sequenceContainer = document.getElementById('arrows-to-press');
    sequenceContainer.innerHTML = ''; // Clear previous sequence

    // Loop through the sequence and display each arrow
    sequence.forEach(key => {
        const arrowDiv = document.createElement('div');
        arrowDiv.classList.add('arrow-sequence');
        arrowDiv.textContent = getArrowText(key);
        sequenceContainer.appendChild(arrowDiv);
    });
}

// Get the corresponding arrow symbol for display
function getArrowText(key) {
    switch(key) {
        case "ArrowUp": return "↑";
        case "ArrowDown": return "↓";
        case "ArrowLeft": return "←";
        case "ArrowRight": return "→";
        default: return "";
    }
}

// Check the user's input after each key press
// Check the user's input after each key press
function checkInput() {
    if (userInput.length <= sequence.length) {
        if (userInput[userInput.length - 1] !== sequence[userInput.length - 1]) {
            // Incorrect input
            alert("Incorrect! Try again.");
            userInput = [];  // Reset input and restart the sequence
            generateSequence(); // Generate a new sequence
            return;
        } else if (userInput.length === sequence.length) {
            // Correct input
            userScore++;
            userScoreElement.textContent = userScore;
            alert("Correct! New sequence.");
            round++;  // Increase the round number
            document.getElementById('current-round').textContent = round;
            generateSequence(); // Generate a new sequence for the next round
        }
    }
}
const outputDiv = document.getElementById('output');

    window.addEventListener('keydown', (event) => {
      let key = '';
      switch (event.key) {
        case 'ArrowUp':
          key = 'Up Arrow';
          break;
        case 'ArrowDown':
          key = 'Down Arrow';
          break;
        case 'ArrowLeft':
          key = 'Left Arrow';
          break;
        case 'ArrowRight':
          key = 'Right Arrow';
          break;
        default:
          key = 'Not an arrow key';
      }
      outputDiv.textContent = `You pressed: ${key}`;
    });

    // Listen for keydown events to capture user input
window.addEventListener('keydown', (event) => {
    if (arrows[event.key]) {
        userInput.push(event.key);
        arrows[event.key].classList.add('pressed');
        setTimeout(() => {
            arrows[event.key].classList.remove('pressed'); // Remove the animation after 200ms
        }, 200);
        checkInput(); // Check input after each key press
    }
});

function generateNewSequence() {
    const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    sequence.push(directions[Math.floor(Math.random() * directions.length)]);
}

// Function to update the scores
function updateScore(player) {
    if (player === 'user') {
        userScore++;
        userScoreElement.textContent = userScore;
    } else if (player === 'opponent') {
        opponentScore++;
        opponentScoreElement.textContent = opponentScore;
    }
}

// Start the game by generating the first sequence
function startGame() {
    generateSequence();
}

// Start the game
startGame();