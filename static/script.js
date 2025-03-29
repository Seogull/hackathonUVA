
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

document.addEventListener('keydown', (event) => {
    if (arrows[event.key]) {
        arrows[event.key].classList.add('pressed');
        updateScore('user');
    }
});

document.addEventListener('keyup', (event) => {
    if (arrows[event.key]) {
        arrows[event.key].classList.remove('pressed');
    }
});

function updateScore(player) {
    if (player === 'user') {
        userScore++;
        userScoreElement.textContent = userScore;
    } else if (player === 'opponent') {
        opponentScore++;
        opponentScoreElement.textContent = opponentScore;
    }
}
