/**
 * main.js - Main entry point for the Feng Shui Room Simulator
 * Initializes and coordinates all simulator components
 */

// Global instances for modules
let grid;
let itemManager;
let dragDropManager;
let ruleEngine;
let feedbackManager;
let uiManager;
let accessibilityManager;

/**
 * Initialize the simulator
 */
function initializeSimulator() {
    console.log('Initializing Feng Shui Room Simulator...');
    
    // Create grid manager
    grid = new Grid(SIMULATOR_CONFIG);
    grid.initialize();
    
    // Create item manager for furniture objects
    itemManager = new ItemManager(SIMULATOR_CONFIG);
    itemManager.initialize();
    
    // Create drag-drop manager
    dragDropManager = new DragDropManager(grid, itemManager);
    dragDropManager.initialize();
    
    // Create rule engine for validation
    ruleEngine = new RuleEngine(SIMULATOR_CONFIG);
    
    // Create feedback manager
    feedbackManager = new FeedbackManager();
    feedbackManager.initialize();
    
    // Create UI manager
    uiManager = new UIManager(grid, itemManager, ruleEngine, feedbackManager);
    uiManager.initialize();
    
    // Create accessibility manager
    accessibilityManager = new AccessibilityManager(grid, itemManager);
    accessibilityManager.initialize();
    
    // Show initial feedback
    feedbackManager.addFeedbackMessage(
        'Welcome to the Feng Shui Room Simulator! Drag items from the tray to place them in the room.',
        'neutral'
    );
    
    // Check if we should show onboarding
    uiManager.checkAndShowOnboarding();
    
    console.log('Simulator initialization complete.');
}

/**
 * Wait for DOM to be ready before initializing
 */
document.addEventListener('DOMContentLoaded', initializeSimulator);

/**
 * Handle errors
 */
window.addEventListener('error', (event) => {
    console.error('Error in Feng Shui Simulator:', event.error);
    // Display user-friendly error in feedback panel if available
    if (feedbackManager) {
        feedbackManager.addFeedbackMessage(
            'Something went wrong. Please try refreshing the page.',
            'error'
        );
    }
}); 