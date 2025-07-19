export class StorageManager {
    constructor() {
        this.TASKS_KEY = 'todoTasks';
        this.COUNTER_KEY = 'todoTaskIdCounter';
    }

    saveTasks(tasks) {
        try {
            localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
            return true;
        } catch (error) {
            console.error('Failed to save tasks:', error);
            return false;
        }
    }

    loadTasks() {
        try {
            const saved = localStorage.getItem(this.TASKS_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load tasks:', error);
            return [];
        }
    }

    saveTaskCounter(counter) {
        try {
            localStorage.setItem(this.COUNTER_KEY, counter.toString());
            return true;
        } catch (error) {
            console.error('Failed to save task counter:', error);
            return false;
        }
    }

    loadTaskCounter() {
        try {
            const saved = localStorage.getItem(this.COUNTER_KEY);
            return saved ? parseInt(saved, 10) : 1;
        } catch (error) {
            console.error('Failed to load task counter:', error);
            return 1;
        }
    }

    clearAll() {
        try {
            localStorage.removeItem(this.TASKS_KEY);
            localStorage.removeItem(this.COUNTER_KEY);
            return true;
        } catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    }

    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    }
}