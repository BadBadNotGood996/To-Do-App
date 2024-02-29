'use strict';

const todoForm = document.getElementById('todo-form')
const mainInput = document.getElementById('input')
const todoList = document.getElementById('todo-list')

let todos = JSON.parse(localStorage.getItem('todos')) ?? []

if (localStorage.getItem('todos')) {
    todos.map((todo) => {
        renderTodo(todo)
    })
}

todoForm.addEventListener('submit', function (event) {
    event.preventDefault()

    const inputValue = mainInput.value

    // Add task only if value of new task is not empty
    if (inputValue === ''){
        return
    }

    const todo = {
        id: new Date().getTime(),
        content: inputValue,
    }

    todos.push(todo)
    localStorage.setItem('todos', JSON.stringify(todos))

    renderTodo(todo)

    todoForm.reset()
    mainInput.focus()
});

function renderTodo (todo) {
    // Create <li> element and add id
    const liEl = document.createElement('li');
    liEl.id = todo.id

    // Create a <span> element inside the <li> element
    const todoText = document.createElement('span');
    todoText.textContent = todo.content;
    liEl.appendChild(todoText);

    // Create a delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'delete';
    liEl.appendChild(deleteButton);

    // Create an edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'edit';
    liEl.appendChild(editButton);

    todoList.appendChild(liEl);

    deleteButton.addEventListener('click', function () {
        removeTodo(todo)
    });

    editButton.addEventListener('click', function () {
        editTodo(liEl, todo);
    });
}

function editTodo (todoEl, todo) {
    // select the span (text of to-do)
    let todoToEdit = todoEl.querySelector("span");

    // Create a input element
    let newTodo = document.createElement("input");
    newTodo.type = "text";

    // Set the input text equal to the to-do one
    newTodo.value = todoToEdit.textContent;

    // replace the two elements and focus on input field
    todoEl.replaceChild(newTodo, todoToEdit);
    newTodo.focus();
    newTodo.select();

    // switch again the two elements and update localstorage
    newTodo.addEventListener("blur", () => {
        todoToEdit.innerHTML = newTodo.value;
        todoEl.replaceChild(todoToEdit, newTodo);
        updateTodo(todo, newTodo)
    });
}

function updateTodo (todo, newTodo) {
    let todoId = todo.id
    for (const todo of todos) {
        if (todo.id === todoId) {
            todo.content = newTodo.value
        }
    }
    localStorage.setItem('todos', JSON.stringify(todos))
}

function removeTodo (todo) {
    let todoId = todo.id
    todos = todos.filter((todo) => todo.id !== todoId)

    localStorage.setItem('todos', JSON.stringify(todos))

    document.getElementById(todoId).remove()
}
