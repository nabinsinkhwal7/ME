// Wait for DOM to load before initializing particles
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.querySelector('.particles');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    console.log('Canvas initialized:', canvas.width, 'x', canvas.height);

    const particles = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1; // Make particles slightly bigger
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.opacity = 0;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity += 0.01;
            if (this.opacity > 1) this.opacity = 1;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.opacity = 0;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`; // Make more visible
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add a subtle glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow
        }
    }

    function init() {
        particles.length = 0; // Clear existing particles
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
        console.log('Particles initialized:', particles.length);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }

    // Initialize and start animation
    init();
    animate();
    
    // Resize handler for canvas
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log('Canvas resized:', canvas.width, 'x', canvas.height);
    });
});

// Game Management
function openGame(gameType) {
    const modal = document.getElementById('gameModal');
    const container = document.getElementById('gameContainer');
    
    modal.style.display = 'block';
    
    switch(gameType) {
        case 'tictactoe':
            container.innerHTML = createTicTacToe();
            initTicTacToe();
            break;
        case 'memory':
            container.innerHTML = createMemoryGame();
            initMemoryGame();
            break;
    }
}

function closeGame() {
    document.getElementById('gameModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('gameModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Smooth scroll to About section
function scrollToAbout() {
    const aboutSection = document.getElementById('about-section');
    aboutSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Tic-Tac-Toe Game
function createTicTacToe() {
    return `
        <div style="text-align: center; color: white;">
            <h2 style="color: #00bcd4; margin-bottom: 20px;">🎮 Tic-Tac-Toe</h2>
            
            <!-- Game Mode Selection -->
            <div id="gameModeSelection" style="margin-bottom: 30px;">
                <p style="margin-bottom: 20px; font-size: 18px;">Choose your game mode:</p>
                <button onclick="startTicTacToe('friend')" style="padding: 12px 24px; background: #00bcd4; color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 16px; margin: 10px;">👥 Play with Friend</button>
                <button onclick="startTicTacToe('computer')" style="padding: 12px 24px; background: #00bcd4; color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 16px; margin: 10px;">🎯 Play against Me</button>
            </div>
            
            <!-- Game Board (initially hidden) -->
            <div id="ticTacToeGame" style="display: none;">
                <div id="gameMode" style="margin-bottom: 15px; font-size: 16px; color: #888;"></div>
                <div id="ticTacToeBoard" style="display: grid; grid-template-columns: repeat(3, 80px); gap: 5px; justify-content: center; margin: 20px 0;">
                    ${Array(9).fill().map((_, i) => `<button class="tic-cell" onclick="makeMove(${i})" style="width: 80px; height: 80px; font-size: 24px; background: rgba(255,255,255,0.1); border: 2px solid #00bcd4; color: white; cursor: pointer; border-radius: 10px; transition: all 0.3s;">${''}</button>`).join('')}
                </div>
                <div id="ticStatus" style="font-size: 18px; margin: 20px 0; color: #00bcd4;">Your turn! Click a cell to play.</div>
                <button onclick="resetTicTacToe()" style="padding: 10px 20px; background: #00bcd4; color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 16px; margin: 5px;">New Game</button>
                <button onclick="backToModeSelection()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 16px; margin: 5px;">Change Mode</button>
            </div>
        </div>
    `;
}

let ticBoard = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'friend'; // 'friend' or 'computer'
let isPlayerTurn = true;

function initTicTacToe() {
    // Show mode selection, hide game board
    document.getElementById('gameModeSelection').style.display = 'block';
    document.getElementById('ticTacToeGame').style.display = 'none';
}

function startTicTacToe(mode) {
    gameMode = mode;
    ticBoard = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    isPlayerTurn = true;
    
    // Hide mode selection, show game board
    document.getElementById('gameModeSelection').style.display = 'none';
    document.getElementById('ticTacToeGame').style.display = 'block';
    
    // Update game mode display and status
    const modeText = mode === 'friend' ? '👥 Playing with Friend' : '🎯 Playing against Me';
    document.getElementById('gameMode').textContent = modeText;
    
    const statusText = mode === 'friend' ? 'Player X\'s turn' : 'Your turn (X)';
    document.getElementById('ticStatus').textContent = statusText;
    
    // Reset board display
    document.querySelectorAll('.tic-cell').forEach(cell => {
        cell.textContent = '';
        cell.style.background = 'rgba(255,255,255,0.1)';
    });
}

function backToModeSelection() {
    document.getElementById('gameModeSelection').style.display = 'block';
    document.getElementById('ticTacToeGame').style.display = 'none';
}

function makeMove(index) {
    if (ticBoard[index] !== '' || !gameActive) return;
    
    // In computer mode, only allow moves when it's player's turn
    if (gameMode === 'computer' && !isPlayerTurn) return;
    
    ticBoard[index] = currentPlayer;
    document.getElementsByClassName('tic-cell')[index].textContent = currentPlayer;
    document.getElementsByClassName('tic-cell')[index].style.background = 'rgba(0, 188, 212, 0.3)';
    
    if (checkWinner()) {
        const winnerText = gameMode === 'friend' ? `Player ${currentPlayer} wins! 🎉` : 
                          (currentPlayer === 'X' ? 'You win! 🎉' : 'I win! 😊');
        document.getElementById('ticStatus').textContent = winnerText;
        gameActive = false;
        return;
    }
    
    if (ticBoard.every(cell => cell !== '')) {
        document.getElementById('ticStatus').textContent = "It's a tie! 🤝";
        gameActive = false;
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    if (gameMode === 'friend') {
        document.getElementById('ticStatus').textContent = `Player ${currentPlayer}'s turn`;
    } else {
        // Computer mode
        if (currentPlayer === 'O') {
            isPlayerTurn = false;
            document.getElementById('ticStatus').textContent = 'I\'m thinking...';
            setTimeout(makeComputerMove, 800); // Add delay for better UX
        } else {
            isPlayerTurn = true;
            document.getElementById('ticStatus').textContent = 'Your turn (X)';
        }
    }
}

