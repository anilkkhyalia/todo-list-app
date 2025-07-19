import { TaskManager } from './TaskManager.js';
import { UIManager } from './UIManager.js';
import { StorageManager } from './StorageManager.js';
import { Utils } from './Utils.js';

class TodoApp {
    constructor() {
        this.taskManager = new TaskManager();
        this.uiManager = new UIManager();
        this.storageManager = new StorageManager();
        
        this.init();
    }

    async init() {
        // Load saved tasks
        const savedTasks = this.storageManager.loadTasks();
        this.taskManager.setTasks(savedTasks);

        // Initialize UI
        this.uiManager.init();
        this.bindEvents();
        
        // Initial render
        this.renderTasks();
    }

    bindEvents() {
        this.uiManager.bindEvents({
            onAdd: () => this.addTask(),
            onFilterChange: (filter) => this.setFilter(filter)
        });
    }

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

    deleteTask(taskId) {
        const success = this.taskManager.deleteTask(taskId);
        if (success) {
            this.saveAndRender();
        }
    }

    toggleComplete(taskId) {
        const task = this.taskManager.toggleComplete(taskId);
        if (task) {
            this.saveAndRender();
        }
    }

    editTask(taskId) {
        this.uiManager.showEditMode(taskId);
    }

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

    setFilter(filter) {
        this.uiManager.setFilter(filter);
        this.renderTasks();
    }

    renderTasks() {
        const currentFilter = this.uiManager.getCurrentFilter();
        const filteredTasks = this.taskManager.getFilteredTasks(currentFilter);
        
        this.uiManager.renderTasks(
            filteredTasks,
            (id) => this.editTask(id),
            (id) => this.saveTask(id),
            (id) => this.toggleComplete(id),
            (id) => this.deleteTask(id)
        );
    }

    saveAndRender() {
        this.storageManager.saveTasks(this.taskManager.getTasks());
        this.renderTasks();
    }

    // Export methods for global access (for onclick handlers)
    exportGlobalMethods() {
        window.todoApp = {
            addTask: () => this.addTask(),
            deleteTask: (id) => this.deleteTask(id),
            toggleComplete: (id) => this.toggleComplete(id),
            editTask: (id) => this.editTask(id),
            saveTask: (id) => this.saveTask(id)
        };
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
    app.exportGlobalMethods();
    
    // Also make sure the app instance is globally accessible
    window.app = app;
});