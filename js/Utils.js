export class Utils {
    static formatDueDate(dueDate) {
        const today = new Date();
        const due = new Date(dueDate);
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);
        
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let className = 'task-due-date';
        let text = `Due: ${due.toLocaleDateString()}`;
        
        if (diffDays < 0) {
            className += ' overdue';
            text = `Overdue: ${due.toLocaleDateString()}`;
        } else if (diffDays === 0) {
            className += ' due-today';
            text = `Due Today: ${due.toLocaleDateString()}`;
        }
        
        return `<div class="${className}">${text}</div>`;
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static validateTaskText(text) {
        if (!text || typeof text !== 'string') {
            return false;
        }
        return text.trim().length > 0;
    }

    static isValidDate(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    static generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static showNotification(message, type = 'info') {
        // Simple alert for now, could be enhanced with custom notifications
        if (type === 'error') {
            alert(`Error: ${message}`);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}