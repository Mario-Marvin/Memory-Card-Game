// Select elements for splash screen and game interface
const splashScreen = document.getElementById('splash-screen');
const splashStartButton = document.getElementById('splash-start-button');
const header = document.querySelector('header');
const main = document.querySelector('main');
const footer = document.querySelector('footer');
const startButton = document.getElementById('start-button');
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');

// Initialize game variables
let sequence = [];  // Stores the sequence of colors that the player must replicate
let playerSequence = [];  // Stores the player's attempts to match the sequence
let score = 0;  // Player's current score
let flipSpeed = 1000;  // Time in milliseconds for how fast the cards flip
let level = 1;  // Tracks the game level (used for increasing difficulty)
const baseColors = ['red', 'blue', 'green', 'yellow'];  // The initial set of colors for the cards
let colors = [...baseColors];  // Array of colors used in the game, starts with base colors

// Function to create game cards dynamically
function createGameCards() {
    gameBoard.innerHTML = '';  // Clear the game board before adding new cards
    colors.forEach((color) => {  // Loop through each color in the colors array
        const card = document.createElement('div');  // Create a new div for each card
        card.classList.add('card');  // Add the 'card' class for styling
        card.dataset.color = color;  // Assign the color as a data attribute to identify it

        // Create the inner part of the card (front and back)
        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        // Create the front and back of the card
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');

        // Assemble the card by adding front and back to the inner part
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        // Add an event listener to flip the card when clicked
        card.addEventListener('click', () => handlePlayerInput(color));

        // Add the card to the game board
        gameBoard.appendChild(card);
    });

    adjustGameBoardLayout();  // Adjust the layout of the game board based on the number of cards
}

// Function to adjust the layout of the game board based on the number of cards
function adjustGameBoardLayout() {
    const rows = Math.ceil(colors.length / 4);  // Calculate how many rows are needed based on the number of cards
    gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;  // Update grid layout for rows
    gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';  // Ensure 4 cards per row
}

// Function to start the game
function startGame() {
    score = 0;  // Reset the score
    level = 1;  // Reset the level
    sequence = [];  // Reset the sequence of cards
    playerSequence = [];  // Reset the player's attempts
    flipSpeed = 1000;  // Reset the card flip speed to the initial value
    colors = [...baseColors];  // Reset the card colors to the base set
    scoreDisplay.textContent = score;  // Update the score display
    createGameCards();  // Create the initial set of cards
    nextRound();  // Start the first round
}

// Function to start the next round by adding a new random color to the sequence
function nextRound() {
    playerSequence = [];  // Reset the player's sequence for the new round
    const nextColor = colors[Math.floor(Math.random() * colors.length)];  // Pick a random color from the available colors
    sequence.push(nextColor);  // Add the new color to the sequence
    playSequence();  // Display the sequence to the player
}

// Function to play the sequence by flipping the cards in order
function playSequence() {
    sequence.forEach((color, index) => {
        setTimeout(() => {
            highlightCard(color);  // Highlight each card in the sequence with a delay
        }, (index + 1) * flipSpeed);  // Delay increases for each card in the sequence
    });
}

// Function to highlight a card for feedback
function highlightCard(color) {
    const card = [...document.querySelectorAll('.card')].find(
        card => card.dataset.color === color  // Find the card with the matching color
    );
    card.classList.add('flipped');  // Flip the card to show its color
    setTimeout(() => card.classList.remove('flipped'), flipSpeed / 2);  // Unflip the card after a delay
}

// Function to handle player's input
function handlePlayerInput(color) {
    playerSequence.push(color);  // Add the clicked color to the player's sequence
    const currentStep = playerSequence.length - 1;  // Get the current step in the sequence

    if (playerSequence[currentStep] !== sequence[currentStep]) {  // If the player's input is incorrect
        alert('Game Over! Your final score is: ' + score);  // Show a game over message
        startGame();  // Restart the game
        return;
    }

    if (playerSequence.length === sequence.length) {  // If the player has completed the sequence
        score++;  // Increase the score
        scoreDisplay.textContent = score;  // Update the score display

        if (score % 5 === 0) {  // If the score is a multiple of 5
            addMoreCards();  // Add more cards to the game
            resetFlipSpeedAndDifficulty();  // Make the game harder by reducing flip speed
        }

        setTimeout(nextRound, 1000);  // Start the next round after a short delay
    }
}

// Function to add more cards to the game when the score reaches 5
function addMoreCards() {
    level++;  // Increase the level
    const newColors = ['orange', 'purple', 'pink', 'brown'];  // New colors to add
    colors.push(...newColors);  // Add the new colors to the game
    createGameCards();  // Recreate the game board with the new colors
}

// Function to reset the flip speed and increase difficulty when the score reaches 5
function resetFlipSpeedAndDifficulty() {
    flipSpeed = Math.max(300, flipSpeed - 200);  // Reduce the flip speed, but ensure it's not too fast
    alert("Level 5 reached! The game is getting harder!");  // Show a message when the difficulty increases
}

// Show game content and hide splash screen when the player starts the game
splashStartButton.addEventListener('click', () => {
    splashScreen.style.display = 'none';  // Hide the splash screen
    header.style.display = 'block';  // Show the game header
    main.style.display = 'block';  // Show the game main content
    footer.style.display = 'block';  // Show the game footer
});

// Initialize the game when the "Start Game" button is clicked
startButton.addEventListener('click', startGame);

// Create the initial set of game cards and start the game
createGameCards();

