const API_URL = "http://localhost:5000";

/* =====================
   AUTH STATE
===================== */
let token = localStorage.getItem("token");

/* =====================
   DOM ELEMENTS
===================== */
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");

const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");

/* =====================
   UI VISIBILITY
===================== */
function showHabitUI(show) {
  habitInput.style.display = show ? "inline-block" : "none";
  addHabitBtn.style.display = show ? "inline-block" : "none";
  habitList.style.display = show ? "block" : "none";
  logoutBtn.style.display = show ? "inline-block" : "none";
}

/* =====================
   AUTH HANDLERS
===================== */

// LOGIN
loginBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Enter username and password");
    return;
  }

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    location.reload();
  } else {
    alert(data.error || "Login failed");
  }
});

// SIGNUP
signupBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    alert("Enter username and password");
    return;
  }

  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  alert(data.message || "Signup complete. Now login.");
});

// LOGOUT
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  location.reload();
});

/* =====================
   MAIN APP
===================== */
class HabitTracker {
  constructor() {
    this.habits = [];
    this.init();
  }

  async init() {
    if (!token) {
      showHabitUI(false);
      return;
    }

    showHabitUI(true);
    await this.loadHabits();

    addHabitBtn.addEventListener("click", () => this.addHabit());
    habitInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addHabit();
    });
  }

  /* =====================
     API CALLS (JWT)
  ===================== */

  async loadHabits() {
    const res = await fetch(`${API_URL}/habits`, {
      headers: {
        "Authorization": token
      }
    });
    this.habits = await res.json();
    this.renderHabits();
  }

  async addHabit() {
    const name = habitInput.value.trim();
    if (!name) return;

    const res = await fetch(`${API_URL}/habits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ name })
    });

    const newHabit = await res.json();
    this.habits.push(newHabit);
    habitInput.value = "";
    this.renderHabits();
  }

  async toggleHabit(index) {
    const habit = this.habits[index];
    const today = new Date().toDateString();

    habit.done = !habit.done;
    habit.lastChecked = today;
    habit.streak = habit.done ? habit.streak + 1 : Math.max(0, habit.streak - 1);

    await fetch(`${API_URL}/habits/${habit._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(habit)
    });

    this.renderHabits();
  }

  async deleteHabit(index) {
    const habit = this.habits[index];

    await fetch(`${API_URL}/habits/${habit._id}`, {
      method: "DELETE",
      headers: {
        "Authorization": token
      }
    });

    this.habits.splice(index, 1);
    this.renderHabits();
  }

  /* =====================
     UI RENDERING
  ===================== */

  renderHabits() {
    habitList.innerHTML = "";

    if (this.habits.length === 0) {
      habitList.innerHTML = `<p class="empty-state">No habits yet.</p>`;
      return;
    }

    this.habits.forEach((habit, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="habit-item">
          <input type="checkbox" ${habit.done ? "checked" : ""}>
          <span>${habit.name}</span>
          <span class="streak">${habit.streak} 🔥</span>
          <button class="delete-btn">❌</button>
        </div>
      `;

      li.querySelector("input").addEventListener("change", () =>
        this.toggleHabit(index)
      );
      li.querySelector(".delete-btn").addEventListener("click", () =>
        this.deleteHabit(index)
      );

      habitList.appendChild(li);
    });
  }
}

/* =====================
   START APP
===================== */
document.addEventListener("DOMContentLoaded", () => {
  new HabitTracker();
});
