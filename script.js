document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    // Game variables
    const gridSize = 20;
    const gridWidth = canvas.width / gridSize;
    const gridHeight = canvas.height / gridSize;
    let snake = [
        {x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2)}
    ];
    let food = generateFood();
    let direction = 'right';
    let nextDirection = direction;
    let score = 0;
    let gameSpeed = 150; // milliseconds
    let gameInterval;
    let gameRunning = false;
    let gameOver = false;
    
    // DOM elements
    const scoreElement = document.getElementById('score');
    const startButton = document.getElementById('start-btn');
    const restartButton = document.getElementById('restart-btn');
    
    // Event listeners
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    document.addEventListener('keydown', handleKeyPress);
    
    // Initial render
    drawGame();
    
    // Functions
    function startGame() {
        if (!gameRunning) {
            gameRunning = true;
            gameOver = false;
            gameInterval = setInterval(gameLoop, gameSpeed);
            startButton.disabled = true;
        }
    }
    
    function restartGame() {
        clearInterval(gameInterval);
        snake = [{x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2)}];
        direction = 'right';
        nextDirection = direction;
        score = 0;
        scoreElement.textContent = score;
        food = generateFood();
        gameRunning = false;
        gameOver = false;
        startButton.disabled = false;
        drawGame();
    }
    
    function gameLoop() {
        if (gameOver) {
            clearInterval(gameInterval);
            gameRunning = false;
            startButton.disabled = false;
            return;
        }
        
        // Update direction
        direction = nextDirection;
        
        // Move snake
        const head = {...snake[0]};
        switch (direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }
        
        // Check for collisions
        if (checkCollision(head)) {
            gameOver = true;
            drawGame(); // Draw one last time to show collision
            return;
        }
        
        // Add new head
        snake.unshift(head);
        
        // Check if food eaten
        if (head.x === food.x && head.y === food.y) {
            // Increase score
            score += 10;
            scoreElement.textContent = score;
            
            // Generate new food
            food = generateFood();
            
            // Increase speed slightly every 50 points
            if (score % 50 === 0 && gameSpeed > 60) {
                clearInterval(gameInterval);
                gameSpeed -= 10;
                gameInterval = setInterval(gameLoop, gameSpeed);
            }
        } else {
            // Remove tail if no food eaten
            snake.pop();
        }
        
        // Draw updated game
        drawGame();
    }
    
    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#232741';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        snake.forEach((segment, index) => {
            // Head is a different color
            if (index === 0) {
                ctx.fillStyle = '#4ecca3';
            } else {
                // Create gradient effect for body
                const colorValue = 255 - (index * 5);
                ctx.fillStyle = `rgb(78, ${Math.max(colorValue, 150)}, 163)`;
            }
            
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
            
            // Add eyes to head
            if (index === 0) {
                ctx.fillStyle = '#232741';
                let eyeX1, eyeX2, eyeY1, eyeY2;
                
                switch(direction) {
                    case 'right':
                        eyeX1 = segment.x * gridSize + gridSize - 5;
                        eyeY1 = segment.y * gridSize + 5;
                        eyeX2 = segment.x * gridSize + gridSize - 5;
                        eyeY2 = segment.y * gridSize + gridSize - 5;
                        break;
                    case 'left':
                        eyeX1 = segment.x * gridSize + 5;
                        eyeY1 = segment.y * gridSize + 5;
                        eyeX2 = segment.x * gridSize + 5;
                        eyeY2 = segment.y * gridSize + gridSize - 5;
                        break;
                    case 'up':
                        eyeX1 = segment.x * gridSize + 5;
                        eyeY1 = segment.y * gridSize + 5;
                        eyeX2 = segment.x * gridSize + gridSize - 5;
                        eyeY2 = segment.y * gridSize + 5;
                        break;
                    case 'down':
                        eyeX1 = segment.x * gridSize + 5;
                        eyeY1 = segment.y * gridSize + gridSize - 5;
                        eyeX2 = segment.x * gridSize + gridSize - 5;
                        eyeY2 = segment.y * gridSize + gridSize - 5;
                        break;
                }
                
                ctx.beginPath();
                ctx.arc(eyeX1, eyeY1, 2, 0, Math.PI * 2);
                ctx.arc(eyeX2, eyeY2, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Add border to each segment
            ctx.strokeStyle = '#232741';
            ctx.lineWidth = 1;
            ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
        
        // Draw food
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        const centerX = food.x * gridSize + gridSize / 2;
        const centerY = food.y * gridSize + gridSize / 2;
        ctx.arc(centerX, centerY, gridSize / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw grid (optional, for debugging)
        // drawGrid();
        
        // Draw game over message
        if (gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = '30px Arial';
            ctx.fillStyle = '#ff6b6b';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 15);
            
            ctx.font = '20px Arial';
            ctx.fillStyle = '#fff';
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
        }
    }
    
    function drawGrid() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;
        
        for (let x = 0; x <= canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y <= canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    
    function generateFood() {
        // Generate random position
        let newFood;
        let foodOnSnake;
        
        do {
            foodOnSnake = false;
            newFood = {
                x: Math.floor(Math.random() * gridWidth),
                y: Math.floor(Math.random() * gridHeight)
            };
            
            // Check if food is on snake
            for (let segment of snake) {
                if (segment.x === newFood.x && segment.y === newFood.y) {
                    foodOnSnake = true;
                    break;
                }
            }
        } while (foodOnSnake);
        
        return newFood;
    }
    
    function checkCollision(head) {
        // Check wall collision
        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
            return true;
        }
        
        // Check self collision (skip the last segment as it will be removed)
        for (let i = 0; i < snake.length - 1; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    function handleKeyPress(event) {
        // Prevent arrow keys from scrolling the page
        if ([37, 38, 39, 40].includes(event.keyCode)) {
            event.preventDefault();
        }
        
        // Only change direction if game is running
        if (!gameRunning) return;
        
        // Prevent 180-degree turns
        switch (event.keyCode) {
            case 38: // Up arrow
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 40: // Down arrow
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 37: // Left arrow
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 39: // Right arrow
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    }
});