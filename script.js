// When the DOM is fully loaded, fetch tasks to display them
document.addEventListener("DOMContentLoaded", function() {
    console.log("Page Loaded!");
    fetchTasks();  // Load tasks on page load
});

// Handle the form submission for creating a new task
document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get values from the form inputs
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;
    const status = document.getElementById('status').value;

    // Validate that the fields are not empty
    if (!title || !description || !dueDate) {
        alert('Please fill in all fields!');
        return;
    }

    // Create a task object
    const task = {
        title: title,
        description: description,
        due_date: dueDate,
        status: status
    };

    // Send the task data to the backend (API endpoint)
    fetch('http://127.0.0.1:5000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task added:', data);
        fetchTasks();  // Refresh task list after adding a task
        document.getElementById('task-form').reset();  // Reset form
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Fetch tasks from the backend to display
function fetchTasks() {
    fetch('http://127.0.0.1:5000/tasks')
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';  // Clear existing tasks

            // Display all tasks
            data.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('task');
                taskElement.innerHTML = `
                    <div class="task-header">
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                        <small>Due: ${task.due_date}</small>
                    </div>
                    <div class="task-actions">
                        <span class="status ${task.status}">${task.status}</span>
                        <button onclick="deleteTask(${task.id})">Delete</button>
                        <button onclick="toggleStatus(${task.id}, '${task.status}')">Toggle Status</button>
                    </div>
                `;
                taskList.appendChild(taskElement);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

// Function to delete a task
function deleteTask(taskId) {
    const confirmation = confirm("Are you sure you want to delete this task?");
    if (!confirmation) return;

    fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task deleted:', data);
        fetchTasks();  // Refresh task list after deleting
    })
    .catch(error => console.error('Error deleting task:', error));
}

// Function to toggle task status between "Pending" and "Completed"
function toggleStatus(taskId, currentStatus) {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';

    fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task status updated:', data);
        fetchTasks();  // Refresh task list after status update
    })
    .catch(error => console.error('Error updating task status:', error));
}
