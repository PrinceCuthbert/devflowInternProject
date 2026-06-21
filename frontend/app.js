const API_URL = "http://localhost:5000/api/projects";

// DOM Elements
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const listContainer = document.getElementById("todo-list");
const trashBucket = document.getElementById("trash-bucket");
const saveBtn = document.querySelector(".save-btn");
const projectCountSpan = document.getElementById("project-count");

// STATE VARIABLE: Remembers which task we are editing (if any)
let editingId = null;

// 1. READ: Fetch all projects
async function fetchTodos() {
  try {
    const res = await axios.get(API_URL);
    renderTodos(res.data);
  } catch (error) {
    console.error("Fetch error:", error);
    listContainer.innerHTML =
      '<li class="loading-msg" style="color: red;">Cannot connect to server. Is port 5000 running?</li>';
  }
}

// 2. RENDER: Update the DOM and make items draggable
function renderTodos(projects) {
  listContainer.innerHTML = "";

  // Update dynamic project counter (Completed/Total)
  if (projectCountSpan) {
    const completedCount = projects.filter(
      (p) => p.status === "Completed",
    ).length;
    const totalCount = projects.length;
    projectCountSpan.textContent = `${completedCount}/${totalCount}`;
  }

  if (projects.length === 0) {
    listContainer.innerHTML =
      '<li class="loading-msg">No projects pending. You are all caught up!</li>';
    return;
  }

  projects.forEach((project) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    if (project.status === "Completed") {
      li.classList.add("completed-item");
    }

    // Make it draggable
    li.draggable = true;

    // Attach drag events to the specific list item
    li.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", project.id);
      li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
    });

    // Create grab/drag handle
    const dragHandle = document.createElement("div");
    dragHandle.className = "drag-handle";
    dragHandle.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="9" cy="5" r="1.5"></circle>
        <circle cx="9" cy="12" r="1.5"></circle>
        <circle cx="9" cy="19" r="1.5"></circle>
        <circle cx="15" cy="5" r="1.5"></circle>
        <circle cx="15" cy="12" r="1.5"></circle>
        <circle cx="15" cy="19" r="1.5"></circle>
      </svg>
    `;

    // Create checkbox status indicator (clickable to toggle completion)
    const statusIndicator = document.createElement("div");
    statusIndicator.className = "status-indicator";
    if (project.status === "Completed") {
      statusIndicator.classList.add("completed");
      statusIndicator.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    } else {
      statusIndicator.classList.add("pending");
    }

    // Toggling completion state on indicator click
    statusIndicator.onclick = async (e) => {
      e.stopPropagation();
      const newStatus =
        project.status === "Completed" ? "Planning" : "Completed";
      try {
        await axios.put(`${API_URL}/${project.id}`, { status: newStatus });
        fetchTodos();
      } catch (err) {
        console.error("Error updating project status:", err);
      }
    };

    // Create the text span safely
    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = project.name;

    // Create the Edit button with a modern pencil SVG
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.setAttribute("aria-label", "Edit project");
    editBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
      </svg>
    `;

    // EDIT LOGIC: When clicked, populate the input and change state
    editBtn.onclick = (e) => {
      e.stopPropagation();
      editingId = project.id; // Remember this ID!
      input.value = project.name; // Put the text back in the box
      saveBtn.textContent = "Update"; // Change button text
      input.focus();
      form.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    li.appendChild(dragHandle);
    li.appendChild(statusIndicator);
    li.appendChild(textSpan);
    li.appendChild(editBtn);
    listContainer.appendChild(li);
  });
}

// 3. CREATE/UPDATE: Form Submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const projectName = input.value.trim();
  if (!projectName) return;

  try {
    if (editingId) {
      // UPDATE MODE (PUT request)
      await axios.put(`${API_URL}/${editingId}`, { name: projectName });

      // Reset state back to "Create Mode"
      editingId = null;
      saveBtn.textContent = "Save";
    } else {
      // CREATE MODE (POST request)
      await axios.post(API_URL, { name: projectName });
    }

    input.value = ""; // Clear input field
    fetchTodos(); // Refresh the UI
  } catch (error) {
    console.error("Error saving/updating project:", error);
  }
});

/* =========================================
   TRASH BUCKET DROP ZONE LOGIC
 ========================================= */

trashBucket.addEventListener("dragover", (e) => {
  e.preventDefault(); // REQUIRED to allow dropping
  trashBucket.classList.add("drag-active");
});

trashBucket.addEventListener("dragleave", () => {
  trashBucket.classList.remove("drag-active");
});

trashBucket.addEventListener("drop", async (e) => {
  e.preventDefault();
  trashBucket.classList.remove("drag-active");

  // Grab the ID we saved in dragstart
  const projectId = e.dataTransfer.getData("text/plain");

  if (projectId) {
    try {
      await axios.delete(`${API_URL}/${projectId}`);
      fetchTodos(); // Refresh UI instantly
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  }
});

// Initialize app when window loads
window.addEventListener("DOMContentLoaded", fetchTodos);
