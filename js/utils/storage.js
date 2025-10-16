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

    // Import data from JSON and append
    importData(jsonData) {
        try {
            const importedTasks = JSON.parse(jsonData);
            if (!Array.isArray(importedTasks)) return false;

            const existingTasks = this.getTasks();

            // Find the next available ID number
            const existingIds = existingTasks.map(t => parseInt(t.id.replace('rec_', ''), 10));
            const nextIdNum = existingIds.length ? Math.max(...existingIds) + 1 : 1;

            // Map imported tasks to include new IDs and timestamps
            const tasksToAdd = importedTasks.map((task, index) => ({
                ...task,
                id: `rec_${String(nextIdNum + index).padStart(3, '0')}`,
                createdAt: task.createdAt || new Date().toISOString(),
                updatedAt: task.updatedAt || new Date().toISOString()
            }));

            // Append imported tasks
            const updatedTasks = [...existingTasks, ...tasksToAdd];
            this.saveTasks(updatedTasks);

            return true;
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