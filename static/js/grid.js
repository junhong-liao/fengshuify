/**
 * grid.js - Handles the grid rendering and cell interactions
 */

class Grid {
    constructor(config) {
        this.rows = config.grid.rows;
        this.cols = config.grid.cols;
        this.cellSize = config.grid.cellSize;
        this.walls = config.walls;
        this.cellsOccupied = []; // Tracks which cells are occupied
        this.gridElement = document.getElementById('grid-container');
    }

    /**
     * Initialize the grid with cells
     */
    initialize() {
        // Update CSS variables
        document.documentElement.style.setProperty('--grid-rows', this.rows);
        document.documentElement.style.setProperty('--grid-cols', this.cols);
        document.documentElement.style.setProperty('--cell-size', `${this.cellSize}px`);
        
        // Create grid cells
        this.gridElement.innerHTML = '';
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Check if this cell is a wall
                if (this.isWall(row, col)) {
                    cell.style.backgroundColor = '#888';
                    cell.classList.add('wall');
                }
                
                this.gridElement.appendChild(cell);
            }
        }
    }
    
    /**
     * Check if a cell is a wall
     */
    isWall(row, col) {
        return this.walls.some(wall => {
            return row >= wall.row && 
                   row < wall.row + wall.height && 
                   col >= wall.col && 
                   col < wall.col + wall.width;
        });
    }
    
    /**
     * Convert pixel coordinates to grid cell coordinates
     */
    pixelToCell(x, y) {
        const rect = this.gridElement.getBoundingClientRect();
        const relativeX = x - rect.left;
        const relativeY = y - rect.top;
        
        const col = Math.floor(relativeX / this.cellSize);
        const row = Math.floor(relativeY / this.cellSize);
        
        return { row, col };
    }
    
    /**
     * Check if placement is valid (not overlapping with walls or other objects)
     */
    isValidPlacement(row, col, width, height) {
        // Check bounds
        if (row < 0 || col < 0 || row + height > this.rows || col + width > this.cols) {
            return false;
        }
        
        // Check for walls or other objects
        for (let r = row; r < row + height; r++) {
            for (let c = col; c < col + width; c++) {
                if (this.isWall(r, c) || this.isCellOccupied(r, c)) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    /**
     * Check if a cell is already occupied by an object
     */
    isCellOccupied(row, col) {
        return this.cellsOccupied.some(cell => 
            cell.row === row && cell.col === col
        );
    }
    
    /**
     * Mark cells as occupied by an object
     */
    occupyCells(row, col, width, height, objectId) {
        for (let r = row; r < row + height; r++) {
            for (let c = col; c < col + width; c++) {
                this.cellsOccupied.push({ 
                    row: r, 
                    col: c, 
                    objectId: objectId 
                });
            }
        }
    }
    
    /**
     * Free cells occupied by an object
     */
    freeCells(objectId) {
        this.cellsOccupied = this.cellsOccupied.filter(
            cell => cell.objectId !== objectId
        );
    }
    
    /**
     * Highlight cells to show valid/invalid placement
     */
    highlightCells(row, col, width, height, isValid) {
        // Clear previous highlights
        this.clearHighlights();
        
        // Apply new highlights
        const highlightClass = isValid ? 'highlight-valid' : 'highlight-invalid';
        for (let r = row; r < row + height; r++) {
            for (let c = col; c < col + width; c++) {
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                    const cellElement = this.getCellElement(r, c);
                    if (cellElement) {
                        cellElement.classList.add(highlightClass);
                    }
                }
            }
        }
    }
    
    /**
     * Clear all cell highlights
     */
    clearHighlights() {
        const cells = this.gridElement.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            cell.classList.remove('highlight-valid', 'highlight-invalid');
        });
    }
    
    /**
     * Get cell element by row and column
     */
    getCellElement(row, col) {
        return this.gridElement.querySelector(
            `.grid-cell[data-row="${row}"][data-col="${col}"]`
        );
    }
    
    /**
     * Reset grid to initial state
     */
    reset() {
        this.cellsOccupied = [];
        this.clearHighlights();
        
        // Remove all placed items
        const placedItems = document.querySelectorAll('.placed-item');
        placedItems.forEach(item => item.remove());
    }
} 