function makeComputerMove() {
    if (!gameActive) return;
    
    const bestMove = getBestMove();
    if (bestMove !== -1) {
        ticBoard[bestMove] = 'O';
        document.getElementsByClassName('tic-cell')[bestMove].textContent = 'O';
        document.getElementsByClassName('tic-cell')[bestMove].style.background = 'rgba(255, 100, 100, 0.3)';
        
        if (checkWinner()) {
            document.getElementById('ticStatus').textContent = 'I win! 😊';
            gameActive = false;
            return;
        }
        
        if (ticBoard.every(cell => cell !== '')) {
            document.getElementById('ticStatus').textContent = "It's a tie! 🤝";
            gameActive = false;
            return;
        }
        
        currentPlayer = 'X';
        isPlayerTurn = true;
        document.getElementById('ticStatus').textContent = 'Your turn (X)';
    }
}

function getBestMove() {
    // Simple AI strategy:
    // 1. Try to win
    // 2. Try to block player from winning
    // 3. Take center if available
    // 4. Take corners
    // 5. Take any remaining spot
    
    // Check if computer can win
    for (let i = 0; i < 9; i++) {
        if (ticBoard[i] === '') {
            ticBoard[i] = 'O';
            if (checkWinner()) {
                ticBoard[i] = '';
                return i;
            }
            ticBoard[i] = '';
        }
    }
    
    // Check if need to block player
    for (let i = 0; i < 9; i++) {
        if (ticBoard[i] === '') {
            ticBoard[i] = 'X';
            if (checkWinner()) {
                ticBoard[i] = '';
                return i;
            }
            ticBoard[i] = '';
        }
    }
    
    // Take center if available
    if (ticBoard[4] === '') return 4;
    
    // Take corners
    const corners = [0, 2, 6, 8];
    for (let corner of corners) {
        if (ticBoard[corner] === '') return corner;
    }
    
    // Take any remaining spot
    for (let i = 0; i < 9; i++) {
        if (ticBoard[i] === '') return i;
    }
    
    return -1;
}

