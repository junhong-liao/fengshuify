// Wrap in an IIFE so code runs immediately
(function() {
    // Fixed grid size - 8x8
    const GRID_SIZE = {
        rows: 8,
        cols: 8
    };
    
    // Current grid settings
    let currentGrid = {
        cellSize: 0,
        furniture: {}
    };
    
    // Currently selected furniture
    let selectedFurniture = null;
    
    // Initialize the simulator
    initializeGrid();
    initializeListeners();
    
    function initializeListeners() {
        const gridContainer = document.getElementById('grid-container');
        // Furniture item selection
        document.querySelectorAll('.furniture-item').forEach(item => {
            item.addEventListener('click', function() {
                // Highlight selected furniture
                document.querySelectorAll('.furniture-item').forEach(i => {
                    i.style.border = '2px solid #8470a7';
                });
                this.style.border = '3px solid #5a4782';
                
                selectedFurniture = {
                    type: this.getAttribute('data-type'),
                    width: parseInt(this.getAttribute('data-width')),
                    height: parseInt(this.getAttribute('data-height')),
                    element: this
                };
            });
        });
        
        // Add dragstart listener for drag-and-drop
        document.querySelectorAll('.furniture-item').forEach(item => {
            item.addEventListener('dragstart', function(e) {
                const type = this.getAttribute('data-type');
                const width = parseInt(this.getAttribute('data-width'));
                const height = parseInt(this.getAttribute('data-height'));
                e.dataTransfer.setData('application/json', JSON.stringify({ type, width, height }));
            });
        });
        
        // Allow grid to accept drops
        gridContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        gridContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            const cell = e.target.closest('.grid-cell');
            if (!cell) return;
            const row = parseInt(cell.getAttribute('data-row'));
            const col = parseInt(cell.getAttribute('data-col'));
            // Parse dropped data
            let dropData;
            try {
                dropData = JSON.parse(e.dataTransfer.getData('application/json'));
            } catch {
                return;
            }
            if (isValidPlacement(row, col, dropData.width, dropData.height)) {
                placeFurniture(row, col, dropData);
            } else {
                alert('Invalid placement! Make sure the furniture fits within the grid and doesn\'t overlap other items.');
            }
        });
        
        // Setup grid click handler for placing furniture
        gridContainer.addEventListener('click', handleGridClick);
        
        // Add validate button event listener
        const validateBtn = document.getElementById('validate-btn');
        if (validateBtn) {
            validateBtn.addEventListener('click', validatePlacement);
        }
    }
    
    function initializeGrid() {
        const gridContainer = document.getElementById('grid-container');
        if (!gridContainer) return;
        
        // Clear any existing grid content
        gridContainer.innerHTML = '';
        
        // Calculate cell size based on container size
        const containerWidth = 600; // Fixed width from CSS
        currentGrid.cellSize = Math.floor(containerWidth / GRID_SIZE.cols);
        
        // Update grid container style
        gridContainer.style.gridTemplateColumns = `repeat(${GRID_SIZE.cols}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${GRID_SIZE.rows}, 1fr)`;
        
        // Create grid cells
        for (let row = 0; row < GRID_SIZE.rows; row++) {
            for (let col = 0; col < GRID_SIZE.cols; col++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.setAttribute('data-row', row);
                cell.setAttribute('data-col', col);
                gridContainer.appendChild(cell);
            }
        }
    }
    
    function handleGridClick(event) {
        if (!selectedFurniture) {
            alert('Please select a furniture item first!');
            return;
        }
        
        // Find clicked cell
        const cell = event.target.closest('.grid-cell');
        if (!cell) return;
        
        const row = parseInt(cell.getAttribute('data-row'));
        const col = parseInt(cell.getAttribute('data-col'));
        
        // Check if placement is valid
        if (isValidPlacement(row, col, selectedFurniture.width, selectedFurniture.height)) {
            placeFurniture(row, col, selectedFurniture);
            
            // Reset furniture selection
            selectedFurniture = null;
            document.querySelectorAll('.furniture-item').forEach(i => {
                i.style.border = '2px solid #8470a7';
            });
        } else {
            alert('Invalid placement! Make sure the furniture fits within the grid and doesn\'t overlap other items.');
        }
    }
    
    function isValidPlacement(row, col, width, height) {
        // Check if furniture fits within grid
        if (row + height > GRID_SIZE.rows || col + width > GRID_SIZE.cols) {
            return false;
        }
        
        // Check for overlap with existing furniture
        for (let r = row; r < row + height; r++) {
            for (let c = col; c < col + width; c++) {
                for (const id in currentGrid.furniture) {
                    const furniture = currentGrid.furniture[id];
                    if (isCellOccupied(r, c, furniture)) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }
    
    function isCellOccupied(row, col, furniture) {
        return row >= furniture.row && 
               row < furniture.row + furniture.height &&
               col >= furniture.col && 
               col < furniture.col + furniture.width;
    }
    
    function placeFurniture(row, col, furniture) {
        const gridWrapper = document.getElementById('grid-wrapper');
        const gridRect = document.getElementById('grid-container').getBoundingClientRect();
        
        // Create furniture element
        const furnitureElement = document.createElement('div');
        furnitureElement.classList.add('item-placed', `placed-${furniture.type}`);
        
        // Position and size
        const widthPx = furniture.width * currentGrid.cellSize;
        const heightPx = furniture.height * currentGrid.cellSize;
        const left = col * currentGrid.cellSize;
        const top = row * currentGrid.cellSize;
        
        furnitureElement.style.width = `${widthPx}px`;
        furnitureElement.style.height = `${heightPx}px`;
        furnitureElement.style.left = `${left}px`;
        furnitureElement.style.top = `${top}px`;
        
        // Add label
        const labelSpan = document.createElement('span');
        labelSpan.textContent = furniture.type.charAt(0).toUpperCase() + furniture.type.slice(1);
        furnitureElement.appendChild(labelSpan);
        
        // Add to grid
        gridWrapper.appendChild(furnitureElement);
        
        // Store furniture in grid data
        const id = Date.now().toString();
        currentGrid.furniture[id] = {
            id,
            type: furniture.type,
            row,
            col,
            width: furniture.width,
            height: furniture.height,
            element: furnitureElement
        };
        
        // Make placed furniture draggable so it can be picked up
        furnitureElement.setAttribute('draggable', 'true');
        
        // Make placed furniture pick-up (drag to move)
        furnitureElement.addEventListener('dragstart', function(e) {
            // Start drag with same data
            e.dataTransfer.setData('application/json', JSON.stringify({
                type: furniture.type,
                width: furniture.width,
                height: furniture.height
            }));
            // Remove from grid data and DOM
            delete currentGrid.furniture[id];
            setTimeout(() => furnitureElement.remove(), 0);
        });
        
        // Click to rotate (90 degrees)
        furnitureElement.addEventListener('click', function(e) {
            e.stopPropagation();
            // swap width/height
            const item = currentGrid.furniture[id];
            const w = item.width, h = item.height;
            item.width = h;
            item.height = w;
            // update styles
            const newW = h * currentGrid.cellSize;
            const newH = w * currentGrid.cellSize;
            furnitureElement.style.width = `${newW}px`;
            furnitureElement.style.height = `${newH}px`;
        });
        
        // Right-click to remove
        furnitureElement.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            delete currentGrid.furniture[id];
            furnitureElement.remove();
        });
    }
    
    function validatePlacement() {
        // Create a simplified data structure for the server
        const placementData = {};
        
        for (const id in currentGrid.furniture) {
            const item = currentGrid.furniture[id];
            // If there are multiple of one type, the last one will be used
            placementData[item.type] = {
                row: item.row,
                col: item.col,
                width: item.width,
                height: item.height,
                type: item.type
            };
        }
        
        // Check if we have enough items to validate
        if (Object.keys(placementData).length < 2) {
            showFeedback(['Please place at least two items to validate Feng Shui principles.'], false);
            return;
        }
        
        // Send to server for validation
        fetch('/validate_placement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(placementData)
        })
        .then(response => response.json())
        .then(data => {
            showFeedback(data.feedback, data.valid);
        })
        .catch(error => {
            console.error('Error validating placement:', error);
            showFeedback(['Error validating placement. Please try again.'], false);
        });
    }
    
    function showFeedback(messages, isValid) {
        const feedbackContainer = document.getElementById('feedback-container');
        if (!feedbackContainer) return;
        
        // Clear previous feedback
        feedbackContainer.innerHTML = '';
        
        // Create feedback elements
        const alertClass = isValid ? 'alert-success' : 'alert-warning';
        const feedbackDiv = document.createElement('div');
        feedbackDiv.classList.add('alert', alertClass, 'mt-3');
        
        // Add each message
        messages.forEach(message => {
            const p = document.createElement('p');
            p.textContent = message;
            p.classList.add('mb-1');
            feedbackDiv.appendChild(p);
        });
        
        // Add validate button back
        const validateBtn = document.createElement('button');
        validateBtn.textContent = 'Validate Feng Shui';
        validateBtn.classList.add('btn', 'nav-btn');
        validateBtn.id = 'validate-btn';
        validateBtn.addEventListener('click', validatePlacement);
        
        // Add to container
        feedbackContainer.appendChild(feedbackDiv);
        feedbackContainer.appendChild(validateBtn);
    }
})(); 