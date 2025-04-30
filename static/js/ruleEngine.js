/**
 * ruleEngine.js - Validates object placement according to Feng Shui rules
 */

class RuleEngine {
    constructor(config) {
        this.config = config;
        this.rules = config.rules;
    }
    
    /**
     * Evaluate all rules against the current placement of items
     * @param {Object} placedItems - Object containing all placed items data
     * @returns {Array} - Array of rule validation results
     */
    evaluateRules(placedItems) {
        const results = [];
        const placedItemsArray = Object.values(placedItems);
        
        // Skip validation if no items are placed
        if (placedItemsArray.length === 0) {
            return [{
                id: 'no_items',
                status: 'error',
                message: 'Please place some items in the room to evaluate Feng Shui principles.'
            }];
        }
        
        // Check if required items are placed
        const hasRequired = this.checkRequiredItems(placedItemsArray);
        if (!hasRequired.allPresent) {
            return [{
                id: 'missing_required',
                status: 'error',
                message: `Missing required items: ${hasRequired.missing.join(', ')}`
            }];
        }
        
        // Run each rule validation
        this.rules.forEach(rule => {
            const result = this.validateRule(rule, placedItemsArray);
            if (result) {
                results.push(result);
            }
        });
        
        // Add success message if all rules passed
        if (results.length === 0) {
            results.push({
                id: 'all_rules_passed',
                status: 'success',
                message: 'Perfect! Your room follows all Feng Shui principles.'
            });
        }
        
        return results;
    }
    
    /**
     * Check if all required items are placed
     */
    checkRequiredItems(placedItems) {
        const requiredTypes = ['door', 'bed', 'mirror', 'window'];
        const placedTypes = new Set(placedItems.map(item => item.objectType));
        
        const missing = requiredTypes.filter(type => !placedTypes.has(type));
        
        return {
            allPresent: missing.length === 0,
            missing: missing.map(type => this.config.objects[type].name)
        };
    }
    
    /**
     * Validate a specific rule
     */
    validateRule(rule, placedItems) {
        // Filter items to only include those applicable to this rule
        const relevantItems = {};
        
        // Build a map of object types to their placed instances
        rule.appliesTo.forEach(objectType => {
            relevantItems[objectType] = placedItems.filter(
                item => item.objectType === objectType
            );
        });
        
        // Skip rule if any required object type is not placed
        if (rule.appliesTo.some(type => relevantItems[type].length === 0)) {
            return null;
        }
        
        // Call the appropriate rule validator function
        switch (rule.id) {
            case 'door_placement':
                return this.validateDoorPlacement(rule, relevantItems.door);
            case 'bed_door_relation':
                return this.validateBedDoorRelation(rule, relevantItems.bed, relevantItems.door);
            case 'bed_window_relation':
                return this.validateBedWindowRelation(rule, relevantItems.bed, relevantItems.window);
            case 'mirror_bed_relation':
                return this.validateMirrorBedRelation(rule, relevantItems.mirror, relevantItems.bed);
            case 'mirror_door_relation':
                return this.validateMirrorDoorRelation(rule, relevantItems.mirror, relevantItems.door);
            case 'window_placement':
                return this.validateWindowPlacement(rule, relevantItems);
            default:
                console.warn(`No validator implemented for rule: ${rule.id}`);
                return null;
        }
    }
    
    /**
     * Rule Validators
     * Each returns either null (rule passed) or an object with rule result
     */
    
    validateDoorPlacement(rule, doors) {
        // Door should be at the entrance (bottom of the grid, middle)
        const door = doors[0]; // Only consider first door
        
        // The valid door position is: row 8-9, col 5-6
        const isValidPosition = 
            (door.row === 8 || door.row === 7) && 
            (door.col === 5 || door.col === 6);
        
        if (!isValidPosition) {
            return {
                id: rule.id,
                itemId: door.id,
                status: 'error',
                message: 'The door should be placed at the entrance (bottom, middle) of the room.'
            };
        }
        
        return null; // Rule passed
    }
    
    validateBedDoorRelation(rule, beds, doors) {
        const bed = beds[0]; // Only consider first bed
        const door = doors[0]; // Only consider first door
        
        // Rule: Bed should not directly face the door
        // Check if bed is directly in line with door
        const bedFacesDoor = (
            // Bed along same column as door
            (bed.col <= door.col && bed.col + bed.width > door.col) ||
            (door.col <= bed.col && door.col + door.width > bed.col) ||
            // Bed on the same row as door (unlikely in our layout)
            (bed.row <= door.row && bed.row + bed.height > door.row) ||
            (door.row <= bed.row && door.row + door.height > bed.row)
        );
        
        // Check if bed has view of door (must be able to see door from bed)
        // Simple implementation: bed and door should be in same half of room
        const hasDoorView = 
            (bed.row < this.config.grid.rows / 2 && door.row < this.config.grid.rows / 2) ||
            (bed.row >= this.config.grid.rows / 2 && door.row >= this.config.grid.rows / 2);
        
        if (bedFacesDoor) {
            return {
                id: rule.id,
                itemId: bed.id,
                status: 'error',
                message: 'The bed should not directly face or align with the door.'
            };
        }
        
        if (!hasDoorView) {
            return {
                id: rule.id,
                itemId: bed.id,
                status: 'error',
                message: 'The bed should have a clear view of the door.'
            };
        }
        
        return null; // Rule passed
    }
    
