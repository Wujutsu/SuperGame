class Player {
    constructor(startX, startY, gameMap) {
        this.x = startX * tileSize;
        this.y = startY * tileSize;
        this.color = 'red';
        this.speed = 4;
        this.size = 40;
        this.yVelocity = 0; // Vertical velocity for jumping
        this.gravity = 0.5; // Gravity effect
        this.jumpStrength = -10; // Strength of the jump
        this.directions = { down: false, left: false, right: false, isJumping: false };
        this.gameMap = gameMap;

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    /**
     * Handles the key down event to set direction flags and initiate jump.
     * @param {KeyboardEvent} event - The key down event.
     */
    handleKeyDown(event) {
        if (event.key === 'ArrowUp' || event.key === ' ' || event.key === 'w' || event.key === 'W') {
            this.jump(); // Call jump on up arrow or space key press
        }
        if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') this.directions.down = true;
        if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') this.directions.left = true;
        if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') this.directions.right = true;
    }

    /**
     * Handles the key up event to unset direction flags.
     * @param {KeyboardEvent} event - The key up event.
     */
    handleKeyUp(event) {
        if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') this.directions.down = false;
        if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') this.directions.left = false;
        if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') this.directions.right = false;
    }

    /**
     * Checks if the player is on the ground.
     * @returns {boolean} True if the player is on the ground, false otherwise.
     */
    isOnGround() {
        const groundY = Math.floor((this.y + this.size) / tileSize);
        const tileX = Math.floor(this.x / tileSize);
        const tileXRight = Math.floor((this.x + this.size - 1) / tileSize);
        return (this.gameMap.mapData[groundY] && this.gameMap.mapData[groundY][tileX] === 'X') ||
               (this.gameMap.mapData[groundY] && this.gameMap.mapData[groundY][tileXRight] === 'X');
    }

    /**
     * Initiates a jump if the player is on the ground.
     */
    jump() {
        if (!this.directions.isJumping && this.isOnGround()) {
            this.yVelocity = this.jumpStrength;
            this.directions.isJumping = true;
        }
    }

    /**
     * Draws the player on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
     * @param {number} offsetX - The X offset for drawing.
     * @param {number} offsetY - The Y offset for drawing.
     */
    draw(ctx, offsetX, offsetY) {
        ctx.beginPath();
        ctx.rect(this.x - offsetX, this.y - offsetY, this.size, this.size);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    /**
     * Updates the player's position based on current direction and velocity.
     */
    updatePosition() {
        let newX = this.x;
        let newY = this.y;

        // Update horizontal position
        if (this.directions.left) newX -= this.speed;
        if (this.directions.right) newX += this.speed;

        // Check horizontal collisions
        if (this.gameMap.isWalkable(newX, this.y, this.size)) {
            this.x = newX;
        }

        // Update vertical velocity for gravity
        this.yVelocity += this.gravity;
        newY += this.yVelocity;

        // Check vertical collisions
        if (this.gameMap.isWalkable(this.x, newY, this.size)) {
            this.y = newY;
        } else {
            // Stop upward movement if hitting the ceiling
            if (this.yVelocity < 0) {
                this.yVelocity = 0;
            }

            // Stop downward movement if hitting the ground
            if (this.yVelocity >= 0) {
                this.yVelocity = 0;
                this.directions.isJumping = false;
            }
        }
    }
}
