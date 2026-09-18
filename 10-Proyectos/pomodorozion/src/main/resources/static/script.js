// === Estado global y referencias al DOM ===
const titleInput = document.getElementById("titleInput");
const estimatedPomodorosInput = document.getElementById("estimatedPomodorosInput");
const taskSearch = document.getElementById("taskSearch");
const createBtn = document.getElementById("createBtn");
const API_URL = "/api/tasks";
let editingTaskId = null;
let selectedTaskId = 0;
let allTasks = [];


// === Autenticación ===
const authOverlay = document.getElementById("auth-overlay");
const mainContent = document.querySelector("main");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

// === Utilidades ===
function escapeHtml(unsafe) {
  unsafe = unsafe.replaceAll("&", "&amp;");
  unsafe = unsafe.replaceAll("<", "&lt;");
  unsafe = unsafe.replaceAll(">", "&gt;");
  unsafe = unsafe.replaceAll("'", "&#039;");
  unsafe = unsafe.replaceAll('"', "&quot;");
  return unsafe;
}

function formatTimer(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return mins + ":" + String(secs).padStart(2, "0");
}

function phaseName(phase) {
  const names = {
    FOCUS: "Enfoque",
    SHORT_BREAK: "Descanso corto",
    LONG_BREAK: "Descanso largo",
  };
  return names[phase] || phase;
}
function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return hours + "h " + minutes + "m";
  }
  return minutes + "m";
}
// === Tareas (CRUD) ===
function validateInput() {
  const title = titleInput.value.trim();
  const estimatedPomodoros = Number(estimatedPomodorosInput.value);

  const isTitleValid = title !== "";
  const isPomodorosValid =
    !Number.isNaN(estimatedPomodoros) && estimatedPomodoros > 0;

  createBtn.disabled = !(isTitleValid && isPomodorosValid);
}

titleInput.addEventListener("input", validateInput);

async function loadTasks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) return;
    allTasks = await response.json();
    applySearch();
  } catch (e) {
    // sin conexión con el servidor: no hacer nada
  }
}

function applySearch() {
  const texto = taskSearch.value.trim().toLowerCase();
  const filtradas = allTasks.filter((t) => t.title.toLowerCase().includes(texto));
  renderTasks(filtradas);
}

async function completePomodoro(id) {
  await fetch(`${API_URL}/${id}/pomodoro`, {
    method: "POST",
  });

  loadTasks();
}

async function selectTaskId(id) {
  await fetch("/api/timer/task/" + id, { method: "POST" });
  loadTasks();
}
function startEdit(task) {
  editingTaskId = task.id;
  titleInput.value = task.title;
  estimatedPomodorosInput.value = task.estimatedPomodoros;
  createBtn.textContent = "Guardar cambios";
  validateInput();
}

async function deleteTask(id) {
  if (!confirm("Eliminar esta tarea?")) return;
  await fetch(API_URL + "/" + id, { method: "DELETE" });
  loadTasks();
}
function renderTasks(filtradas) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  if (filtradas.length === 0) {
    taskList.innerHTML = "<li class='empty'>No se encontraron tareas</li>";
    return;
  }

  for (const task of filtradas) {
    const li = document.createElement("li");
    let statusTexto;
    if (task.status === "PENDING") statusTexto = "Pendiente";
    else if (task.status === "IN_PROGRESS") statusTexto = "En progreso";
    else statusTexto = "Completada";
    li.innerHTML = `
                <div class ="task-title">${escapeHtml(task.title)}</div>
                <button class="select-btn">
                   ${task.id === selectedTaskId ? "✓ Seleccionada" : "Seleccionar"}
                </button>
                <div class="task-progress">
                  ${task.completedPomodoros} / ${task.estimatedPomodoros} pomodoros
                </div>
                <div class="task-status">
                  ${statusTexto}
                </div>
                <button class="pomodoro-btn">
                  +1 Pomodoro
                </button>
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Eliminar</button>
                `;
    li.dataset.status = task.status;
    li.dataset.selected = task.id === selectedTaskId;
    taskList.appendChild(li);
    const btn = li.querySelector(".pomodoro-btn");
    const selectBtn = li.querySelector(".select-btn");
    const editBtn = li.querySelector(".edit-btn");
    const deleteBtn = li.querySelector(".delete-btn");

    btn.addEventListener("click", () => completePomodoro(task.id));
    selectBtn.addEventListener("click", () => selectTaskId(task.id));
    editBtn.addEventListener("click", () => startEdit(task));
    deleteBtn.addEventListener("click", () => deleteTask(task.id));
  }
}

taskSearch.addEventListener("input", applySearch);

