/**
 * config.js - Configuration settings for the Feng Shui Room Simulator
 * Contains room dimensions, objects, and rule definitions
 */

const SIMULATOR_CONFIG = {
    // Grid configuration
    grid: {
        rows: 10,
        cols: 12,
        cellSize: 50, // in pixels
    },
    
    // Room objects
    objects: {
        door: {
            id: "door",
            name: "Door",
            icon: "📪", // Using emoji for now, can be replaced with SVG path
            width: 1,
            height: 2,
            maxPerRoom: 1,
            description: "Must be in open, non-blocked position with no adjacent walls",
            defaultPosition: null, // Optional default position
        },
        bed: {
            id: "bed",
            name: "Bed",
            icon: "🛏️",
            width: 2,
            height: 3,
            maxPerRoom: 1,
            description: "Should not face door; must have view of door; not under window",
            defaultPosition: null,
        },
        mirror: {
            id: "mirror",
            name: "Mirror",
            icon: "🪞",
            width: 2,
            height: 1,
            maxPerRoom: 2,
            description: "Should not face bed or door; not above bed",
            defaultPosition: null,
        },
        window: {
            id: "window",
            name: "Window",
            icon: "🪟",
            width: 2,
            height: 1,
            maxPerRoom: 2,
            description: "Not directly behind bed or mirror",
            defaultPosition: null,
        },
        desk: {
            id: "desk",
            name: "Desk",
            icon: "🪑",
            width: 2,
            height: 1,
            maxPerRoom: 1,
            description: "Can go anywhere",
            defaultPosition: null,
        }
    },
    
    // Wall positions - preset walls in the room
    walls: [
        // Top wall
        { row: 0, col: 0, width: 12, height: 1 },
        // Left wall
        { row: 0, col: 0, width: 1, height: 10 },
        // Right wall
        { row: 0, col: 11, width: 1, height: 10 },
        // Bottom wall segments
        { row: 9, col: 0, width: 5, height: 1 },
        { row: 9, col: 7, width: 5, height: 1 },
        // Door opening is at bottom wall between col 5-7
    ],
    
    // Feng Shui rules
    rules: [
        {
            id: "door_placement",
            description: "Door must be in an open, non-blocked position",
            appliesTo: ["door"],
            severity: "error",
        },
        {
            id: "bed_door_relation",
            description: "Bed should not directly face the door",
            appliesTo: ["bed", "door"],
            severity: "error",
        },
        {
            id: "bed_window_relation",
            description: "Bed should not be placed under a window",
            appliesTo: ["bed", "window"],
            severity: "error",
        },
        {
            id: "mirror_bed_relation",
            description: "Mirror should not directly face the bed",
            appliesTo: ["mirror", "bed"],
            severity: "error",
        },
        {
            id: "mirror_door_relation",
            description: "Mirror should not directly face the door",
            appliesTo: ["mirror", "door"],
            severity: "error",
        },
        {
            id: "window_placement",
            description: "Window should not be directly behind bed or mirror",
            appliesTo: ["window", "bed", "mirror"],
            severity: "error",
        }
    ]
}; 