function checkWinner() {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8], // rows
        [0,3,6], [1,4,7], [2,5,8], // columns
        [0,4,8], [2,4,6] // diagonals
    ];
    
    return winPatterns.some(pattern => {
        const [a,b,c] = pattern;
        return ticBoard[a] && ticBoard[a] === ticBoard[b] && ticBoard[a] === ticBoard[c];
    });
}

function resetTicTacToe() {
    ticBoard = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    isPlayerTurn = true;
    
    document.querySelectorAll('.tic-cell').forEach(cell => {
        cell.textContent = '';
        cell.style.background = 'rgba(255,255,255,0.1)';
    });
    
    const statusText = gameMode === 'friend' ? 'Player X\'s turn' : 'Your turn (X)';
    document.getElementById('ticStatus').textContent = statusText;
}

// Memory Game
function createMemoryGame() {
    return `
        <div style="text-align: center; color: white;">
            <h2 style="color: #00bcd4; margin-bottom: 20px;">🧠 Memory Game</h2>
            
            <!-- Difficulty Selection -->
            <div id="memoryDifficultySelection" style="margin-bottom: 30px;">
                <p style="margin-bottom: 20px; font-size: 18px;">Choose difficulty level:</p>
                <button onclick="startMemoryGame('easy')" style="padding: 12px 20px; background: #00bcd4; color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 16px; margin: 8px;">🟢 Easy (3x2)</button>
                <button onclick="startMemoryGame('medium')" style="padding: 12px 20px; background: #00bcd4; color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 16px; margin: 8px;">🟡 Medium (4x3)</button>
                <button onclick="startMemoryGame('hard')" style="padding: 12px 20px; background: #00bcd4; color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 16px; margin: 8px;">🔴 Hard (4x4)</button>
            </div>
            
            <!-- Game Board (initially hidden) -->
            <div id="memoryGameBoard" style="display: none;">
                <div id="memoryDifficultyDisplay" style="margin-bottom: 15px; font-size: 16px; color: #888;"></div>
                <div style="margin-bottom: 20px;">
                    <span style="margin-right: 20px;">Score: <span id="memoryScore">0</span></span>
                    <span style="margin-right: 20px;">Moves: <span id="memoryMoves">0</span></span>
                    <span>Time: <span id="memoryTime">0</span>s</span>
                </div>
                <div id="memoryBoard" style="display: grid; gap: 8px; justify-content: center; margin: 20px 0;">
                    <!-- Cards will be generated here -->
                </div>
                <div id="memoryStatus" style="font-size: 16px; margin: 20px 0; color: #00bcd4;">Find all matching pairs!</div>
                <button onclick="resetMemoryGame()" style="padding: 10px 20px; background: #00bcd4; color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 16px; margin: 5px;">New Game</button>
                <button onclick="backToMemoryDifficultySelection()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 16px; margin: 5px;">Change Difficulty</button>
            </div>
        </div>
    `;
}

let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let memoryDifficulty = 'medium';
let gameTimer = 0;
let timerInterval = null;
let totalPairs = 0;

const difficultySettings = {
    easy: { 
        rows: 2, cols: 3, pairs: 3, 
        symbols: ['🎮', '🎯', '🎲'],
        cardSize: '70px', name: '🟢 Easy (3x2)'
    },
    medium: { 
        rows: 3, cols: 4, pairs: 6, 
        symbols: ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭'],
        cardSize: '60px', name: '🟡 Medium (4x3)'
    },
    hard: { 
        rows: 4, cols: 4, pairs: 8, 
        symbols: ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'],
        cardSize: '55px', name: '🔴 Hard (4x4)'
    }
};

function initMemoryGame() {
    // Show difficulty selection, hide game board
    document.getElementById('memoryDifficultySelection').style.display = 'block';
    document.getElementById('memoryGameBoard').style.display = 'none';
}

