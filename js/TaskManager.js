export class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
    }

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

    deleteTask(taskId) {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        return this.tasks.length < initialLength;
    }

    toggleComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            return task;
        }
        return null;
    }

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

    getTasks() {
        return this.tasks;
    }

    setTasks(tasks) {
        this.tasks = tasks || [];
        this.taskIdCounter = this.getNextId();
    }

    getNextId() {
        const maxId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) : 0;
        return maxId + 1;
    }
}