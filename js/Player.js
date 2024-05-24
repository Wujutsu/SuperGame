class Player {
    constructor(startX, startY, gameMap) {
        this.x = startX * tileSize;
        this.y = startY * tileSize;
        this.color = 'red';
        this.speed = 4;
        this.size = 28;
        this.yVelocity = 0; // Vertical velocity for jumping
        this.gravity = 0.5; // Gravity effect
        this.jumpStrength = -10; // Strength of the jump
        this.directions = { down: false, left: false, right: false, isJumping: false };
        this.gameMap = gameMap;

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    handleKeyDown(event) {
        if (event.key === 'ArrowUp' || event.key === ' ' || event.key === 'w' || event.key === 'W') {
            this.jump();
        }
        if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') this.directions.down = true;
        if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') this.directions.left = true;
        if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') this.directions.right = true;
    }

    handleKeyUp(event) {
        if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') this.directions.down = false;
        if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') this.directions.left = false;
        if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') this.directions.right = false;
    }

    isOnGround() {
        const groundY = Math.floor((this.y + this.size) / tileSize);
        const tileX = Math.floor(this.x / tileSize);
        const tileXRight = Math.floor((this.x + this.size - 1) / tileSize);
        return (this.gameMap.mapData[groundY] && this.gameMap.mapData[groundY][tileX] === 'X') ||
            (this.gameMap.mapData[groundY] && this.gameMap.mapData[groundY][tileXRight] === 'X');
    }

    isOnWall() {
        const leftX = Math.floor((this.x - 1) / tileSize);
        const rightX = Math.floor((this.x + this.size) / tileSize);
        const topY = Math.floor(this.y / tileSize);
        const bottomY = Math.floor((this.y + this.size - 1) / tileSize);

        const leftWall = (this.gameMap.mapData[topY][leftX] !== 'O' || this.gameMap.mapData[bottomY][leftX] !== 'O');
        const rightWall = (this.gameMap.mapData[topY][rightX] !== 'O' || this.gameMap.mapData[bottomY][rightX] !== 'O');

        return leftWall || rightWall;
    }

    jump() {
        if (!this.directions.isJumping && this.isOnGround()) {
            this.yVelocity = this.jumpStrength;
            this.directions.isJumping = true;
        }
    
        if (this.directions.isJumping && !this.isOnGround() && this.isOnWall() && (this.directions.left || this.directions.right)) {
            if (this.directions.right) {
                this.directions.isJumping = true;
                this.directions.right = false;
                let newX = this.x - this.speed * 6;

                // Vérifie si la nouvelle position est walkable
                while (!this.gameMap.isWalkable(newX, this.y, this.size)) {
                    newX += 1; // Ajustez la position progressivement jusqu'à ce qu'elle soit walkable
                }
                this.yVelocity = this.jumpStrength;
                this.x = newX;
            }
            if (this.directions.left) {
                this.directions.isJumping = true;
                this.directions.left = false;
                let newX = this.x + this.speed * 6;

                // Vérifie si la nouvelle position est walkable
                while (!this.gameMap.isWalkable(newX, this.y, this.size)) {
                    newX -= 1; // Ajustez la position progressivement jusqu'à ce qu'elle soit walkable
                }
                this.yVelocity = this.jumpStrength;
                this.x = newX;
            }
        }
    }
    

    draw(ctx, offsetX, offsetY) {
        ctx.beginPath();
        ctx.rect(this.x - offsetX, this.y - offsetY, this.size, this.size);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    updatePosition() {
        let newX = this.x;
        let newY = this.y;

        if (this.directions.left) newX -= this.speed;
        if (this.directions.right) newX += this.speed;

        if (this.gameMap.isWalkable(newX, this.y, this.size)) {
            this.x = newX;
        }

        this.yVelocity += this.gravity;
        newY += this.yVelocity;

        if (this.gameMap.isWalkable(this.x, newY, this.size)) {
            this.y = newY;
        } else {
            if (this.yVelocity < 0) {
                this.yVelocity = 0;
            }

            if (this.yVelocity >= 0) {
                this.yVelocity = 0;
                this.directions.isJumping = false;
            }
        }

        if (this.isOnWall()) {
            console.log("Player is touching a wall!");
        }
    }
}
