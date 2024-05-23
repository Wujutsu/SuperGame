const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 40;

class Game {
    constructor(levels) {
        this.levels = levels;
        this.currentLevel = 0;
        this.loadLevel(this.currentLevel);

        window.addEventListener('resize', this.resizeCanvas.bind(this));
        this.resizeCanvas();

        requestAnimationFrame(this.update.bind(this));
    }

    /**
     * Loads the specified level.
     * @param {number} levelIndex - The index of the level to load.
     */
    loadLevel(levelIndex) {
        const levelData = this.levels[levelIndex];
        this.gameMap = new GameMap(levelData.map);
        this.player = new Player(levelData.startPosition.x, levelData.startPosition.y, this.gameMap);
    }

    /**
     * Advances to the next level if available.
     */
    nextLevel() {
        if (this.currentLevel < this.levels.length - 1) {
            this.currentLevel++;
            this.loadLevel(this.currentLevel);
        } else {
            console.log("You have completed all the levels!");
        }
    }

    /**
     * Resizes the canvas to fit the window.
     */
    resizeCanvas() {
        canvas.width = window.innerWidth & ~1;
        canvas.height = window.innerHeight & ~1;
    }

    /**
     * Positions the camera to follow the player.
     */
    positionCamera() {
        this.offsetX = this.player.x - canvas.width / 2 + this.player.size / 2;
        this.offsetY = this.player.y - canvas.height / 2 + this.player.size / 2;

        this.offsetX = Math.max(0, Math.min(this.offsetX, this.gameMap.width * tileSize - canvas.width));
        this.offsetY = Math.max(0, Math.min(this.offsetY, this.gameMap.height * tileSize - canvas.height));
    }

    /**
     * Updates the game state and redraws the game.
     */
    update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.positionCamera();
        this.gameMap.draw(ctx, this.offsetX, this.offsetY);
        this.player.updatePosition(); // Calls updatePosition without parameters
        this.player.draw(ctx, this.offsetX, this.offsetY);

        requestAnimationFrame(this.update.bind(this));
    }
}

// Start game
const levels = getLevels();
const game = new Game(levels);