// === Timer ===
function renderTimer(state) {
  document.getElementById("timer").textContent = formatTimer(
    state.remainingSeconds,
  );
  document.getElementById("phase").textContent = phaseName(state.phase);

  document.getElementById("startTimerBtn").disabled = state.running;
  document.getElementById("pauseTimerBtn").disabled = !state.running;

  selectedTaskId = state.selectedTaskId;
  renderCycle(state.focusCountInCycle);
}
document.getElementById("createBtn").addEventListener("click", createTask);

async function createTask() {
  const title = titleInput.value.trim();
  const estimatedPomodoros = Number(estimatedPomodorosInput.value);
  if (title.trim() === "") {
    showToast("Por favor, ingresa un título para la tarea.");
    return;
  }

  if (
    estimatedPomodorosInput.value.trim() === "" ||
    Number.isNaN(estimatedPomodoros) ||
    estimatedPomodoros <= 0
  ) {
    showToast("Por favor, ingresa un número válido de pomodoros estimados.");
    return;
  }

  if (editingTaskId !== null) {
    await fetch(API_URL + "/" + editingTaskId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        estimatedPomodoros: estimatedPomodoros,
      }),
    });
    editingTaskId = null;
    createBtn.textContent = "Crear tarea";
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        estimatedPomodoros: estimatedPomodoros,
      }),
    });
  }

  titleInput.value = "";
  estimatedPomodorosInput.value = "";
  createBtn.textContent = "Crear tarea";
  validateInput();
  loadTasks();
}


async function doAction(action) {
  await fetch("/api/timer/" + action, { method: "POST" });
}

document
  .getElementById("startTimerBtn")
  .addEventListener("click", () => doAction("start"));
document
  .getElementById("resetTimerBtn")
  .addEventListener("click", () => doAction("reset"));
document
  .getElementById("pauseTimerBtn")
  .addEventListener("click", () => doAction("pause"));

// --- WebSocket: el servidor empuja el estado cada segundo ---
let ws = null;
let wsConnected = false;
let finishing = false;
let sessionAlive = true;

function connectWs() {
  if (!sessionAlive) return;
  const protocol = location.protocol === "https:" ? "wss" : "ws";
  ws = new WebSocket(protocol + "://" + location.host + "/ws");

  ws.onopen = () => {
    wsConnected = true;
  };

  ws.onmessage = (event) => {
    applyState(JSON.parse(event.data));
  };

  ws.onclose = () => {
    wsConnected = false;
    if (sessionAlive) setTimeout(connectWs, 3000);
  };

  ws.onerror = () => {
    ws.close();
  };
}

function applyState(state) {
  const previousSelected = selectedTaskId;
  renderTimer(state);

  if (previousSelected !== state.selectedTaskId) {
    loadTasks();
  }

  if (state.remainingSeconds === 0 && state.running && !finishing) {
    finishing = true;
    playBeep();
    notify(phaseName(state.phase) + " terminado");
    fetch("/api/timer/finish", { method: "POST" }).then(
      () => {
        finishing = false;
        loadSessions();
      },
      () => (finishing = false),
    );
  }
}

// Plan B: si el WebSocket falla, volvemos al polling clásico
async function poll() {
  if (wsConnected || !sessionAlive) return;
  try {
    const response = await fetch("/api/timer");
    if (response.status === 401 || response.status === 403) {
      sessionAlive = false;
      if (ws) ws.close();
      showAuth();
      return;
    }
    if (!response.ok) return;
    applyState(await response.json());
  } catch (e) {
    // sin conexión con el servidor: no hacer nada
  }
}

let appStarted = false;

function startApp() {
  sessionAlive = true;

  if (appStarted) {
    if (!wsConnected) connectWs();
    loadTasks();
    loadSessions();
    return;
  }

  appStarted = true;
  loadTasks();
  loadSessions();
  connectWs();
  setInterval(poll, 1000);
}

function renderCycle(focusCount) {
  const container = document.getElementById("cycle-dots");
  container.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const dot = document.createElement("span");
    dot.className = "dot" + (i < focusCount ? " filled" : "");
    container.appendChild(dot);
  }
}

let audioCtx = null;

function playBeep() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  oscillator.connect(gain);
  gain.connect(audioCtx.destination);
  oscillator.type = "sine";
  oscillator.frequency.value = 800;
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.5);
}

function notify(message) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("PomodoroZion", { body: message });
  }
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}


// --- Session History ---

