document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach(task => addTaskToDOM(task));
    };

    const addTaskToDOM = (task) => {
        const li = document.createElement("li");
        li.className = task.completed ? 'completed' : '';
        
        const span = document.createElement("span");
        span.textContent = task.text;
        span.onclick = () => toggleComplete(task.id, li);

        const timer = document.createElement("div");
        timer.className = "timer";
        timer.dataset.createdAt = task.createdAt;

        const actions = document.createElement("div");
        actions.className = "actions";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.onclick = () => deleteTask(task.id, li);

        actions.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(actions);
        li.appendChild(timer);
        taskList.appendChild(li);

        setTimeout(() => li.style.transform = "translateY(0)", 10);
    };

    const addTask = () => {
        const text = taskInput.value.trim();
        if (!text) return;

        const task = { id: Date.now(), text, createdAt: Date.now(), completed: false };
        tasks.push(task);
        saveTasks();
        addTaskToDOM(task);
        taskInput.value = "";
    };

    const toggleComplete = (id, li) => {
        tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
        saveTasks();
        li.classList.toggle('completed');
    };

    const deleteTask = (id, li) => {
        li.style.opacity = "0";
        li.style.transform = "translateX(-100%)";
        setTimeout(() => {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        }, 300);
    };

    const updateTimers = () => {
        document.querySelectorAll(".timer").forEach(timer => {
            const start = parseInt(timer.dataset.createdAt);
            timer.textContent = formatElapsedTime(start);
        });
    };

    const formatElapsedTime = (start) => {
        const diff = Math.floor((Date.now() - start) / 1000);
        const days = String(Math.floor(diff / 86400)).padStart(2, '0');
        const hours = String(Math.floor((diff % 86400) / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const seconds = String(diff % 60).padStart(2, '0');
        return `${days}d ${hours}:${minutes}:${seconds}`;
    };

    addTaskBtn.onclick = addTask;
    taskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());
    setInterval(updateTimers, 1000);
    renderTasks();
});
