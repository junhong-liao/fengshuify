/**
 * ui.js - Handles UI elements like buttons, modals, and tooltips
 */

class UIManager {
    constructor(grid, itemManager, ruleEngine, feedbackManager) {
        this.grid = grid;
        this.itemManager = itemManager;
        this.ruleEngine = ruleEngine;
        this.feedbackManager = feedbackManager;
        
        // UI elements
        this.resetBtn = document.getElementById('reset-btn');
        this.submitBtn = document.getElementById('submit-btn');
        this.helpBtn = document.getElementById('help-btn');
        this.helpModal = document.getElementById('help-modal');
    }
    
    /**
     * Initialize UI event handlers
     */
    initialize() {
        // Setup button event listeners
        this.setupButtons();
    }
    
    /**
     * Setup button event handlers
     */
    setupButtons() {
        // Reset button - clear the room
        this.resetBtn.addEventListener('click', () => {
            this.resetRoom();
        });
        
        // Submit button - check rules and provide feedback
        this.submitBtn.addEventListener('click', () => {
            this.evaluateRoom();
        });
        
        // Help button - show help modal
        this.helpBtn.addEventListener('click', () => {
            this.showHelpModal();
        });
    }
    
    /**
     * Reset the room to its initial state
     */
    resetRoom() {
        this.grid.reset();
        this.itemManager.reset();
        this.feedbackManager.clearFeedback();
        
        // Add a reset message
        this.feedbackManager.addFeedbackMessage(
            'Room reset. Drag items from the tray to place them.',
            'neutral'
        );
    }
    
    /**
     * Evaluate room against Feng Shui rules
     */
    evaluateRoom() {
        const placedItems = this.itemManager.getPlacedItemsData();
        const results = this.ruleEngine.evaluateRules(placedItems);
        
        // Display results in the feedback panel
        this.feedbackManager.displayFeedback(results);
        
        // Show detailed results in modal
        this.feedbackManager.showDetailedFeedback(results);
    }
    
    /**
     * Show help modal with Feng Shui rules
     */
    showHelpModal() {
        this.helpModal.classList.add('active');
    }
    
    /**
     * Create first-time user onboarding overlay
     */
    showOnboarding() {
        // Create onboarding container
        const onboardingContainer = document.createElement('div');
        onboardingContainer.className = 'onboarding-container';
        
        // Create onboarding content
        onboardingContainer.innerHTML = `
            <div class="onboarding-content">
                <h2>Welcome to the Feng Shui Room Simulator!</h2>
                <p>Learn how to arrange your room according to Feng Shui principles.</p>
                
                <div class="onboarding-steps">
                    <div class="onboarding-step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h3>Drag Items</h3>
                            <p>Drag furniture from the tray on the left into the room grid.</p>
                        </div>
                    </div>
                    
                    <div class="onboarding-step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h3>Arrange Properly</h3>
                            <p>Follow Feng Shui principles like keeping the bed away from the door.</p>
                        </div>
                    </div>
                    
                    <div class="onboarding-step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h3>Get Feedback</h3>
                            <p>Click "Submit" to see if your arrangement follows Feng Shui rules.</p>
                        </div>
                    </div>
                </div>
                
                <button id="start-simulator" class="start-btn">Start Simulator</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(onboardingContainer);
        
        // Setup close button
        document.getElementById('start-simulator').addEventListener('click', () => {
            onboardingContainer.classList.add('fade-out');
            setTimeout(() => {
                onboardingContainer.remove();
                
                // Store in localStorage that onboarding was shown
                localStorage.setItem('onboardingShown', 'true');
            }, 500);
        });
    }
    
    /**
     * Check if onboarding should be shown and display if needed
     */
    checkAndShowOnboarding() {
        // Only show onboarding if it hasn't been shown before
        const onboardingShown = localStorage.getItem('onboardingShown');
        if (!onboardingShown) {
            setTimeout(() => {
                this.showOnboarding();
            }, 1000); // Show after a delay to let the page load
        }
    }
} 