async function loadTodayStats() {
  try {
    const response = await fetch("/api/sessions/today");
    const stats = await response.json();
    document.getElementById("todayFocusCount").textContent = stats.focusCount;
    document.getElementById("todayFocusTime").textContent = formatDuration(
      stats.focusSeconds,
    );
    document.getElementById("todayBreakCount").textContent = stats.breakCount;
    document.getElementById("todayBreakTime").textContent = formatDuration(
      stats.breakSeconds,
    );
  } catch (e) {
    // sin conexión
  }
}

async function loadRecentSessions() {
  try {
    const response = await fetch("/api/sessions/recent");
    const sessions = await response.json();
    renderSessionList(sessions);
  } catch (e) {
    // sin conexión
  }
}

function renderSessionList(sessions) {
  const list = document.getElementById("sessionList");
  list.innerHTML = "";

  if (sessions.length === 0) {
    list.innerHTML = "<li class='empty'>No hay sesiones registradas</li>";
    return;
  }

  sessions.forEach((session) => {
    const li = document.createElement("li");
    li.className =
      "session-item" + (session.phase !== "FOCUS" ? " break-session" : "");

    const phaseLabel = phaseName(session.phase);
    const time = new Date(session.completedAt).toLocaleTimeString("es", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const taskInfo = session.taskTitle
      ? escapeHtml(session.taskTitle)
      : "Sin tarea";
    const duration = formatDuration(session.durationSeconds);

    li.innerHTML = `
      <div class="session-phase">${phaseLabel}</div>
      <div class="session-task">${taskInfo}</div>
      <div class="session-meta">${duration} · ${time}</div>
    `;

    list.appendChild(li);
  });
}

function loadSessions() {
  loadTodayStats();
  loadRecentSessions();
}

function showAuth() {
  authOverlay.hidden = false;
  mainContent.hidden = true;
}

function hideAuth(username) {
  authOverlay.hidden = true;
  mainContent.hidden = false;
  document.getElementById("user-name").textContent = username;
  document.getElementById("logoutBtn").hidden = false;
  document.getElementById("deleteAccountBtn").hidden = false;
}

function switchTab(tab) {
  const isLogin = tab === "login";
  loginForm.hidden = !isLogin;
  registerForm.hidden = isLogin;
  document.getElementById("tab-login").classList.toggle("active", isLogin);
  document.getElementById("tab-register").classList.toggle("active", !isLogin);
}

document
  .getElementById("tab-login")
  .addEventListener("click", () => switchTab("login"));
document
  .getElementById("tab-register")
  .addEventListener("click", () => switchTab("register"));

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    showToast("Usuario o contraseña incorrectos");
    return;
  }

  const user = await res.json();
  loginForm.reset();
  hideAuth(user.username);
  startApp();
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value;

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    let msg = "No se pudo crear la cuenta";
    try {
      const err = await res.json();
      if (err.errors) msg = Object.values(err.errors).join(". ");
    } catch (_) { }
    showToast(msg);
    return;
  }

  const loginRes = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!loginRes.ok) {
    registerForm.reset();
    switchTab("login");
    showToast("Cuenta creada. Inicia sesión.");
    return;
  }

  const user = await loginRes.json();
  registerForm.reset();
  hideAuth(user.username);
  startApp();
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  location.reload();
});

// Reto "borrar cuenta": dos confirmaciones (es irreversible), se llama al
// endpoint y al volver la respuesta la sesión ya está muerta -> recargar
// pone al usuario de nuevo en la pantalla de login.
document.getElementById("deleteAccountBtn").addEventListener("click", async () => {
  if (!confirm("¿Seguro que quieres borrar tu cuenta?")) return;
  if (!confirm("Esta acción es irreversible: se borrarán tus tareas, tu historial y tu temporizador. ¿Continuar?")) return;

  const res = await fetch("/api/auth/account", { method: "DELETE" });
  if (!res.ok) {
    showToast("No se pudo borrar la cuenta");
    return;
  }
  location.reload();
});

// Al cargar la pagina: ¿hay sesion?
(async () => {
  try {
    const res = await fetch("/api/auth/me");
    if (res.ok) {
      const user = await res.json();
      hideAuth(user.username);
      startApp();
    } else {
      showToast("Inicia sesión para continuar");
    }
  } catch (e) {
    showToast("Error al verificar el estado de inicio de sesión");
  }
})();

document
  .getElementById("change-password-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById(
      "currentPasswordInput",
    ).value;
    const newPassword = document.getElementById("changePasswordInput").value;

    fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Error al cambiar la contraseña");
        }
        showToast("Contraseña cambiada con éxito");
        document.getElementById("change-password-form").reset();
      })
      .catch((e) => {
        showToast(e.message || "Error al cambiar la contraseña");
      });
  });

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.hidden = false;
  if (message) {
    setTimeout(() => {
      toast.hidden = true;
    }, 3000);
  }
}
