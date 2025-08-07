import { initialTasks } from "./initialData.js";

/**
 * @type {HTMLElement|null}
 * The currently selected task element for editing.
 */

let selectedTask = null;

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

// Render all tasks to their respective containers.

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

saveTaskBtn.addEventListener("click", () => {
	const title = taskInput.value.trim();
	const description = taskDiscriptionInput.value.trim();
	const status = taskStatusInput.value;

	if (!title) {
		alert("Task title cannot be empty.");
		return;
	}

	
	if (selectedTask) {
		// Edit existing task
		const oldTitle = selectedTask.textContent;
		const index = tasks.findIndex((t) => t.title === oldTitle);
		if (index !== -1) {
			tasks[index] = { title, description, status };
		}
	} else {
		// Add new task
		tasks.push({ title, description, status });
	}
	saveTasksToLocalStorage(tasks);
	renderTasks(tasks);
  modal.style.display = "none";
	selectedTask = null;
});

//  Function linked to the modal that gives modal information from the data given

function openModal(taskElement) {
	selectedTask = taskElement;
	taskInput.value = taskElement.textContent;
	taskDiscriptionInput.value = taskElement.dataset.description;
	taskStatusInput.value = taskElement.dataset.status;

	// changing modal from hidding to display
	modal.style.display = "flex";
}

// The function that closes the modal when the close button is clicked

closeModalBtn.addEventListener("click", () => {
	modal.style.display = "none";
	selectedTask = null;
});

// if you click outside the modal the modal will close

window.addEventListener("click", function (event) {
	if (event.target === modal) {
		modal.style.display = "none";
	}
});

// making sure that javascript runs after DOM is ready

document.addEventListener("DOMContentLoaded", () => {
	renderTasks(initialTasks);
});