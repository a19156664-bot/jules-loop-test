/**
 * TodoApp - Handles DOM manipulation, event listeners, and UI rendering.
 */
document.addEventListener('DOMContentLoaded', () => {
  const store = new TodoStore();

  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const priorityInput = document.getElementById('todo-priority');
  const dateInput = document.getElementById('todo-due-date');
  const todoList = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');
  const counter = document.getElementById('todo-counter');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterPrioritySelect = document.getElementById('filter-priority');
  const btnClearAll = document.getElementById('btn-clear-all');
  const btnClearCompleted = document.getElementById('btn-clear-completed');

  const themeSelect = document.getElementById('theme-select');
  const fontSelect = document.getElementById('font-select');

  let currentFilter = 'all';
  let currentPriorityFilter = 'all';

  // Font loading and handling
  function applyFont(font) {
    document.documentElement.setAttribute('data-font', font);
    if (fontSelect) {
      fontSelect.value = font;
    }
  }

  const savedFont = store.getFont();
  applyFont(savedFont);

  if (fontSelect) {
    fontSelect.addEventListener('change', (e) => {
      const selectedFont = e.target.value;
      store.saveFont(selectedFont);
      applyFont(selectedFont);
    });
  }

  // Theme loading and handling
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeSelect) {
      themeSelect.value = theme;
    }
  }

  const savedTheme = store.getTheme();
  applyTheme(savedTheme);

  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const selectedTheme = e.target.value;
      store.saveTheme(selectedTheme);
      applyTheme(selectedTheme);
    });
  }

  /**
   * Render TODO items based on current filter
   */
  function render() {
    const todos = store.getTodos();
    let filteredTodos = todos;

    // Filter by completion status
    if (currentFilter === 'active') {
      filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
      filteredTodos = todos.filter(t => t.completed);
    }

    if (currentPriorityFilter !== 'all') {
      filteredTodos = filteredTodos.filter(t => (t.priority || 'medium') === currentPriorityFilter);
    }

    // Toggle Empty State
    if (filteredTodos.length === 0) {
      emptyState.style.display = 'flex';
      todoList.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      todoList.style.display = 'flex';
    }

    // Render List Items
    todoList.innerHTML = '';
    filteredTodos.forEach(todo => {
      const isOverdue = store.isOverdue(todo, new Date());
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`.trim();
      li.dataset.id = todo.id;

      const priorityLabel = todo.priority || 'medium';
      const dueDateHtml = todo.dueDate ? `<span class="todo-due-date ${isOverdue ? 'overdue-text' : ''}">期限: ${escapeHtml(todo.dueDate)}</span>` : '';

      li.innerHTML = `
        <div class="todo-left">
          <div class="checkbox-custom" role="checkbox" aria-checked="${todo.completed}">
            ${todo.completed ? `
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ` : ''}
          </div>
          <div class="todo-content">
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            ${dueDateHtml}
          </div>
          <span class="priority-badge priority-${priorityLabel}" data-id="${todo.id}">${priorityLabel}</span>
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
      const priorityBadge = li.querySelector('.priority-badge');

      const handleToggle = () => {
        store.toggleTodo(todo.id);
        render();
      };
      checkbox.addEventListener('click', handleToggle);
      
      // Inline Editing
      let isEditing = false;
      todoText.addEventListener('dblclick', () => {
        if (todo.completed || isEditing) return; // Don't edit if completed
        isEditing = true;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = todo.text;
        input.className = 'edit-input';
        
        // Replace span with input
        todoText.replaceWith(input);
        input.focus();
        
        const saveEdit = () => {
          const newText = input.value.trim();
          if (newText && newText !== todo.text) {
            store.updateTodo(todo.id, newText);
          } else if (!newText) {
            // If empty, delete the todo or revert. Let's revert for now.
            // Or just update to original (no-op).
          }
          isEditing = false;
          render();
        };

        const cancelEdit = () => {
          isEditing = false;
          render();
        };
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            input.blur(); // Triggers blur which calls saveEdit
          } else if (e.key === 'Escape') {
            cancelEdit();
          }
        });
      });

      // Regular click toggles it if not editing, BUT we need a small delay 
      // or check to prevent dblclick from triggering single click toggle.
      // Easiest is to only toggle on single click if it's not a dblclick.
      // Since dblclick is a separate event, we can remove the click handler on todoText 
      // and only rely on the checkbox for toggling completion.
      // If we MUST have toggle on text click, we need a timeout.
      // Let's remove the click-to-toggle on text entirely for simplicity, 
      // or implement a timeout.
      
      let clickTimeout = null;
      todoText.addEventListener('click', (e) => {
        if (isEditing) return;
        
        if (clickTimeout !== null) {
          // It's a double click
          clearTimeout(clickTimeout);
          clickTimeout = null;
        } else {
          clickTimeout = setTimeout(() => {
            clickTimeout = null;
            if (!isEditing) {
              handleToggle();
            }
          }, 250); // wait 250ms for a potential double click
        }
      });

      // Event Listener: Priority Badge Click (cycle priorities)
      priorityBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        const cycle = { 'high': 'medium', 'medium': 'low', 'low': 'high' };
        const nextPriority = cycle[todo.priority || 'medium'];
        store.updatePriority(todo.id, nextPriority);
        render();
      });

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
    const priority = priorityInput ? priorityInput.value : 'medium';
    if (text) {
      store.addTodo(text, priority);
      input.value = '';
      if (priorityInput) priorityInput.value = 'medium';
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

  // Handle Priority Filter
  if (filterPrioritySelect) {
    filterPrioritySelect.addEventListener('change', (e) => {
      currentPriorityFilter = e.target.value;
      render();
    });
  }

  // Handle Clear All Button
  if (btnClearAll) {
    btnClearAll.addEventListener('click', () => {
      if (window.confirm('本当にすべてのタスクを削除しますか？')) {
        store.clearTodos();
        render();
      }
    });
  }

  // Handle Clear Completed Button
  if (btnClearCompleted) {
    btnClearCompleted.addEventListener('click', () => {
      if (window.confirm('完了済みのタスクをすべて削除しますか？')) {
        store.clearCompletedTodos();
        render();
      }
    });
  }

  // Initial Render
  render();
});
