const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const prioritySelect = document.getElementById("priority");
const dateInput = document.getElementById("task-date"); // deadline field

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function saveTasksToLocal() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
  });

  filteredTasks.forEach(task => {
    const taskEl = document.createElement("div");
    taskEl.classList.add("task-item");
    if (task.completed) taskEl.classList.add("completed");

    const priorityColor = {
      low: "#16a34a",
      medium: "#eab308",
      high: "#dc2626"
    };

    taskEl.innerHTML = `
      <div class="task-content">
        <span class="task-text">${task.text}</span>
        <span class="priority-tag" style="background:${priorityColor[task.priority]}">${task.priority}</span>
        ${task.deadline ? `<span class="deadline-tag">Due: ${task.deadline}</span>` : ""}
      </div>
      <div class="task-actions">
        <button class="complete-btn"><i class="fas fa-check"></i></button>
        <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;

    // ✅ Complete task logic
    taskEl.querySelector(".complete-btn").onclick = () => {
      task.completed = !task.completed;
      saveTasksToLocal();
      renderTasks();


      if(task.completed) {
        confetti({
            particleCount:120,
            spread:80,
            startVelocity:35,
            origin:{ y: 0.6 },
            colors: ['#8b5cf6','#facc15','4ade80']
        });
      }
    };

    // ❌ Delete task logic
    taskEl.querySelector(".delete-btn").onclick = () => {
    taskEl.classList.add("deleting"); // add fade class
    setTimeout(() => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasksToLocal();
        renderTasks();
    }, 500); // wait for animation before removing
    };

    taskList.appendChild(taskEl);
  });
}

// 🚀 Add New Task
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;
  const deadline = dateInput ? dateInput.value : null;

  if (text !== "") {
    const newTask = {
      id: Date.now(),
      text,
      priority,
      completed: false,
      deadline
    };

    tasks.push(newTask);
    saveTasksToLocal();
    renderTasks();
    taskForm.reset();
  }
});

// 🔘 Filter Buttons
document.getElementById("all-btn").addEventListener("click", () => {
  filter = "all";
  renderTasks();
});
document.getElementById("active-btn").addEventListener("click", () => {
  filter = "active";
  renderTasks();
});
document.getElementById("completed-btn").addEventListener("click", () => {
  filter = "completed";
  renderTasks();
});

// 🌗 Theme Toggle
document.getElementById("theme-btn").addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

// 📦 Initialize
renderTasks();