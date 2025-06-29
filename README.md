# Snake Game

A classic Snake Game built with HTML5 Canvas and JavaScript. Control a snake, eat food to grow longer, and avoid collisions with walls and yourself.


## Features

- Smooth snake movement with directional control
- Increasing difficulty as your score grows
- Visual elements including:
  - Color-gradient snake body
  - Snake eyes that follow direction
  - Appealing food design
  - Game over screen with final score
- Responsive design that works on various screen sizes
- Simple and intuitive controls

## How to Play

1. Click the "Start Game" button to begin
2. Use the arrow keys to control the snake's direction:
   - ↑ (Up Arrow): Move up
   - ↓ (Down Arrow): Move down
   - ← (Left Arrow): Move left
   - → (Right Arrow): Move right
3. Eat the red food to grow longer and earn 10 points
4. Avoid hitting the walls or colliding with your own body
5. The game speeds up slightly every 50 points
6. When the game ends, click "Restart" to play again

## Technical Implementation

The game is built using:
- HTML5 Canvas for rendering
- Vanilla JavaScript for game logic
- CSS for styling and responsive design

### Game Components

- **Snake**: Represented as an array of grid positions, with the head at index 0
- **Food**: Randomly generated on the grid, avoiding snake positions
- **Collision Detection**: Checks for wall collisions and self-collisions
- **Scoring System**: 10 points per food item eaten
- **Difficulty Progression**: Game speed increases every 50 points

## Installation

No installation required! Simply download the files and open `index.html` in your web browser.
