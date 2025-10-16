// Storage utility functions
const Storage = {
    KEY: 'campusLifePlanner_tasks',

    // Get all tasks from localStorage
    getTasks() {
        const tasks = localStorage.getItem(this.KEY);
        return tasks ? JSON.parse(tasks) : [];
    },

    // Save tasks to localStorage
    saveTasks(tasks) {
        localStorage.setItem(this.KEY, JSON.stringify(tasks));
    },

    // Add a new task
    addTask(task) {
        const tasks = this.getTasks();
        task.id = `rec_${String(tasks.length + 1).padStart(3, '0')}`;
        task.createdAt = new Date().toISOString();
        task.updatedAt = task.createdAt;
        tasks.push(task);
        this.saveTasks(tasks);
        return task;
    },

    // Update an existing task
    updateTask(taskId, updatedTask) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            updatedTask.updatedAt = new Date().toISOString();
            tasks[index] = { ...tasks[index], ...updatedTask };
            this.saveTasks(tasks);
            return tasks[index];
        }
        return null;
    },

    // Delete a task
    deleteTask(taskId) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        this.saveTasks(filteredTasks);
    },

    // Import data from JSON
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (Array.isArray(data)) {
                this.saveTasks(data);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },

    // Export data as JSON
    exportData() {
        const tasks = this.getTasks();
        return JSON.stringify(tasks, null, 2);
    }
};