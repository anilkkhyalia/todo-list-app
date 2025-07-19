import { Utils } from './Utils.js';

export class UIManager {
    constructor() {
        this.taskInput = null;
        this.dueDateInput = null;
        this.addBtn = null;
        this.taskList = null;
        this.filterBtns = null;
        this.currentFilter = 'all';
    }

    init() {
        this.taskInput = document.getElementById('taskInput');
        this.dueDateInput = document.getElementById('dueDateInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    getTaskInput() {
        return {
            text: this.taskInput.value.trim(),
            dueDate: this.dueDateInput.value
        };
    }

    clearInputs() {
        this.taskInput.value = '';
        this.dueDateInput.value = '';
    }

    renderTasks(tasks, onEdit, onSave, onToggleComplete, onDelete) {
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

    getCurrentFilter() {
        return this.currentFilter;
    }

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

    hideEditMode(taskId) {
        const taskItem = document.querySelector(`[onclick*="saveTask(${taskId})"]`);
        if (taskItem) {
            const container = taskItem.closest('.task-item');
            container.classList.remove('editing');
        }
    }

    getEditedTaskText(taskId) {
        const taskItem = document.querySelector(`[onclick*="saveTask(${taskId})"]`);
        if (taskItem) {
            const container = taskItem.closest('.task-item');
            const input = container.querySelector('.task-edit-input');
            return input ? input.value.trim() : '';
        }
        return '';
    }

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