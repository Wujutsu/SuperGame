class GameMap {
    constructor(mapData) {
        this.mapData = mapData;
        this.width = mapData[0].length;
        this.height = mapData.length;
    }

    /**
     * Draws the game map on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
     * @param {number} offsetX - The X offset for drawing.
     * @param {number} offsetY - The Y offset for drawing.
     */
    draw(ctx, offsetX, offsetY) {
        for (let y = 0; y < this.mapData.length; y++) {
            for (let x = 0; x < this.mapData[y].length; x++) {
                switch (this.mapData[y][x]) {
                    case 'O':
                        ctx.fillStyle = 'green';
                        break;
                    case 'X':
                        ctx.fillStyle = 'brown';
                        break;
                    default:
                        break;
                }
                ctx.fillRect(x * tileSize - offsetX, y * tileSize - offsetY, tileSize, tileSize);
            }
        }
    }

    /**
     * Checks if the specified position is walkable.
     * @param {number} x - The X coordinate to check.
     * @param {number} y - The Y coordinate to check.
     * @param {number} playerSize - The size of the player.
     * @returns {boolean} True if the position is walkable, false otherwise.
     */
    isWalkable(x, y, playerSize) {
        const pointsToCheck = [
            [x, y], // Top-left corner
            [x + playerSize - 1, y], // Top-right corner
            [x, y + playerSize - 1], // Bottom-left corner
            [x + playerSize - 1, y + playerSize - 1], // Bottom-right corner
            [x + playerSize / 2, y], // Top-middle
            [x + playerSize / 2, y + playerSize - 1], // Bottom-middle
        ];

        for (const [checkX, checkY] of pointsToCheck) {
            const tileX = Math.floor(checkX / tileSize);
            const tileY = Math.floor(checkY / tileSize);

            if (tileY < 0 || tileY >= this.mapData.length || tileX < 0 || tileX >= this.mapData[0].length || this.mapData[tileY][tileX] === 'X') {
                return false;
            }
        }

        return true;
    }
}