function startMemoryGame(difficulty) {
    memoryDifficulty = difficulty;
    const settings = difficultySettings[difficulty];
    totalPairs = settings.pairs;
    
    // Hide difficulty selection, show game board
    document.getElementById('memoryDifficultySelection').style.display = 'none';
    document.getElementById('memoryGameBoard').style.display = 'block';
    
    // Update difficulty display
    document.getElementById('memoryDifficultyDisplay').textContent = settings.name;
    
    // Create shuffled cards
    memoryCards = [...settings.symbols, ...settings.symbols].sort(() => Math.random() - 0.5);
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameTimer = 0;
    
    // Update displays
    document.getElementById('memoryScore').textContent = '0';
    document.getElementById('memoryMoves').textContent = '0';
    document.getElementById('memoryTime').textContent = '0';
    document.getElementById('memoryStatus').textContent = 'Find all matching pairs!';
    
    // Create game board
    createMemoryBoard(settings);
    
    // Start timer
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        gameTimer++;
        document.getElementById('memoryTime').textContent = gameTimer;
    }, 1000);
}

function createMemoryBoard(settings) {
    const board = document.getElementById('memoryBoard');
    board.style.gridTemplateColumns = `repeat(${settings.cols}, ${settings.cardSize})`;
    board.innerHTML = '';
    
    for (let i = 0; i < memoryCards.length; i++) {
        const card = document.createElement('button');
        card.className = 'memory-card';
        card.onclick = () => flipCard(i);
        card.style.cssText = `
            width: ${settings.cardSize}; 
            height: ${settings.cardSize}; 
            font-size: ${parseInt(settings.cardSize) * 0.4}px; 
            background: rgba(255,255,255,0.1); 
            border: 2px solid #00bcd4; 
            color: white; 
            cursor: pointer; 
            border-radius: 10px; 
            transition: all 0.3s;
        `;
        card.textContent = '?';
        board.appendChild(card);
    }
}

function backToMemoryDifficultySelection() {
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById('memoryDifficultySelection').style.display = 'block';
    document.getElementById('memoryGameBoard').style.display = 'none';
}

function flipCard(index) {
    if (flippedCards.length >= 2 || flippedCards.includes(index)) return;
    
    const card = document.getElementsByClassName('memory-card')[index];
    card.textContent = memoryCards[index];
    card.style.background = 'rgba(0, 188, 212, 0.3)';
    flippedCards.push(index);
    
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('memoryMoves').textContent = moves;
        
        setTimeout(() => {
            if (memoryCards[flippedCards[0]] === memoryCards[flippedCards[1]]) {
                // Match found
                matchedPairs++;
                document.getElementById('memoryScore').textContent = matchedPairs;
                flippedCards.forEach(i => {
                    document.getElementsByClassName('memory-card')[i].style.background = 'rgba(0, 188, 212, 0.5)';
                });
                
                if (matchedPairs === totalPairs) {
                    if (timerInterval) clearInterval(timerInterval);
                    const difficultyBonus = memoryDifficulty === 'easy' ? 1 : memoryDifficulty === 'medium' ? 2 : 3;
                    const timeBonus = Math.max(0, 100 - gameTimer);
                    const finalScore = (matchedPairs * 10 * difficultyBonus) + timeBonus;
                    document.getElementById('memoryStatus').innerHTML = `🎉 You won!<br>Time: ${gameTimer}s | Moves: ${moves} | Score: ${finalScore}`;
                }
            } else {
                // No match
                flippedCards.forEach(i => {
                    const card = document.getElementsByClassName('memory-card')[i];
                    card.textContent = '?';
                    card.style.background = 'rgba(255,255,255,0.1)';
                });
            }
            flippedCards = [];
        }, 1000);
    }
}

function resetMemoryGame() {
    if (timerInterval) clearInterval(timerInterval);
    startMemoryGame(memoryDifficulty); // Restart with same difficulty
}
