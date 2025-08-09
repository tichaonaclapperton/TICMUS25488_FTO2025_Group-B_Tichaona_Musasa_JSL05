import { initialTasks } from "./initialData.js";

/**
 * @fileoverview Task management application.
 * This script handles creating, editing, and rendering tasks
 * with support for saving to and retrieving from localStorage.
 */

/**
 * @type {HTMLElement|null}
 * The currently selected task element for editing.
 */

// *****getting DOM elements*******

/** @type {HTMLDivElement} */
const modal = document.getElementById("modal");
/** @type {HTMLDivElement} */
const taskInput = document.getElementById("taskTitleInput");
/** @type {HTMLDivElement} */
const taskDiscriptionInput = document.getElementById("taskDescriptionInput");
/** @type {HTMLDivElement} */
const closeModalBtn = document.getElementById("close-modal");
/** @type {HTMLDivElement} */
const taskStatusInput = document.getElementById("taskStatusInput");
const addTaskBtn = document.getElementById("addTaskBtn");
/** @type {HTMLDivElement} */
const saveTaskBtn = document.getElementById("saveTaskBtn");

let selectedTask = null;

addTaskBtn.addEventListener("click", () => {
	openModal(null);
});

/**
 * Render all tasks into their respective status containers.
 * @param {Array<{id:number,title:string,description:string,status:string}>} tasks - The tasks to render.
 * @returns {void}
 */

const renderTasks = (tasks) => {
	// Clear all existing tasks
	document.querySelectorAll(".tasks-container").forEach((container) => {
		container.innerHTML = "";
	});

	// creating div element for each task, asign className (task-div) for styling and sets data-description and data-status so that i can access it later

	tasks.forEach((task) => {
		const taskDiv = document.createElement("div");
		taskDiv.className = "task-div";
		taskDiv.textContent = task.title;
		taskDiv.dataset.description = task.description;
		taskDiv.dataset.status = task.status;
		// taskDiv.dataset.taskId = task.id;

		// Add click listener to open modal for editing
		taskDiv.addEventListener("click", function () {
			openModal(this);
		});

		const container = document.querySelector(
			`.tasks-container[data-status="${task.status}"]`
		);
		if (container) container.appendChild(taskDiv);
	});
	updateColumnHeaders(tasks);
};

/**
 * Update the header text for each status column with task count.
 * @param {Array<Object>} tasks - List of all tasks.
 */

const updateColumnHeaders = (tasks) => {
	const statuses = ["todo", "doing", "done"];
	statuses.forEach((status) => {
		const count = tasks.filter((task) => task.status === status).length;
		document.getElementById(
			`${status}Text`
		).textContent = `${status.toUpperCase()} (${count})`;
	});
};

/**
 * Handles saving a task when clicking the Save button.
 * Updates an existing task or adds a new one.
 */

saveTaskBtn.addEventListener("click", () => {
	const title = taskInput.value.trim();
	const description = taskDiscriptionInput.value.trim();
	const status = taskStatusInput.value;

	if (!title) {
		alert("Task title cannot be empty.");
		return;
	}

	// ****This  decides whether to edit an existing task or add a new one based on whether selectedTask exists. ******

	if (selectedTask) {
		// Edit existing task
		const oldTitle = selectedTask.textContent;
		const index = tasks.findIndex((t) => t.title === oldTitle);
		if (index !== -1) {
			tasks[index] = { title, description, status };
		}
	} else {
		// Add new task
		tasks.push({ id: Date.now(), title, description, status });
	}
	saveTasksToLocalStorage(tasks);
	renderTasks(tasks);
	modal.style.display = "none";
	selectedTask = null;
});

/**
 * Opens the task modal for adding or editing a task.
 * @param {HTMLElement|null} taskElement - The clicked task element or null for new tasks.
 * @returns {void}
 */

function openModal(taskElement) {
	const heading = document.getElementById("modal-heading");
	selectedTask = taskElement;

	if (taskElement) {
		taskInput.value = taskElement.textContent;
		taskDiscriptionInput.value = taskElement.dataset.description;
		taskStatusInput.value = taskElement.dataset.status;

		heading.textContent = "Edit Task";
		saveTaskBtn.textContent = "Update Task";
	} else {
		taskInput.value = "";
		taskDiscriptionInput.value = "";
		taskStatusInput.value = "todo";

		heading.textContent = "Add New Task";
		saveTaskBtn.textContent = "Create Task";
	}
	modal.style.display = "flex";
}

/**
 * Saves tasks to localStorage.
 * @param {Array<Object>} tasks - The array of task objects to store.
 * @returns {void}
 */

function saveTasksToLocalStorage(tasks) {
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**
 * Retrieves tasks from localStorage.
 * @returns {Array<Object>} - The list of stored tasks or an empty array.
 */

let tasks = getTasksFromLocalStorage();
function getTasksFromLocalStorage() {
	try {
		const saved = localStorage.getItem("tasks");
		return saved ? JSON.parse(saved) : [];
	} catch (e) {
		console.error("Error reading localStorage", e);
		return [];
	}
}

/**
 * Closes the modal when clicking the Close button.
 */

closeModalBtn.addEventListener("click", () => {
	modal.style.display = "none";
	selectedTask = null;
});

/**
 * Closes the modal when clicking outside it.
 * @param {MouseEvent} event
 */

window.addEventListener("click", function (event) {
	if (event.target === modal) {
		modal.style.display = "none";
	}
});

/**
 * Initializes the app after the DOM content is loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
	if (tasks.length === 0) {
		saveTasksToLocalStorage(initialTasks); // Optional fallback
	}
	renderTasks(getTasksFromLocalStorage());
});
