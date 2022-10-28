// Search the element on the page

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if(localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) =>  renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

// Function
function addTask(event) {

  // Cancel the send form
  event.preventDefault();

  // Get the text of task from the enter field
  const taskText = taskInput.value;

  // Describing task in the form object
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false 
  };

  // Add task in the array of tasks
  tasks.push(newTask)

  // Save task to local storage in the site
  saveToLocalStorage();
  
  // Rendering Task from page
  renderTask(newTask);

  // Clear enter field and return the focus on him
  taskInput.value = "";
  taskInput.focus();  

  checkEmptyList();
}

function deleteTask(event) {
  
  // If click was by NOT button "Delete task"
  if (event.target.dataset.action !== 'delete') return;

  // Check, if click was by button "Delete task"
  const parenNode = event.target.closest('.list-group-item');
 
  // Define ID task
  const id = Number(parenNode.id);

  // Remove task through the filter
  tasks = tasks.filter((task) => task.id !== id);
  
  // Save task to local storage in the site
  saveToLocalStorage();

  // Remove the task from markup
  parenNode.remove();
  
  checkEmptyList();
}

function doneTask(event) {

  // Check, if click was NOT by button "Task done"
  if (event.target.dataset.action !== 'done') return;

  // Check, if click was by button "Task done"
  const parenNode = event.target.closest('.list-group-item');

  // Define id task
  const id = Number(parenNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;
  
  // Save task to local storage in the site
  saveToLocalStorage();

  const taskTitle = parenNode.querySelector('.task-title');

  taskTitle.classList.toggle('task-title--done');
  
  checkEmptyList();
}

function saveHTMLtoLS() {
  localStorage.setItem('tasksHTML', tasksList.innerHTML)
}

function checkEmptyList() {
  if(tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
                                <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                                <div class="empty-list__title">Список дел пуст</div>
                              </li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }

  if(tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() :null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
  // Create the css Class
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';
    
  // Create markup from a new task
  const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
          <span class="${cssClass}">${task.text}</span>
          <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
              <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
              <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
          </div>
        </li>`;

  // Add task on the page
  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}