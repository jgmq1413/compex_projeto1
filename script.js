document.addEventListener("DOMContentLoaded", function () {
  const API_URL = "http://localhost:5000/todos"
  const newTodoInput = document.getElementById("new-todo")
  const createTodoButton = document.getElementById("create-todo")
  const todoList = document.getElementById("todo-list")
  const createdCount = document.getElementById("created-count")
  const completedCount = document.getElementById("completed-count")

  createTodoButton.addEventListener("click", addTodo)
  todoList.addEventListener("click", handleTodoClick)

  async function fetchTodos() {
    const response = await axios.get(API_URL)
    renderTodos(response.data)
  }

  async function addTodo() {
    const text = newTodoInput.value.trim()
    if (text === "") return

    const response = await axios.post(API_URL, { text })
    renderTodos([response.data])
    newTodoInput.value = ""
  }

  async function toggleComplete(id) {
    const response = await axios.patch(`${API_URL}/${id}`)
    updateTodoInList(response.data)
  }

  async function deleteTodo(id) {
    await axios.delete(`${API_URL}/${id}`)
    removeTodoFromList(id)
  }

  function handleTodoClick(event) {
    const target = event.target
    const id = target.closest("li").dataset.id

    if (target.tagName === "SPAN") {
      toggleComplete(id)
    } else if (target.tagName === "BUTTON") {
      deleteTodo(id)
    }
  }

  function renderTodos(todos) {
    todos.forEach((todo) => {
      const li = document.createElement("li")
      li.dataset.id = todo._id
      const span = document.createElement("span")
      span.textContent = todo.text
      if (todo.completed) span.classList.add("completed")
      const button = document.createElement("button")
      button.textContent = "Remover"

      li.appendChild(span)
      li.appendChild(button)
      todoList.appendChild(li)
    })
    updateCounts()
  }

  function updateTodoInList(updatedTodo) {
    const todoItems = todoList.querySelectorAll("li")
    todoItems.forEach((item) => {
      if (item.dataset.id === updatedTodo._id) {
        const span = item.querySelector("span")
        span.textContent = updatedTodo.text
        if (updatedTodo.completed) {
          span.classList.add("completed")
        } else {
          span.classList.remove("completed")
        }
      }
    })
    updateCounts()
  }

  function removeTodoFromList(id) {
    const todoItems = todoList.querySelectorAll("li")
    todoItems.forEach((item) => {
      if (item.dataset.id === id) {
        item.remove()
      }
    })
    updateCounts()
  }

  function updateCounts() {
    const todoItems = todoList.querySelectorAll("li")
    createdCount.textContent = todoItems.length
    const completedItems = todoList.querySelectorAll("li span.completed")
    completedCount.textContent = completedItems.length
  }

  fetchTodos()
})
