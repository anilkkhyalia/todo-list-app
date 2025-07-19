/**
 * Utility class containing helper functions for the Todo App
 */
class Utils {
    /**
     * Formats a due date into HTML with appropriate styling classes
     * @param {string} dueDate - ISO date string representing the due date
     * @returns {string} HTML string with formatted due date and styling classes
     */
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

    /**
     * Escapes HTML characters in text to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string} HTML-escaped text
     */
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Validates that task text is not empty and is a valid string
     * @param {string} text - Text to validate
     * @returns {boolean} True if text is valid, false otherwise
     */
    static validateTaskText(text) {
        if (!text || typeof text !== 'string') {
            return false;
        }
        return text.trim().length > 0;
    }

    /**
     * Shows a notification to the user
     * @param {string} message - Message to display
     * @param {string} type - Type of notification ('info', 'error', etc.)
     */
    static showNotification(message, type = 'info') {
        if (type === 'error') {
            alert(`Error: ${message}`);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

/**
 * Manages localStorage operations for task persistence
 */
class StorageManager {
    /**
     * Creates a new StorageManager instance
     */
    constructor() {
        this.TASKS_KEY = 'todoTasks';
        this.COUNTER_KEY = 'todoTaskIdCounter';
    }

    /**
     * Saves tasks array to localStorage
     * @param {Array} tasks - Array of task objects to save
     * @returns {boolean} True if save was successful, false otherwise
     */
    saveTasks(tasks) {
        try {
            localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
            return true;
        } catch (error) {
            console.error('Failed to save tasks:', error);
            return false;
        }
    }

    /**
     * Loads tasks from localStorage
     * @returns {Array} Array of task objects, empty array if none found or error occurs
     */
    loadTasks() {
        try {
            const saved = localStorage.getItem(this.TASKS_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load tasks:', error);
            return [];
        }
    }
}

/**
 * Manages task data and operations (CRUD operations)
 */
class TaskManager {
    /**
     * Creates a new TaskManager instance
     */
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
    }

    /**
     * Adds a new task to the task list
     * @param {string} text - The task description
     * @param {string|null} dueDate - Optional due date in ISO format
     * @returns {Object} The created task object
     * @throws {Error} If task text is empty
     */
    addTask(text, dueDate = null) {
        if (!text || text.trim() === '') {
            throw new Error('Task text cannot be empty');
        }

        const task = {
            id: this.taskIdCounter++,
            text: text.trim(),
            completed: false,
            dueDate: dueDate || null,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        return task;
    }

    /**
     * Deletes a task by ID
     * @param {number} taskId - ID of the task to delete
     * @returns {boolean} True if task was deleted, false if not found
     */
    deleteTask(taskId) {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        return this.tasks.length < initialLength;
    }

    /**
     * Toggles the completion status of a task
     * @param {number} taskId - ID of the task to toggle
     * @returns {Object|null} The updated task object or null if not found
     */
    toggleComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            return task;
        }
        return null;
    }

    /**
     * Edits the text of an existing task
     * @param {number} taskId - ID of the task to edit
     * @param {string} newText - New text for the task
     * @returns {Object|null} The updated task object or null if not found
     * @throws {Error} If new text is empty
     */
    editTask(taskId, newText) {
        if (!newText || newText.trim() === '') {
            throw new Error('Task text cannot be empty');
        }

        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.text = newText.trim();
            return task;
        }
        return null;
    }

    /**
     * Returns tasks filtered by completion status
     * @param {string} filter - Filter type: 'all', 'active', or 'completed'
     * @returns {Array} Filtered array of task objects
     */
    getFilteredTasks(filter = 'all') {
        switch (filter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    /**
     * Returns all tasks
     * @returns {Array} Array of all task objects
     */
    getTasks() {
        return this.tasks;
    }

    /**
     * Sets the tasks array and updates the ID counter
     * @param {Array} tasks - Array of task objects to set
     */
    setTasks(tasks) {
        this.tasks = tasks || [];
        this.taskIdCounter = this.getNextId();
    }

    /**
     * Calculates the next available task ID
     * @returns {number} Next ID to use for new tasks
     */
    getNextId() {
        const maxId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) : 0;
        return maxId + 1;
    }
}

/**
 * Manages user interface elements and DOM manipulation
 */
class UIManager {
    /**
     * Creates a new UIManager instance
     */
    constructor() {
        this.taskInput = null;
        this.dueDateInput = null;
        this.addBtn = null;
        this.taskList = null;
        this.filterBtns = null;
        this.currentFilter = 'all';
    }

    /**
     * Initializes UI elements by getting DOM references
     */
    init() {
        this.taskInput = document.getElementById('taskInput');
        this.dueDateInput = document.getElementById('dueDateInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    /**
     * Gets the current values from the task input fields
     * @returns {Object} Object containing text and dueDate values
     */
    getTaskInput() {
        return {
            text: this.taskInput.value.trim(),
            dueDate: this.dueDateInput.value
        };
    }

    /**
     * Clears the task input fields
     */
    clearInputs() {
        this.taskInput.value = '';
        this.dueDateInput.value = '';
    }

    /**
     * Renders the task list in the DOM
     * @param {Array} tasks - Array of task objects to render
     */
    renderTasks(tasks) {
        this.taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            const dueDateHtml = task.dueDate ? Utils.formatDueDate(task.dueDate) : '';
            
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="todoApp.toggleComplete(${task.id})">
                <div class="task-content">
                    <span class="task-text">${Utils.escapeHtml(task.text)}</span>
                    <input type="text" class="task-edit-input" value="${Utils.escapeHtml(task.text)}">
                    ${dueDateHtml}
                </div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="todoApp.editTask(${task.id})">Edit</button>
                    <button class="save-btn" onclick="todoApp.saveTask(${task.id})">Save</button>
                    <button class="delete-btn" onclick="todoApp.deleteTask(${task.id})">
                        Delete
                    </button>
                </div>
            `;

            this.taskList.appendChild(li);
        });
    }

    /**
     * Sets the current filter and updates UI to reflect active filter
     * @param {string} filter - Filter type: 'all', 'active', or 'completed'
     */
    setFilter(filter) {
        this.currentFilter = filter;
        
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    /**
     * Gets the currently active filter
     * @returns {string} Current filter type
     */
    getCurrentFilter() {
        return this.currentFilter;
    }

    /**
     * Shows the edit mode for a specific task
     * @param {number} taskId - ID of the task to edit
     */
    showEditMode(taskId) {
        const taskItem = document.querySelector(`[onclick*="saveTask(${taskId})"]`);
        if (taskItem) {
            const container = taskItem.closest('.task-item');
            container.classList.add('editing');
            const input = container.querySelector('.task-edit-input');
            if (input) {
                input.focus();
            }
        }
    }

    /**
     * Hides the edit mode for a specific task
     * @param {number} taskId - ID of the task to stop editing
     */
    hideEditMode(taskId) {
        const taskItem = document.querySelector(`[onclick*="saveTask(${taskId})"]`);
        if (taskItem) {
            const container = taskItem.closest('.task-item');
            container.classList.remove('editing');
        }
    }

    /**
     * Gets the edited text from a task's edit input field
     * @param {number} taskId - ID of the task being edited
     * @returns {string} The edited text, or empty string if not found
     */
    getEditedTaskText(taskId) {
        const taskItem = document.querySelector(`[onclick*="saveTask(${taskId})"]`);
        if (taskItem) {
            const container = taskItem.closest('.task-item');
            const input = container.querySelector('.task-edit-input');
            return input ? input.value.trim() : '';
        }
        return '';
    }

    /**
     * Binds event handlers to UI elements
     * @param {Object} handlers - Object containing event handler functions
     * @param {Function} handlers.onAdd - Handler for adding new tasks
     * @param {Function} handlers.onFilterChange - Handler for filter changes
     */
    bindEvents(handlers) {
        if (this.addBtn && handlers.onAdd) {
            this.addBtn.addEventListener('click', handlers.onAdd);
        }

        if (this.taskInput && handlers.onAdd) {
            this.taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handlers.onAdd();
                }
            });
        }

        if (this.filterBtns && handlers.onFilterChange) {
            this.filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    handlers.onFilterChange(e.target.dataset.filter);
                });
            });
        }
    }
}

/**
 * Main TodoApp class that coordinates all other components
 */
class TodoApp {
    /**
     * Creates a new TodoApp instance and initializes all components
     */
    constructor() {
        this.taskManager = new TaskManager();
        this.uiManager = new UIManager();
        this.storageManager = new StorageManager();
        
        this.init();
    }

    /**
     * Initializes the application by loading saved data and setting up UI
     */
    async init() {
        const savedTasks = this.storageManager.loadTasks();
        this.taskManager.setTasks(savedTasks);

        this.uiManager.init();
        this.bindEvents();
        
        this.renderTasks();
    }

    /**
     * Binds event handlers for the application
     */
    bindEvents() {
        this.uiManager.bindEvents({
            onAdd: () => this.addTask(),
            onFilterChange: (filter) => this.setFilter(filter)
        });
    }

    /**
     * Adds a new task from user input
     */
    addTask() {
        try {
            const input = this.uiManager.getTaskInput();
            
            if (!Utils.validateTaskText(input.text)) {
                Utils.showNotification('Please enter a task!', 'error');
                return;
            }

            const task = this.taskManager.addTask(input.text, input.dueDate);
            this.uiManager.clearInputs();
            this.saveAndRender();
            
        } catch (error) {
            Utils.showNotification(error.message, 'error');
        }
    }

    /**
     * Deletes a task by ID
     * @param {number} taskId - ID of the task to delete
     */
    deleteTask(taskId) {
        const success = this.taskManager.deleteTask(taskId);
        if (success) {
            this.saveAndRender();
        }
    }

    /**
     * Toggles the completion status of a task
     * @param {number} taskId - ID of the task to toggle
     */
    toggleComplete(taskId) {
        const task = this.taskManager.toggleComplete(taskId);
        if (task) {
            this.saveAndRender();
        }
    }

    /**
     * Enters edit mode for a specific task
     * @param {number} taskId - ID of the task to edit
     */
    editTask(taskId) {
        this.uiManager.showEditMode(taskId);
    }

    /**
     * Saves the edited text for a task
     * @param {number} taskId - ID of the task to save
     */
    saveTask(taskId) {
        try {
            const newText = this.uiManager.getEditedTaskText(taskId);
            
            if (!Utils.validateTaskText(newText)) {
                Utils.showNotification('Task cannot be empty!', 'error');
                return;
            }

            const task = this.taskManager.editTask(taskId, newText);
            if (task) {
                this.uiManager.hideEditMode(taskId);
                this.saveAndRender();
            }
            
        } catch (error) {
            Utils.showNotification(error.message, 'error');
        }
    }

    /**
     * Sets the current task filter
     * @param {string} filter - Filter type: 'all', 'active', or 'completed'
     */
    setFilter(filter) {
        this.uiManager.setFilter(filter);
        this.renderTasks();
    }

    /**
     * Renders tasks based on the current filter
     */
    renderTasks() {
        const currentFilter = this.uiManager.getCurrentFilter();
        const filteredTasks = this.taskManager.getFilteredTasks(currentFilter);
        
        this.uiManager.renderTasks(filteredTasks);
    }

    /**
     * Saves tasks to storage and re-renders the UI
     */
    saveAndRender() {
        this.storageManager.saveTasks(this.taskManager.getTasks());
        this.renderTasks();
    }
}

/**
 * Initialize the app when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
    
    // Export methods for global access (for onclick handlers)
    window.todoApp = {
        addTask: () => app.addTask(),
        deleteTask: (id) => app.deleteTask(id),
        toggleComplete: (id) => app.toggleComplete(id),
        editTask: (id) => app.editTask(id),
        saveTask: (id) => app.saveTask(id)
    };
    
    window.app = app;
});