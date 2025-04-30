/**
 * dragDrop.js - Handles drag and drop interactions for room objects
 */

class DragDropManager {
    constructor(grid, itemManager) {
        this.grid = grid;
        this.itemManager = itemManager;
        this.currentDragData = null;
        this.gridElement = document.getElementById('grid-container');
    }
    
    /**
     * Initialize drag drop events on the grid
     */
    initialize() {
        // Setup grid drop zone
        this.setupGridDropZone();
    }
    
    /**
     * Setup the grid container as a drop zone
     */
    setupGridDropZone() {
        // Prevent default to allow drop
        this.gridElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            
            if (!this.currentDragData) {
                const dragDataString = e.dataTransfer.getData('text/plain');
                if (dragDataString) {
                    try {
                        this.currentDragData = JSON.parse(dragDataString);
                    } catch (err) {
                        console.error('Error parsing drag data:', err);
                    }
                }
            }
            
            // Calculate the grid cell position
            const { row, col } = this.grid.pixelToCell(e.clientX, e.clientY);
            
            // Get dimensions from the drag data
            if (this.currentDragData) {
                const width = parseInt(this.currentDragData.width);
                const height = parseInt(this.currentDragData.height);
                
                // Check if placement is valid and highlight cells
                const isValid = this.grid.isValidPlacement(row, col, width, height);
                this.grid.highlightCells(row, col, width, height, isValid);
                
                // Set the cursor based on validity
                e.dataTransfer.dropEffect = isValid ? 'move' : 'none';
            }
        });
        
        // Clear highlights when leaving the grid
        this.gridElement.addEventListener('dragleave', () => {
            this.grid.clearHighlights();
        });
        
        // Handle the drop
        this.gridElement.addEventListener('drop', (e) => {
            e.preventDefault();
            
            // Get the drop data
            let dragData;
            try {
                const dragDataString = e.dataTransfer.getData('text/plain');
                dragData = JSON.parse(dragDataString);
            } catch (err) {
                console.error('Error parsing drop data:', err);
                this.grid.clearHighlights();
                this.currentDragData = null;
                return;
            }
            
            // Get the grid cell where the item was dropped
            const { row, col } = this.grid.pixelToCell(e.clientX, e.clientY);
            const width = parseInt(dragData.width);
            const height = parseInt(dragData.height);
            
            // Check if the placement is valid
            if (this.grid.isValidPlacement(row, col, width, height)) {
                // If item is from the tray, create a new placed item
                if (dragData.fromTray) {
                    this.itemManager.createPlacedItem(dragData.objectType, row, col);
                } 
                // If moving an existing item, update its position
                else if (dragData.id) {
                    // Remove the old item
                    this.itemManager.removeItem(dragData.id);
                    
                    // Create a new item at the new position
                    this.itemManager.createPlacedItem(dragData.objectType, row, col);
                }
            } else if (!dragData.fromTray && dragData.id) {
                // If invalid drop for an existing item, return it to its original position
                const item = document.getElementById(dragData.id);
                if (item) {
                    // The item was deleted during dragstart, so recreate it
                    const originalData = this.itemManager.placedItems[dragData.id];
                    if (originalData) {
                        this.itemManager.createPlacedItem(
                            originalData.objectType,
                            originalData.row,
                            originalData.col
                        );
                    }
                }
            }
            
            // Clear highlights and reset drag data
            this.grid.clearHighlights();
            this.currentDragData = null;
        });
    }
    
    /**
     * Enable trash drop zone for removing items
     */
    setupTrashDropZone(elementId) {
        const trashElement = document.getElementById(elementId);
        if (!trashElement) return;
        
        trashElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            const dragDataString = e.dataTransfer.getData('text/plain');
            if (dragDataString) {
                try {
                    const dragData = JSON.parse(dragDataString);
                    // Only allow dropping if not from tray
                    if (!dragData.fromTray) {
                        e.dataTransfer.dropEffect = 'move';
                        trashElement.classList.add('trash-active');
                    }
                } catch (err) {
                    console.error('Error parsing drag data:', err);
                }
            }
        });
        
        trashElement.addEventListener('dragleave', () => {
            trashElement.classList.remove('trash-active');
        });
        
        trashElement.addEventListener('drop', (e) => {
            e.preventDefault();
            trashElement.classList.remove('trash-active');
            
            try {
                const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
                if (!dragData.fromTray && dragData.id) {
                    this.itemManager.removeItem(dragData.id);
                }
            } catch (err) {
                console.error('Error handling trash drop:', err);
            }
        });
    }
} 