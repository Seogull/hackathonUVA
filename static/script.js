const userScoreElement = document.getElementById('user-score');
const arrows = {
    ArrowUp: document.getElementById('up'),
    ArrowDown: document.getElementById('down'),
    ArrowLeft: document.getElementById('left'),
    ArrowRight: document.getElementById('right')
};

let userScore = 0;
let round = 1;
let userHealth = 3; // User's health
let tempHealth = 3; 
let timer;
let timeLimit = 10 * 1000;
let startTime; // To track the start time
let elapsedTime = 0; // To store the elapsed time
let timerInterval;
let timeRemaining = timeLimit; // Time limit for each round
let gameOver = false; // Flag to track if the game is over
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
    startTimer(); // Start the timer for the round
}


function startTimer() {
    console.log("Starting timer for round:", round);
    remainingTime = timeLimit; // Set the remaining time to the time limit
    startTime = performance.now(); // Record the start time
    timerInterval = requestAnimationFrame(updateTimer); // Use requestAnimationFrame for smooth updates
}

function updateTimer() {
    if(gameOver) return; // Stop updating if the game is over
    console.log("Updating timer...");
    const elapsedTime = performance.now() - startTime; // Calculate the elapsed time in milliseconds
    remainingTime = timeLimit - elapsedTime; // Calculate the remaining time

    if (remainingTime <= 0) {
        remainingTime = 0; // Make sure time doesn't go negative
        cancelAnimationFrame(timerInterval);
        handleTimeout(); // Handle timeout when the timer reaches 0
    }

    const timerDisplay = document.getElementById('timer'); // Assuming there's a div with id 'timer' to show the time
    const timeInSeconds = (remainingTime / 1000).toFixed(3); // Convert milliseconds to seconds and round to 3 decimal places
    timerDisplay.textContent = `Time: ${timeInSeconds}s`; // Update the timer display

    // Continue updating the timer if the remaining time is greater than 0
    if (remainingTime > 0) {
        timerInterval = requestAnimationFrame(updateTimer); // Continue updating the timer
    }
}

function handleTimeout() {
    console.log("CALLING HANDLETIMEOUT!"); // Optional: Log timeout message
    tempHealth--; // Decrease health
    updateHealth(); // Update health display
    if (tempHealth > 0) {
        generateSequence(); // Generate a new sequence if still alive
    } else{
        if(!gameOver) { // Check if game over has already been triggered
                gameOver = true; // Set the flag to true
                endGame(); // Call endGame only once
        }
    }
}

function stopTimer() {
    cancelAnimationFrame(timerInterval); // Stop the ongoing timer
    console.log('Timer stopped');
}

// Display the sequence on the screen
function displaySequence() {
    const sequenceContainer = document.getElementById('arrows-to-press');
    sequenceContainer.innerHTML = ''; // Clear previous sequence

    // Loop through the sequence and display each arrow
    sequence.forEach(key => {
        const div = document.createElement("div");
        div.className = "arrow-display";
    
        const img = document.createElement("img");
        img.src = getSwordImagePath(key);
        img.alt = key;
        img.style.width = "50px";  // Optional: control size
        img.style.height = "50px";
        div.appendChild(img);
        sequenceContainer.appendChild(div);
    });
    //startTimer(); // Start the timer when displaying the sequence
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
    if (tempHealth <= 0 && !gameOver) {
        gameOver = true; // Set the flag to true
        stopTimer(); // Stop the timer when health is 0
        endGame();
        console.log("Game Over!"); // Optional: Log game over message
    }
}

function updateCorrect(){
    const allArrows = document.querySelectorAll('.arrows-to-press .arrow-display');
    const arrowToUpdate = allArrows[userInput.length - 1]; // Get the correct arrow

    if (arrowToUpdate) {
        const img = arrowToUpdate.querySelector('img');
        img.src = '/greensword.png'; // Change the image source to a green sword for correct input
    }

    console.log("Correct input UPDATE:", userInput[userInput.length - 1]);
}
function updateIncorrect() {
    const allArrows = document.querySelectorAll('.arrows-to-press .arrow-display');
    const arrowToUpdate = allArrows[userInput.length - 1]; // Get the correct arrow

    if (arrowToUpdate) {
        const img = arrowToUpdate.querySelector('img');
        img.src = '/redsword.png'; // Change the image source to a green sword for correct input
    }

    console.log("inorrect input UPDATE:", userInput[userInput.length - 1]);
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
            cancelAnimationFrame(timerInterval);
            stopTimer(); // Stop the timer
            timeRemaining = timeLimit; // Reset time remaining for the next round
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
    userScore++;
    userScoreElement.textContent = userScore;
}

// Start the game by generating the first sequence
function startGame() {
    generateSequence();
}

function endGame() {
    console.log("endGame called");
    stopTimer();
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
    round = 1;
    userHealth = 3; // Reset user's health
    tempHealth = 3; // Reset temporary health
    gameOver = false; // Reset game over flag
    userScoreElement.textContent = userScore;
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
