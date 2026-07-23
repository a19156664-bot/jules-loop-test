/**
 * TodoApp - Handles DOM manipulation, event listeners, and UI rendering.
 */
document.addEventListener('DOMContentLoaded', () => {
  const store = new TodoStore();

  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');
  const counter = document.getElementById('todo-counter');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const btnClearAll = document.getElementById('btn-clear-all');
  const btnClearCompleted = document.getElementById('btn-clear-completed');

  let currentFilter = 'all';

  /**
   * Render TODO items based on current filter
   */
  function render() {
    const todos = store.getTodos();
    let filteredTodos = todos;

    if (currentFilter === 'active') {
      filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
      filteredTodos = todos.filter(t => t.completed);
    }

    // Toggle Empty State
    if (filteredTodos.length === 0) {
      emptyState.style.display = 'flex';
      todoList.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      todoList.style.display = 'flex';
    }

    // Update Counter
    const activeCount = todos.filter(t => !t.completed).length;
    counter.textContent = `${activeCount} 件の未完了タスク`;

    // Render List Items
    todoList.innerHTML = '';
    filteredTodos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.dataset.id = todo.id;

      li.innerHTML = `
        <div class="todo-left">
          <div class="checkbox-custom" role="checkbox" aria-checked="${todo.completed}">
            ${todo.completed ? `
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ` : ''}
          </div>
          <span class="todo-text">${escapeHtml(todo.text)}</span>
        </div>
        <button type="button" class="btn-delete" title="削除">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      `;

      // Event Listener: Toggle Completed
      const checkbox = li.querySelector('.checkbox-custom');
      const todoText = li.querySelector('.todo-text');

      const handleToggle = () => {
        store.toggleTodo(todo.id);
        render();
      };
      checkbox.addEventListener('click', handleToggle);
      todoText.addEventListener('click', handleToggle);

      // Event Listener: Delete
      const btnDelete = li.querySelector('.btn-delete');
      btnDelete.addEventListener('click', (e) => {
        e.stopPropagation();
        store.deleteTodo(todo.id);
        render();
      });

      todoList.appendChild(li);
    });
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Handle Form Submission (Add Todo)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
      store.addTodo(text);
      input.value = '';
      render();
    }
  });

  // Handle Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  // Handle Clear All Button
  if (btnClearAll) {
    btnClearAll.addEventListener('click', () => {
      store.clearTodos();
      render();
    });
  }

  // Handle Clear Completed Button
  if (btnClearCompleted) {
    btnClearCompleted.addEventListener('click', () => {
      store.clearCompletedTodos();
      render();
    });
  }

  // Initial Render
  render();
});
