console.log("Script loaded");
const titleInput = document.getElementById("titleInput");
const estimatedPomodorosInput = document.getElementById("estimatedPomodorosInput");
const createBtn = document.getElementById("createBtn");

const API_URL = "/tasks";

function validateInput() {
  const title = titleInput.value.trim();
  const estimatedPomodoros = Number(estimatedPomodorosInput.value);

  const isTitleValid = title !== "";
  const isPomodorosValid =
    !Number.isNaN(estimatedPomodoros) && estimatedPomodoros > 0;

  createBtn.disabled = !(isTitleValid && isPomodorosValid);
}

titleInput.addEventListener("input", validateInput);
estimatedPomodorosInput.addEventListener("input", validateInput);

async function loadTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();
  console.log(tasks);
  const taskList = document.getElementById("taskList");

  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    let statusTexto; 
    if (task.status === 'PENDING') statusTexto = 'Pendiente';
    else if (task.status === 'IN_PROGRESS') statusTexto = 'En progreso';
    else statusTexto  = 'Completada';

    li.innerHTML = `
                <div class ="task-title">${task.title}</div>

                <div class="task-progress">
                  ${task.completedPomodoros} / ${task.estimatedPomodoros} pomodoros
                </div>

                <div class="task-status">
                  ${statusTexto}
                </div>

                <button class="pomodoro-btn">
                   +1 Pomodoro
                </button>
                `;

    li.dataset.status = task.status;

    const btn = li.querySelector(".pomodoro-btn");

    if (task.status === "COMPLETED") {
      btn.disabled = true;
    }

    btn.addEventListener("click", () => completePomodoro(task.id));

    taskList.appendChild(li);
  });
}

async function completePomodoro(id) {
  await fetch(`${API_URL}/${id}/pomodoro`, {
    method: "POST",
  });

  loadTasks();
}

document.getElementById("createBtn").addEventListener("click", createTask);

async function createTask() {
  const title = titleInput.value.trim();
  const estimatedPomodoros = Number(estimatedPomodorosInput.value);
  if (title.trim() === "") {
    alert("Please enter a task title.");
    return;
  }

  if (
    estimatedPomodorosInput.value.trim() === "" ||
    Number.isNaN(estimatedPomodoros) ||
    estimatedPomodoros <= 0
  ) {
    alert("Please enter a valid number of estimated pomodoros.");
    return;
  }
  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      estimatedPomodoros: estimatedPomodoros,
    }),
  });

  titleInput.value = "";
  estimatedPomodorosInput.value = "";
  loadTasks();

}
  loadTasks();

  let segundos = 25 * 60;
  let intervalo = null;
  let corriendo = false;

  function actualizarDisplay() {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    document.getElementById("timer").textContent =
    `${mins}:${secs.toString().padStart(2, "0")}`;

  }

  document.getElementById("startTimerBtn").addEventListener("click", () => {
    if(corriendo) return;
    corriendo = true;

    intervalo = setInterval(() => {
      segundos--;
      actualizarDisplay();

      if (segundos === 0) {
        clearInterval(intervalo);
        corriendo = false;
      }
    }, 1000)
  });

  document.getElementById("resetTimerBtn").addEventListener("click", () => {
    clearInterval(intervalo);
    corriendo = false;
    segundos = 25 * 60;
    actualizarDisplay();
  });