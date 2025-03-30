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
let userHealth = 3; // User's health
let tempHealth = 3; 
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
        arrowDiv.classList.add('arrow');
        arrowDiv.textContent = getArrowText(key);
        sequenceContainer.appendChild(arrowDiv);
    });
}


function displayHealth() {
    const healthContainer = document.getElementById('health-display');
    healthContainer.innerHTML = ''; // Clear any previous hearts

    // Loop to create hearts based on userHealth
    for (let i = 0; i < userHealth; i++) { // Assuming the max health is 5
        const heart = document.createElement('span');
        heart.classList.add('heart');

        // Add either full or empty heart depending on userHealth
        if (i < tempHealth) {
            heart.textContent = '❤️'; // Full heart
        } else {
            heart.textContent = '🤍'; // Empty heart
            heart.classList.add('empty-heart'); // Optional: Make empty hearts lighter
        }

        healthContainer.appendChild(heart);
    }
}

function updateHealth() {
    const hearts = document.querySelectorAll('.heart'); 
    if (hearts[tempHealth]) {
        hearts[tempHealth].textContent = '🤍'; // Change only the last full heart to empty
    }
    if (tempHealth <= 0) {
        endGame();
    }
}

function updateCorrect(){
    const allArrows = document.querySelectorAll('.arrows-to-press .arrow');
    console.log("last:", allArrows[allArrows.length - 1]);
    console.log("userInput:", allArrows[userInput.length - 1]);
    allArrows[userInput.length - 1].classList.add('correct'); // Add a class for correct arrows

    console.log("Correct input UPDATE:", userInput[userInput.length - 1]);
}
function updateIncorrect() {
    const allArrows = document.querySelectorAll('.arrows-to-press .arrow');
    if(allArrows[userInput.length - 1]) {
        allArrows[userInput.length - 1].classList.add('incorrect'); // Add a class for incorrect arrows
    }
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
function checkInput() {
    let currentIndex = userInput.length - 1;
    if (currentIndex < 0 || currentIndex >= sequence.length) return;
    console.log("User input:", userInput[currentIndex]); 
    console.log("currentIndex:", currentIndex);
    if (userInput[currentIndex] !== sequence[currentIndex]) {
        // Incorrect input, but allow the user to continue
        console.log("Incorrect input:", userInput[currentIndex]);
        updateIncorrect(); // Update the display for incorrect inputs
        tempHealth--; // Optional: Reduce health if tracking lives
        updateHealth(); // Update health display
    } else {
        console.log("Correct input:", userInput[currentIndex]);
        updateCorrect(); // Update the display for correct inputs
    }
    // Check if the user has completed the sequence correctly
    // If the user completes the full sequence correctly
    // Delay before generating a new sequence
    if (userInput.length === sequence.length) {
        // Show "Status" after the last input
        const statusElement = document.createElement('h2');
        statusElement.textContent = 'Complete'; // Set text of h2
        
        // Find the container where you want to insert the new element
        const gameInfoContainer = document.querySelector('.game-info');
        
        // Find the element you want to insert before
        const arrowsContainer = document.querySelector('.arrows-to-press');
        
        // Insert the status element before the arrows container
        gameInfoContainer.insertBefore(statusElement, arrowsContainer);

        // Delay before generating a new sequence
        setTimeout(() => {
            // Remove the "Status" message before generating a new sequence
            statusElement.remove();

            // Update score and round
            userScore++;
            userScoreElement.textContent = userScore;
            round++;  // Increase the round number
            document.getElementById('current-round').textContent = round;

            // Generate a new sequence
            generateSequence(); // Generate the next sequence
        }, 1000); // 1 second delay before generating new sequence
    }
}

    // Listen for keydown events to capture user input
const keydownListener = (event) => {
    if (arrows[event.key]) {
        userInput.push(event.key);
        arrows[event.key].classList.add('pressed');
        setTimeout(() => {
            arrows[event.key].classList.remove('pressed'); // Remove the animation after 200ms
        }, 50);
        checkInput(); // Check input after each key press
    }
};
window.addEventListener('keydown', keydownListener);

function stopListening() {
    window.removeEventListener('keydown', keydownListener);
}
    
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

function endGame() {
    console.log("endGame called");
        // Show "Status" after the last input
        const statusElement = document.createElement('h2');
        statusElement.textContent = 'Game Over'; // Set text of h2
        
        // Find the container where you want to insert the new element
        const gameInfoContainer = document.querySelector('.game-info');
        
        // Find the element you want to insert before
        const arrowsContainer = document.querySelector('.arrows-to-press');
        
        // Insert the status element before the arrows container
        gameInfoContainer.insertBefore(statusElement, arrowsContainer);

    // Stop listening to key presses
    stopListening();
  }

function resetGame() {
    userScore = 0;
    opponentScore = 0;
    round = 1;
    userHealth = 3; // Reset user's health
    tempHealth = 3; // Reset temporary health
    userScoreElement.textContent = userScore;
    opponentScoreElement.textContent = opponentScore;
    document.getElementById('current-round').textContent = round;
    displayHealth(); // Display initial health
    generateSequence(); // Generate the first sequence

    window.addEventListener('keydown', keydownListener);
    const statusElement = document.querySelector('.game-info h2');
    if (statusElement) {
        statusElement.remove();
    }
}
document.getElementById("play-again-btn").addEventListener("click", resetGame);




// Start the game
startGame();
displayHealth();
