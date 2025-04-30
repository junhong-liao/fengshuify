/**
 * accessibility.js - Handles keyboard navigation and accessibility features
 */

class AccessibilityManager {
    constructor(grid, itemManager) {
        this.grid = grid;
        this.itemManager = itemManager;
        this.currentFocus = null;
        this.selectedItem = null;
    }
    
    /**
     * Initialize accessibility features
     */
    initialize() {
        // Add ARIA roles
        this.setupAriaAttributes();
        
        // Set up keyboard navigation
        this.setupKeyboardNavigation();
    }
    
    /**
     * Add appropriate ARIA attributes to elements
     */
    setupAriaAttributes() {
        // Grid container
        const gridContainer = document.getElementById('grid-container');
        gridContainer.setAttribute('role', 'grid');
        gridContainer.setAttribute('aria-label', 'Feng Shui room layout grid');
        
        // Grid cells
        const cells = gridContainer.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            cell.setAttribute('role', 'gridcell');
            cell.setAttribute('tabindex', '-1');
            cell.setAttribute('aria-label', `Room cell at position ${cell.dataset.row}, ${cell.dataset.col}`);
        });
        
        // Items in tray
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            item.setAttribute('role', 'button');
            item.setAttribute('aria-grabbed', 'false');
            item.setAttribute('aria-label', `${item.querySelector('.item-name').textContent} - ${item.title}`);
            item.setAttribute('tabindex', '0');
        });
        
        // Buttons
        document.getElementById('reset-btn').setAttribute('aria-label', 'Reset room layout');
        document.getElementById('submit-btn').setAttribute('aria-label', 'Submit room for Feng Shui assessment');
        document.getElementById('help-btn').setAttribute('aria-label', 'Show Feng Shui rules help');
        
        // Modals
        document.getElementById('help-modal').setAttribute('role', 'dialog');
        document.getElementById('help-modal').setAttribute('aria-labelledby', 'help-modal-title');
        document.getElementById('feedback-modal').setAttribute('role', 'dialog');
        document.getElementById('feedback-modal').setAttribute('aria-labelledby', 'feedback-title');
        
        // Add hidden heading for help modal
        const helpModalContent = document.querySelector('#help-modal .modal-content');
        const helpHeading = document.createElement('h2');
        helpHeading.id = 'help-modal-title';
        helpHeading.textContent = 'Feng Shui Room Rules';
        helpHeading.style.position = 'absolute';
        helpHeading.style.clip = 'rect(0 0 0 0)';
        helpHeading.style.clipPath = 'inset(50%)';
        helpHeading.style.height = '1px';
        helpHeading.style.overflow = 'hidden';
        helpHeading.style.whiteSpace = 'nowrap';
        helpHeading.style.width = '1px';
        helpModalContent.prepend(helpHeading);
    }
    
    /**
     * Set up keyboard navigation for the simulator
     */
    setupKeyboardNavigation() {
        // Add keyboard event listener
        document.addEventListener('keydown', this.handleKeyNavigation.bind(this));
        
        // Make items focusable and handle Enter/Space
        document.querySelectorAll('.item').forEach(item => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectItem(item);
                }
            });
        });
        
        // Make cells focusable
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.addEventListener('keydown', (e) => {
                if ((e.key === 'Enter' || e.key === ' ') && this.selectedItem) {
                    e.preventDefault();
                    this.placeItemAtCell(this.selectedItem, cell);
                }
            });
        });
    }
    
    /**
     * Handle keyboard navigation key events
     */
    handleKeyNavigation(e) {
        // Escape key to cancel selection
        if (e.key === 'Escape') {
            this.clearSelection();
            return;
        }
        
        // Arrow keys for navigation
        if (e.key.startsWith('Arrow')) {
            e.preventDefault();
            
            if (this.currentFocus && this.currentFocus.classList.contains('grid-cell')) {
                this.navigateGrid(e.key);
            } else if (this.currentFocus && this.currentFocus.classList.contains('item')) {
                this.navigateItems(e.key);
            }
        }
    }
    
    /**
     * Navigate grid cells with arrow keys
     */
    navigateGrid(direction) {
        const currentRow = parseInt(this.currentFocus.dataset.row);
        const currentCol = parseInt(this.currentFocus.dataset.col);
        let newRow = currentRow;
        let newCol = currentCol;
        
        switch (direction) {
            case 'ArrowUp':
                newRow = Math.max(0, currentRow - 1);
                break;
            case 'ArrowDown':
                newRow = Math.min(this.grid.rows - 1, currentRow + 1);
                break;
            case 'ArrowLeft':
                newCol = Math.max(0, currentCol - 1);
                break;
            case 'ArrowRight':
                newCol = Math.min(this.grid.cols - 1, currentCol + 1);
                break;
        }
        
        const newCell = this.grid.getCellElement(newRow, newCol);
        if (newCell) {
            this.focusElement(newCell);
        }
    }
    
    /**
     * Navigate items with arrow keys
     */
    navigateItems(direction) {
        const items = Array.from(document.querySelectorAll('.item'));
        const currentIndex = items.indexOf(this.currentFocus);
        let newIndex = currentIndex;
        
        switch (direction) {
            case 'ArrowUp':
                newIndex = Math.max(0, currentIndex - 1);
                break;
            case 'ArrowDown':
                newIndex = Math.min(items.length - 1, currentIndex + 1);
                break;
        }
        
        if (newIndex !== currentIndex) {
            this.focusElement(items[newIndex]);
        }
    }
    
    /**
     * Select an item to place
     */
    selectItem(item) {
        // Clear previous selection
        if (this.selectedItem) {
            this.selectedItem.setAttribute('aria-grabbed', 'false');
            this.selectedItem.classList.remove('selected');
        }
        
        // Set new selection
        this.selectedItem = item;
        this.selectedItem.setAttribute('aria-grabbed', 'true');
        this.selectedItem.classList.add('selected');
        
        // Announce to screen readers
        this.announceAction(`Selected ${item.querySelector('.item-name').textContent}. Use arrow keys to navigate the grid, then press Enter to place.`);
        
        // Focus the center grid cell
        const centerRow = Math.floor(this.grid.rows / 2);
        const centerCol = Math.floor(this.grid.cols / 2);
        const centerCell = this.grid.getCellElement(centerRow, centerCol);
        if (centerCell) {
            this.focusElement(centerCell);
        }
    }
    
    /**
     * Place selected item at a grid cell
     */
    placeItemAtCell(itemElement, cellElement) {
        const objectType = itemElement.dataset.objectType;
        const row = parseInt(cellElement.dataset.row);
        const col = parseInt(cellElement.dataset.col);
        const width = parseInt(itemElement.dataset.width);
        const height = parseInt(itemElement.dataset.height);
        
        // Check if placement is valid
        if (this.grid.isValidPlacement(row, col, width, height)) {
            // Create the placed item
            this.itemManager.createPlacedItem(objectType, row, col);
            
            // Announce success
            this.announceAction(`Placed ${itemElement.querySelector('.item-name').textContent} successfully.`);
            
            // Clear selection
            this.clearSelection();
        } else {
            // Announce error
            this.announceAction(`Cannot place ${itemElement.querySelector('.item-name').textContent} here. Try another location.`);
        }
    }
    
    /**
     * Clear the current selection
     */
    clearSelection() {
        if (this.selectedItem) {
            this.selectedItem.setAttribute('aria-grabbed', 'false');
            this.selectedItem.classList.remove('selected');
            this.selectedItem = null;
            
            // Announce to screen readers
            this.announceAction('Selection cleared.');
        }
    }
    
    /**
     * Focus an element and update current focus
     */
    focusElement(element) {
        if (element) {
            element.focus();
            this.currentFocus = element;
        }
    }
    
    /**
     * Announce actions to screen readers
     */
    announceAction(message) {
        // Create or get live region
        let announcer = document.getElementById('a11y-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'a11y-announcer';
            announcer.setAttribute('role', 'status');
            announcer.setAttribute('aria-live', 'polite');
            announcer.style.position = 'absolute';
            announcer.style.clip = 'rect(0 0 0 0)';
            announcer.style.clipPath = 'inset(50%)';
            announcer.style.height = '1px';
            announcer.style.overflow = 'hidden';
            announcer.style.whiteSpace = 'nowrap';
            announcer.style.width = '1px';
            document.body.appendChild(announcer);
        }
        
        // Set message
        announcer.textContent = message;
    }
} 