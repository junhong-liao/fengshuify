/**
 * feedback.js - Handles displaying feedback about room arrangements
 */

class FeedbackManager {
    constructor() {
        this.feedbackPanel = document.getElementById('feedback-messages');
        this.modalFeedback = document.getElementById('modal-feedback-messages');
        this.feedbackModal = document.getElementById('feedback-modal');
        this.feedbackTitle = document.getElementById('feedback-title');
    }
    
    /**
     * Initialize the feedback manager
     */
    initialize() {
        // Clear any existing feedback
        this.clearFeedback();
        
        // Set up close modals functionality
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('active');
                });
            });
        });
    }
    
    /**
     * Display validation results in the feedback panel
     */
    displayFeedback(results) {
        this.clearFeedback();
        
        if (!results || results.length === 0) {
            this.addFeedbackMessage(
                'Please place items in the room and submit for feedback.',
                'neutral'
            );
            return;
        }
        
        // Count successes and errors
        const errors = results.filter(result => result.status === 'error');
        const successes = results.filter(result => result.status === 'success');
        
        // Update item visual indicators
        this.highlightItems(results);
        
        // Display success or errors in the panel
        if (successes.length > 0 && errors.length === 0) {
            // All rules passed
            this.addFeedbackMessage(
                successes[0].message,
                'success'
            );
        } else {
            // Show error count
            this.addFeedbackMessage(
                `Found ${errors.length} Feng Shui issue${errors.length !== 1 ? 's' : ''}.`,
                'error'
            );
            
            // Show first few errors in the panel
            errors.slice(0, 2).forEach(error => {
                this.addFeedbackMessage(error.message, 'error');
            });
            
            if (errors.length > 2) {
                this.addFeedbackMessage(
                    `See all ${errors.length} issues in the detailed report.`,
                    'neutral'
                );
            }
        }
    }
    
    /**
     * Show the detailed feedback modal with all results
     */
    showDetailedFeedback(results) {
        this.clearModalFeedback();
        
        // Count successes and errors
        const errors = results.filter(result => result.status === 'error');
        const successes = results.filter(result => result.status === 'success');
        
        // Set the modal title
        if (errors.length === 0 && successes.length > 0) {
            this.feedbackTitle.textContent = 'Perfect Arrangement!';
            this.feedbackTitle.className = 'success-title';
            
            // Add success animation
            document.querySelector('.modal-content').classList.add('success-animation');
        } else {
            this.feedbackTitle.textContent = `Room Assessment (${errors.length} issues found)`;
            this.feedbackTitle.className = '';
            document.querySelector('.modal-content').classList.remove('success-animation');
        }
        
        // Add all messages to the modal
        results.forEach(result => {
            this.addModalFeedbackMessage(result.message, result.status);
        });
        
        // Show the modal
        this.feedbackModal.classList.add('active');
    }
    
    /**
     * Add a message to the feedback panel
     */
    addFeedbackMessage(message, type = 'neutral') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `feedback-message ${type}`;
        messageDiv.textContent = message;
        this.feedbackPanel.appendChild(messageDiv);
    }
    
    /**
     * Add a message to the modal feedback display
     */
    addModalFeedbackMessage(message, type = 'neutral') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `feedback-message ${type}`;
        messageDiv.textContent = message;
        this.modalFeedback.appendChild(messageDiv);
    }
    
    /**
     * Highlight items based on validation results
     */
    highlightItems(results) {
        // First, remove any previous highlights
        document.querySelectorAll('.placed-item').forEach(item => {
            item.classList.remove('valid', 'invalid');
        });
        
        // If all rules passed, highlight all items as valid
        const allPassed = results.every(result => result.status === 'success');
        if (allPassed) {
            document.querySelectorAll('.placed-item').forEach(item => {
                item.classList.add('valid');
            });
            return;
        }
        
        // Get all errors with itemId
        const itemErrors = results.filter(
            result => result.status === 'error' && result.itemId
        );
        
        // Invalid items (have errors)
        const invalidItemIds = new Set(itemErrors.map(error => error.itemId));
        invalidItemIds.forEach(itemId => {
            const item = document.getElementById(itemId);
            if (item) {
                item.classList.add('invalid');
            }
        });
        
        // Valid items (no errors)
        document.querySelectorAll('.placed-item').forEach(item => {
            if (!invalidItemIds.has(item.id)) {
                item.classList.add('valid');
            }
        });
    }
    
    /**
     * Clear all feedback messages
     */
    clearFeedback() {
        this.feedbackPanel.innerHTML = '';
        
        // Also remove item highlights
        document.querySelectorAll('.placed-item').forEach(item => {
            item.classList.remove('valid', 'invalid');
        });
    }
    
    /**
     * Clear modal feedback
     */
    clearModalFeedback() {
        this.modalFeedback.innerHTML = '';
    }
} 