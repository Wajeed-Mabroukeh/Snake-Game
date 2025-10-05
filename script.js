document.addEventListener('DOMContentLoaded', () => {
    // Game canvas setup
    const canvas = document.getElementById('game-board');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const scoreElement = document.getElementById('score');

    // Game settings
    const gridSize = 20;
    const tileCount = 20;
    canvas.width = tileCount * gridSize;
    canvas.height = tileCount * gridSize;
    
    let speed = 7;
    let score = 0;
    let gameRunning = false;
    let gameOver = false;

    // Snake initial state
    let snake = [
        { x: 10, y: 10 }
    ];
    let velocityX = 0;
    let velocityY = 0;
    
    // Food initial position
    let foodX = 5;
    let foodY = 5;

    // Game loop
    let gameInterval;

    // Event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    document.addEventListener('keydown', changeDirection);

    // Initialize game
    drawGame();
    
    // Start the game automatically
    setTimeout(() => {
        startGame();
    }, 500);

    // Start game function
    function startGame() {
        if (!gameRunning && !gameOver) {
            gameRunning = true;
            startBtn.textContent = 'Pause';
            gameInterval = setInterval(drawGame, 1000 / speed);
        } else if (gameRunning) {
            gameRunning = false;
            startBtn.textContent = 'Resume';
            clearInterval(gameInterval);
        }
    }

    // Reset game function
    function resetGame() {
        clearInterval(gameInterval);
        snake = [{ x: 10, y: 10 }];
        velocityX = 0;
        velocityY = 0;
        foodX = Math.floor(Math.random() * tileCount);
        foodY = Math.floor(Math.random() * tileCount);
        score = 0;
        scoreElement.textContent = score;
        gameRunning = false;
        gameOver = false;
        startBtn.textContent = 'Start Game';
        drawGame();
    }

    // Change direction based on key press
    function changeDirection(event) {
        const keyPressed = event.keyCode;
        const LEFT = 37;
        const UP = 38;
        const RIGHT = 39;
        const DOWN = 40;
        
        // W, A, S, D keys
        const W = 87;
        const A = 65;
        const S = 83;
        const D = 68;

        const goingUp = velocityY === -1;
        const goingDown = velocityY === 1;
        const goingRight = velocityX === 1;
        const goingLeft = velocityX === -1;

        // Prevent reversing direction
        if ((keyPressed === LEFT || keyPressed === A) && !goingRight) {
            velocityX = -1;
            velocityY = 0;
        } else if ((keyPressed === UP || keyPressed === W) && !goingDown) {
            velocityX = 0;
            velocityY = -1;
        } else if ((keyPressed === RIGHT || keyPressed === D) && !goingLeft) {
            velocityX = 1;
            velocityY = 0;
        } else if ((keyPressed === DOWN || keyPressed === S) && !goingUp) {
            velocityX = 0;
            velocityY = 1;
        }
    }

    // Check for collisions
    function checkCollision() {
        // Wall collision
        const headX = snake[0].x;
        const headY = snake[0].y;
        
        if (headX < 0 || headX >= tileCount || headY < 0 || headY >= tileCount) {
            return true;
        }
        
        // Self collision (skip the head)
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === headX && snake[i].y === headY) {
                return true;
            }
        }
        
        return false;
    }

    // Main game drawing function
    function drawGame() {
        if (gameRunning) {
            // Move snake
            const headX = snake[0].x + velocityX;
            const headY = snake[0].y + velocityY;
            
            // Check for collision
            if (checkCollision()) {
                gameOver = true;
                gameRunning = false;
                clearInterval(gameInterval);
                startBtn.textContent = 'Game Over';
                startBtn.disabled = true;
                return;
            }
            
            // Add new head
            snake.unshift({ x: headX, y: headY });
            
            // Check if snake ate food
            if (snake[0].x === foodX && snake[0].y === foodY) {
                // Increase score
                score += 10;
                scoreElement.textContent = score;
                
                // Generate new food
                generateFood();
                
                // Increase speed slightly every 5 food items
                if (score % 50 === 0) {
                    speed += 1;
                    clearInterval(gameInterval);
                    gameInterval = setInterval(drawGame, 1000 / speed);
                }
            } else {
                // Remove tail if no food was eaten
                snake.pop();
            }
        }
        
        // Clear canvas
        ctx.fillStyle = '#e8e8e8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        ctx.fillStyle = '#4CAF50';
        for (let i = 0; i < snake.length; i++) {
            ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
            
            // Draw snake head in a different color
            if (i === 0) {
                ctx.fillStyle = '#388E3C';
                ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
                ctx.fillStyle = '#4CAF50';
            }
        }
        
        // Draw food
        ctx.fillStyle = '#F44336';
        ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 2, gridSize - 2);
        
        // Draw grid (optional)
        drawGrid();
        
        // Game over text
        if (gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = '30px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
            
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
            ctx.fillText('Press Reset to play again', canvas.width / 2, canvas.height / 2 + 80);
        }
    }

    // Generate food at random position
    function generateFood() {
        let newFoodPosition = false;
        
        while (!newFoodPosition) {
            foodX = Math.floor(Math.random() * tileCount);
            foodY = Math.floor(Math.random() * tileCount);
            
            // Check if food is not on snake
            newFoodPosition = true;
            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x === foodX && snake[i].y === foodY) {
                    newFoodPosition = false;
                    break;
                }
            }
        }
    }

    // Draw grid lines
    function drawGrid() {
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i <= tileCount; i++) {
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
            
            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }
    }

    // Initialize food position
    generateFood();
});