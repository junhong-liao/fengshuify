/**
 * items.js - Manages the creation and tracking of room items/furniture
 */

class ItemManager {
    constructor(config) {
        this.config = config;
        this.objects = config.objects;
        this.placedItems = {}; // Tracks all placed items: { itemId: { objectType, row, col } }
        this.itemCounter = 0; // Used to generate unique IDs
        this.itemsContainer = document.getElementById('items-container');
    }
    
    /**
     * Initialize the item tray with draggable objects
     */
    initialize() {
        this.itemsContainer.innerHTML = '';
        
        // Create an item in the tray for each object type
        Object.values(this.objects).forEach(obj => {
            const itemElement = this.createTrayItem(obj);
            this.itemsContainer.appendChild(itemElement);
        });
    }
    
    /**
     * Create a draggable item for the item tray
     */
    createTrayItem(objectDef) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.dataset.objectType = objectDef.id;
        itemDiv.dataset.width = objectDef.width;
        itemDiv.dataset.height = objectDef.height;
        itemDiv.title = objectDef.description;
        
        // Add object icon/image
        const itemContent = document.createElement('div');
        itemContent.className = 'item-content';
        itemContent.innerHTML = `
            <span class="item-icon">${objectDef.icon}</span>
            <span class="item-name">${objectDef.name}</span>
        `;
        itemDiv.appendChild(itemContent);
        
        // Make draggable
        itemDiv.setAttribute('draggable', 'true');
        this.setupDragEvents(itemDiv, true);
        
        return itemDiv;
    }
    
    /**
     * Create a placed item on the grid
     */
    createPlacedItem(objectType, row, col) {
        const objectDef = this.objects[objectType];
        const itemId = `item-${objectType}-${this.itemCounter++}`;
        
        // Create the placed item element
        const placedItemDiv = document.createElement('div');
        placedItemDiv.id = itemId;
        placedItemDiv.className = 'placed-item';
        placedItemDiv.dataset.objectType = objectType;
        placedItemDiv.title = objectDef.description;
        
        // Set size and position
        placedItemDiv.style.width = `${objectDef.width * grid.cellSize}px`;
        placedItemDiv.style.height = `${objectDef.height * grid.cellSize}px`;
        placedItemDiv.style.top = `${row * grid.cellSize}px`;
        placedItemDiv.style.left = `${col * grid.cellSize}px`;
        
        // Add content
        placedItemDiv.innerHTML = `<span class="item-icon">${objectDef.icon}</span>`;
        
        // Make draggable
        placedItemDiv.setAttribute('draggable', 'true');
        this.setupDragEvents(placedItemDiv, false);
        
        // Add to grid
        document.getElementById('grid-container').appendChild(placedItemDiv);
        
        // Track the placed item
        this.placedItems[itemId] = {
            id: itemId,
            objectType: objectType,
            row: row,
            col: col,
            width: objectDef.width,
            height: objectDef.height
        };
        
        // Update grid occupancy
        grid.occupyCells(row, col, objectDef.width, objectDef.height, itemId);
        
        // Check if we need to disable the tray item (max per room)
        this.updateTrayItemAvailability(objectType);
        
        return itemId;
    }
    
    /**
     * Setup drag events for items
     */
    setupDragEvents(element, isFromTray) {
        element.addEventListener('dragstart', (e) => {
            // Store data about the dragged item
            const objectType = element.dataset.objectType;
            const data = {
                id: element.id,
                objectType: objectType,
                width: this.objects[objectType].width,
                height: this.objects[objectType].height,
                fromTray: isFromTray
            };
            
            // Add dragging class
            element.classList.add('dragging');
            
            // Set drag data
            e.dataTransfer.setData('text/plain', JSON.stringify(data));
            e.dataTransfer.effectAllowed = 'move';
            
            // If this is from the grid (not tray), free the cells
            if (!isFromTray) {
                const itemData = this.placedItems[element.id];
                grid.freeCells(element.id);
            }
        });
        
        element.addEventListener('dragend', () => {
            element.classList.remove('dragging');
            grid.clearHighlights();
        });
    }
    
    /**
     * Update the availability of items in the tray based on max limits
     */
    updateTrayItemAvailability(objectType) {
        const objectDef = this.objects[objectType];
        
        // Count how many of this object are placed
        const placedCount = Object.values(this.placedItems).filter(
            item => item.objectType === objectType
        ).length;
        
        // Disable tray item if max reached
        const trayItem = this.itemsContainer.querySelector(`[data-object-type="${objectType}"]`);
        if (trayItem) {
            if (placedCount >= objectDef.maxPerRoom) {
                trayItem.classList.add('disabled');
                trayItem.setAttribute('draggable', 'false');
            } else {
                trayItem.classList.remove('disabled');
                trayItem.setAttribute('draggable', 'true');
            }
        }
    }
    
    /**
     * Remove a placed item
     */
    removeItem(itemId) {
        if (this.placedItems[itemId]) {
            // Remove from grid
            grid.freeCells(itemId);
            
            // Remove the element
            const element = document.getElementById(itemId);
            if (element) {
                element.remove();
            }
            
            // Update tray availability
            const objectType = this.placedItems[itemId].objectType;
            delete this.placedItems[itemId];
            this.updateTrayItemAvailability(objectType);
        }
    }
    
    /**
     * Reset all items
     */
    reset() {
        // Remove all placed items
        Object.keys(this.placedItems).forEach(itemId => {
            this.removeItem(itemId);
        });
        
        // Reset counter
        this.itemCounter = 0;
    }
    
    /**
     * Get all placed items data for rule checking
     */
    getPlacedItemsData() {
        return this.placedItems;
    }
} 