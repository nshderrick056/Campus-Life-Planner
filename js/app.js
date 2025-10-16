// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle logic
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('clp_theme');
    function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('clp_theme', theme);
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            themeToggleBtn.title = 'Switch to light mode';
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            themeToggleBtn.title = 'Switch to dark mode';
        }
    }
    // Set initial theme
    setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
    themeToggleBtn.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });

    // Initialize the application
    const App = {
        init() {
            this.initializeEventListeners();
            this.loadInitialData();
            this.updateDashboard();
            this.initSettings();
        },

        initializeEventListeners() {
            // Duration format change
            const durationFormatSelect = document.getElementById('durationFormat');
            if (durationFormatSelect) {
                durationFormatSelect.addEventListener('change', (e) => {
                    localStorage.setItem('clp_duration_format', e.target.value);
                    this.displayTasks();
                    this.updateDashboard();
                });
            }
            // Mobile menu toggle
            const menuToggle = document.querySelector('.menu-toggle');
            const navLinks = document.querySelector('.nav-links');
            
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                navLinks.classList.toggle('active');
                menuToggle.querySelector('i').classList.toggle('fa-bars');
                menuToggle.querySelector('i').classList.toggle('fa-times');
            });

            // Navigation
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateToPage(e.target.dataset.page);
                    // Close mobile menu when a link is clicked
                    if (window.innerWidth <= 768) {
                        navLinks.classList.remove('active');
                        menuToggle.setAttribute('aria-expanded', 'false');
                        menuToggle.querySelector('i').classList.add('fa-bars');
                        menuToggle.querySelector('i').classList.remove('fa-times');
                    }
                });
            });

            // Task form
            document.getElementById('addNewTask').addEventListener('click', () => this.showTaskModal());
            document.getElementById('taskForm').addEventListener('submit', (e) => this.handleTaskSubmit(e));
            document.getElementById('cancelTask').addEventListener('click', () => this.hideTaskModal());

            // Search
            document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));

            // Settings
            document.getElementById('exportData').addEventListener('click', () => this.exportData());
            document.getElementById('importData').addEventListener('click', () => this.importData());
        },

        loadInitialData() {
            // Load seed data if no data exists
            if (!localStorage.getItem(Storage.KEY)) {
                fetch('seed.json')
                    .then(response => response.json())
                    .then(data => {
                        Storage.saveTasks(data);
                        this.updateDashboard();
                        this.displayTasks();
                    })
                    .catch(error => console.error('Error loading seed data:', error));
            } else {
                this.displayTasks();
            }
        },

        navigateToPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });

            // Show selected page
            document.getElementById(pageId).classList.add('active');

            // Update navigation
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.toggle('active', link.dataset.page === pageId);
            });
        },

        updateDashboard() {
            const tasks = Storage.getTasks();
            
            // Update total tasks
            document.getElementById('totalTasks').textContent = tasks.length;

            // Update total duration
            const durationFormat = localStorage.getItem('clp_duration_format') || 'minutes';
            const totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0);
            let totalDurationDisplay = `${totalDuration} mins`;
            if (durationFormat === 'hours') {
                const hours = (totalDuration / 60);
                totalDurationDisplay = `${hours % 1 === 0 ? hours : hours.toFixed(2)} hrs`;
            }
            document.getElementById('totalDuration').textContent = totalDurationDisplay;

            // Update most used tag
            const tagCounts = tasks.reduce((acc, task) => {
                acc[task.tag] = (acc[task.tag] || 0) + 1;
                return acc;
            }, {});

            const mostUsedTag = Object.entries(tagCounts)
                .sort(([,a], [,b]) => b - a)[0];
            
            document.getElementById('mostUsedTag').textContent = mostUsedTag ? mostUsedTag[0] : '-';

            // Update recent activities
            const recentTasks = [...tasks]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            function formatDurationHrsMins(mins) {
                if (mins >= 60) {
                    const h = Math.floor(mins / 60);
                    const m = mins % 60;
                    return m === 0 ? `${h} hr${h > 1 ? 's' : ''}` : `${h} hr${h > 1 ? 's' : ''} ${m} min${m > 1 ? 's' : ''}`;
                }
                return `${mins} min${mins !== 1 ? 's' : ''}`;
            }

            const recentList = document.getElementById('recentActivitiesList');
            recentList.innerHTML = recentTasks.map(task => `
                <div class="activity-card">
                    <h4>${task.title}</h4>
                    <p>${task.tag} - ${formatDurationHrsMins(task.duration)}</p>
                </div>
            `).join('');
        },

        displayTasks(filteredTasks = null) {
            const tasks = filteredTasks || Storage.getTasks();
            const container = document.getElementById('tasksContainer');
            const durationFormat = localStorage.getItem('clp_duration_format') || 'minutes';
            function formatDurationHrsMins(mins) {
                if (mins >= 60) {
                    const h = Math.floor(mins / 60);
                    const m = mins % 60;
                    return m === 0 ? `${h} hr${h > 1 ? 's' : ''}` : `${h} hr${h > 1 ? 's' : ''} ${m} min${m > 1 ? 's' : ''}`;
                }
                return `${mins} min${mins !== 1 ? 's' : ''}`;
            }
            container.innerHTML = tasks.map(task => `
                <div class="task-card" data-id="${task.id}">
                    <h3>${task.title}</h3>
                    <p><strong>Due:</strong> ${task.dueDate}</p>
                    <p><strong>Duration:</strong> ${formatDurationHrsMins(task.duration)}</p>
                    <p><strong>Tag:</strong> ${task.tag}</p>
                    <div class="task-actions">
                        <button onclick="App.editTask('${task.id}')" class="secondary-btn">
                            <i class="fas fa-edit" aria-hidden="true"></i> Edit
                        </button>
                        <button onclick="App.deleteTask('${task.id}')" class="secondary-btn">
                            <i class="fas fa-trash" aria-hidden="true"></i> Delete
                        </button>
                    </div>
                </div>
            `).join('');
        },
        // Initialize settings UI from localStorage
        initSettings() {
            const durationFormat = localStorage.getItem('clp_duration_format') || 'minutes';
            const durationFormatSelect = document.getElementById('durationFormat');
            if (durationFormatSelect) {
                durationFormatSelect.value = durationFormat;
            }
        },

        showTaskModal(taskId = null) {
            const modal = document.getElementById('taskModal');
            const form = document.getElementById('taskForm');
            
            if (taskId) {
                const task = Storage.getTasks().find(t => t.id === taskId);
                if (task) {
                    form.elements.taskTitle.value = task.title;
                    form.elements.taskDuration.value = task.duration;
                    form.elements.taskTag.value = task.tag;
                    form.elements.taskDueDate.value = task.dueDate;
                    form.dataset.taskId = taskId;
                }
            } else {
                form.reset();
                delete form.dataset.taskId;
            }

            modal.classList.add('active');
        },

        hideTaskModal() {
            const modal = document.getElementById('taskModal');
            modal.classList.remove('active');
        },

        handleTaskSubmit(e) {
            e.preventDefault();
            const form = e.target;
            // Trim whitespace from all string fields
            const title = form.elements.taskTitle.value.trim();
            const tag = form.elements.taskTag.value.trim();
            const dueDate = form.elements.taskDueDate.value.trim();
            const duration = parseInt(form.elements.taskDuration.value);
            const taskData = {
                title,
                duration,
                tag,
                dueDate
            };

            const validation = Validation.validateTask(taskData);
            if (!validation.isValid) {
                alert(validation.errors.join('\n'));
                return;
            }

            if (form.dataset.taskId) {
                Storage.updateTask(form.dataset.taskId, taskData);
            } else {
                Storage.addTask(taskData);
            }

            this.hideTaskModal();
            this.updateDashboard();
            this.displayTasks();
        },

        editTask(taskId) {
            this.showTaskModal(taskId);
        },

        deleteTask(taskId) {
            if (confirm('Are you sure you want to delete this task?')) {
                Storage.deleteTask(taskId);
                this.updateDashboard();
                this.displayTasks();
            }
        },

        handleSearch(query) {
            if (!query.trim()) {
                this.displayTasks();
                return;
            }

            try {
                const regex = new RegExp(query, 'i');
                const tasks = Storage.getTasks();
                const filteredTasks = tasks.filter(task => 
                    regex.test(task.title) || 
                    regex.test(task.tag)
                );
                this.displayTasks(filteredTasks);
            } catch (error) {
                console.error('Invalid regex:', error);
            }
        },

        exportData() {
            const data = Storage.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'campus-life-planner-data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        importData() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = e => {
                const file = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = event => {
                    const success = Storage.importData(event.target.result);
                    if (success) {
                        alert('Data imported successfully!');
                        this.updateDashboard();
                        this.displayTasks();
                    } else {
                        alert('Error importing data. Please check the file format.');
                    }
                };
                
                reader.readAsText(file);
            };
            
            input.click();
        }
    };

    // Make App accessible globally
    window.App = App;
    
    // Initialize the application
    App.init();
});