    validateBedWindowRelation(rule, beds, windows) {
        const bed = beds[0]; // Only consider first bed
        
        // Check if bed is under any window
        for (const window of windows) {
            // Simple check: is bed directly below window?
            const bedUnderWindow = (
                bed.row > window.row && 
                ((bed.col <= window.col && bed.col + bed.width > window.col) ||
                 (window.col <= bed.col && window.col + window.width > bed.col))
            );
            
            if (bedUnderWindow) {
                return {
                    id: rule.id,
                    itemId: bed.id,
                    status: 'error',
                    message: 'The bed should not be placed directly under a window.'
                };
            }
        }
        
        return null; // Rule passed
    }
    
    validateMirrorBedRelation(rule, mirrors, beds) {
        const bed = beds[0]; // Only consider first bed
        
        for (const mirror of mirrors) {
            // Check if mirror directly faces the bed
            const mirrorFacesBed = (
                // Mirror directly across from bed horizontally
                (mirror.row === bed.row || 
                 (mirror.row >= bed.row && mirror.row < bed.row + bed.height) ||
                 (bed.row >= mirror.row && bed.row < mirror.row + mirror.height)) ||
                // Mirror directly above bed
                (mirror.col === bed.col || 
                 (mirror.col >= bed.col && mirror.col < bed.col + bed.width) ||
                 (bed.col >= mirror.col && bed.col < mirror.col + mirror.width))
            );
            
            // Check if mirror is above bed
            const mirrorAboveBed = (
                mirror.row < bed.row &&
                ((mirror.col <= bed.col && mirror.col + mirror.width > bed.col) ||
                 (bed.col <= mirror.col && bed.col + bed.width > mirror.col))
            );
            
            if (mirrorFacesBed || mirrorAboveBed) {
                return {
                    id: rule.id,
                    itemId: mirror.id,
                    status: 'error',
                    message: 'Mirrors should not directly face or be placed above the bed.'
                };
            }
        }
        
        return null; // Rule passed
    }
    
    validateMirrorDoorRelation(rule, mirrors, doors) {
        const door = doors[0]; // Only consider first door
        
        for (const mirror of mirrors) {
            // Check if mirror directly faces the door
            const mirrorFacesDoor = (
                // Mirror directly across from door horizontally
                (mirror.row === door.row || 
                 (mirror.row >= door.row && mirror.row < door.row + door.height) ||
                 (door.row >= mirror.row && door.row < mirror.row + mirror.height)) &&
                // Vertical alignment check
                (mirror.col === door.col || 
                 (mirror.col >= door.col && mirror.col < door.col + door.width) ||
                 (door.col >= mirror.col && door.col < mirror.col + mirror.width))
            );
            
            if (mirrorFacesDoor) {
                return {
                    id: rule.id,
                    itemId: mirror.id,
                    status: 'error',
                    message: 'Mirrors should not directly face the door.'
                };
            }
        }
        
        return null; // Rule passed
    }
    
    validateWindowPlacement(rule, items) {
        const beds = items.bed || [];
        const mirrors = items.mirror || [];
        const windows = items.window || [];
        
        // Check if windows are directly behind bed or mirror
        for (const window of windows) {
            // Check relation to beds
            for (const bed of beds) {
                const windowBehindBed = (
                    window.row === bed.row + bed.height - 1 &&
                    ((window.col <= bed.col && window.col + window.width > bed.col) ||
                     (bed.col <= window.col && bed.col + bed.width > window.col))
                );
                
                if (windowBehindBed) {
                    return {
                        id: rule.id,
                        itemId: window.id,
                        status: 'error',
                        message: 'Windows should not be directly behind the bed.'
                    };
                }
            }
            
            // Check relation to mirrors
            for (const mirror of mirrors) {
                const windowBehindMirror = (
                    window.row === mirror.row + mirror.height - 1 &&
                    ((window.col <= mirror.col && window.col + window.width > mirror.col) ||
                     (mirror.col <= window.col && mirror.col + mirror.width > window.col))
                );
                
                if (windowBehindMirror) {
                    return {
                        id: rule.id,
                        itemId: window.id,
                        status: 'error',
                        message: 'Windows should not be directly behind mirrors.'
                    };
                }
            }
        }
        
        return null; // Rule passed
    }
} 