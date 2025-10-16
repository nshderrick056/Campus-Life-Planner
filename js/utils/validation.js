// Validation patterns and utility functions
const Validation = {
    patterns: {
        // Title: no leading/trailing spaces
        title: /^\S(?:.*\S)?$/,
        
        // Duration: positive number with optional decimal
        duration: /^([1-9]\d*)(.\d{1,2})?$/,
        
        // Date: YYYY-MM-DD format
        date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
        
        // Tag: letters, spaces, or hyphens
        tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
        
        // Advanced patterns
        duplicateWords: /\b(\w+)\s+\1\b/,
        timeFormat: /\b\d{2}:\d{2}\b/
    },

    // Validate task title
    validateTitle(title) {
        return this.patterns.title.test(title);
    },

    // Validate duration
    validateDuration(duration) {
        return this.patterns.duration.test(String(duration));
    },

    // Validate date
    validateDate(date) {
        if (!this.patterns.date.test(date)) return false;
        
        // Check if it's a valid date
        const d = new Date(date);
        return d instanceof Date && !isNaN(d);
    },

    // Validate tag
    validateTag(tag) {
        return this.patterns.tag.test(tag);
    },

    // Check for duplicate words
    hasDuplicateWords(text) {
        return this.patterns.duplicateWords.test(text);
    },

    // Extract time tokens
    extractTimeTokens(text) {
        return text.match(this.patterns.timeFormat) || [];
    },

    // Validate entire task object
    validateTask(task) {
        const errors = [];

        if (!this.validateTitle(task.title)) {
            errors.push('Invalid title format');
        }

        if (!this.validateDuration(task.duration)) {
            errors.push('Invalid duration');
        }

        if (!this.validateDate(task.dueDate)) {
            errors.push('Invalid date format');
        }

        if (!this.validateTag(task.tag)) {
            errors.push('Invalid tag format');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};