/**
 * TodoApp - Handles DOM manipulation, event listeners, and UI rendering.
 */
document.addEventListener('DOMContentLoaded', () => {
  const store = new TodoStore();

  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const quadrantInput = document.getElementById('todo-quadrant');
  const priorityInput = document.getElementById('todo-priority');
  const dateInput = document.getElementById('todo-due-date');
  
  const listDoFirst = document.getElementById('todo-list-do_first');
  const listSchedule = document.getElementById('todo-list-schedule');
  const listDelegate = document.getElementById('todo-list-delegate');
  const listMemo = document.getElementById('todo-list-memo');
  const listCompleted = document.getElementById('list-completed');

  const counter = document.getElementById('todo-counter');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterPrioritySelect = document.getElementById('filter-priority');
  const btnClearAll = document.getElementById('btn-clear-all');
  const btnClearCompleted = document.getElementById('btn-clear-completed');

  const modalNegativeSheet = document.getElementById('modal-negative-sheet');
  const sheetTaskName = document.getElementById('sheet-task-name');
  const sheetRowsContainer = document.getElementById('sheet-rows-container');
  const btnSaveClose = document.getElementById('btn-save-sheet');
  const btnPrint = document.getElementById('btn-print-sheet');
  const btnTimer = document.getElementById('btn-action-timer');

  let currentSheetTodoId = null;
  let timerInterval = null;

  const themeSelect = document.getElementById('theme-select');
  
  const btnCompletedDrawer = document.getElementById('btn-completed-drawer');
  const completedDrawer = document.getElementById('completed-drawer');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');

  // Settings Modal

  const btnSettings = document.getElementById('btn-settings');
  const btnSendReminder = document.getElementById('btn-send-reminder');
  const modalSettings = document.getElementById('modal-settings');

  const btnCloseSettings = document.getElementById('btn-close-settings');
  const fontSelect = document.getElementById('font-select');

  let currentFilter = 'all';
  let currentPriorityFilter = 'all';

  // Completed Drawer Toggle
  let isDrawerOpen = false;
  
  function toggleDrawer() {
    isDrawerOpen = !isDrawerOpen;
    if (isDrawerOpen) {
      completedDrawer.classList.add('open');
    } else {
      completedDrawer.classList.remove('open');
    }
  }

  if (btnCompletedDrawer) {
    btnCompletedDrawer.addEventListener('click', toggleDrawer);
  }

  if (btnCloseDrawer) {
    btnCloseDrawer.addEventListener('click', toggleDrawer);
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

  // Load and apply Font
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

  // Settings Modal Event Listeners
  if (btnSettings && modalSettings && btnCloseSettings) {
    btnSettings.addEventListener('click', () => {
      modalSettings.style.display = 'flex';
    });

    btnCloseSettings.addEventListener('click', () => {
      modalSettings.style.display = 'none';
    });
    
    // Close modal when clicking outside
    modalSettings.addEventListener('click', (e) => {
      if (e.target === modalSettings) {
        modalSettings.style.display = 'none';
      }
    });
  }

  /**
   * Render TODO items based on current filter
   */
  function render() {
    const todos = store.getTodos();
    let filteredTodos = todos;

    // Update Counter
    if (counter) {
      counter.textContent = `${todos.length} 件のタスク`;
    }

    // Filter by completion status
    if (currentFilter === 'active') {
      filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
      filteredTodos = todos.filter(t => t.completed);
    }

    if (currentPriorityFilter !== 'all') {
      filteredTodos = filteredTodos.filter(t => (t.priority || 'medium') === currentPriorityFilter);
    }

    // Clear lists
    if (listDoFirst) listDoFirst.innerHTML = '';
    if (listSchedule) listSchedule.innerHTML = '';
    if (listDelegate) listDelegate.innerHTML = '';
    if (listMemo) listMemo.innerHTML = '';
    if (listCompleted) listCompleted.innerHTML = '';

    filteredTodos.forEach(todo => {
      const isOverdue = store.isOverdue(todo, new Date());
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`.trim();
      li.dataset.id = todo.id;
      li.draggable = true;
      li.tabIndex = 0; // Make the task item focusable

      // Drag and Drop event listeners for task item
      li.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', todo.id);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => li.classList.add('dragging'), 0);
      });

      li.addEventListener('dragend', () => {
        li.classList.remove('dragging');
        render(); // re-render to ensure DOM reflects exact store state if drag cancelled
      });

      const priorityLabel = todo.priority || 'medium';
      const dueDateHtml = todo.dueDate ? `<span class="todo-due-date ${isOverdue ? 'overdue-text' : ''}">期限: ${escapeHtml(todo.dueDate)}</span>` : '';

      li.innerHTML = `
        <div class="todo-left">
          <span class="drag-handle" title="ドラッグして移動" style="cursor: grab; color: var(--text-muted); margin-right: 4px; user-select: none;">#</span>
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
          ${!todo.completed ? `
          <select class="quadrant-select" data-id="${todo.id}">
            <option value="do_first" ${todo.quadrant === 'do_first' ? 'selected' : ''}>Do First</option>
            <option value="schedule" ${todo.quadrant === 'schedule' ? 'selected' : ''}>Schedule</option>
            <option value="delegate" ${todo.quadrant === 'delegate' ? 'selected' : ''}>Delegate</option>
            <option value="memo" ${todo.quadrant === 'memo' ? 'selected' : ''}>Memo</option>
          </select>
          ` : ''}
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
      // Click text to open Negative Impression Improvement Sheet Modal
      todoText.addEventListener('click', () => {
        openNegativeSheetModal(todo);
      });
      
      let isEditing = false;

      const startEditing = () => {
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
      };

      todoText.addEventListener('dblclick', startEditing);

      li.addEventListener('keydown', (e) => {
        if (e.key === 'F2') {
          e.preventDefault();
          startEditing();
        }
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

      // Event Listener: Quadrant Change
      const quadrantSelect = li.querySelector('.quadrant-select');
      if (quadrantSelect) {
        quadrantSelect.addEventListener('change', (e) => {
          store.updateQuadrant(todo.id, e.target.value);
          render();
        });
      }

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

      if (todo.completed) {
        if (listCompleted) listCompleted.appendChild(li);
      } else {
        const quad = todo.quadrant || 'do_first';
        if (quad === 'do_first' && listDoFirst) listDoFirst.appendChild(li);
        else if (quad === 'schedule' && listSchedule) listSchedule.appendChild(li);
        else if (quad === 'delegate' && listDelegate) listDelegate.appendChild(li);
        else if (quad === 'memo' && listMemo) listMemo.appendChild(li);
        else if (listDoFirst) listDoFirst.appendChild(li); // fallback
      }
    });
  }

  // Helper to determine the drop position within a column
  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // Setup Drag and Drop for Quadrant Columns
  const quadrantColumns = document.querySelectorAll('.quadrant-column');
  quadrantColumns.forEach(column => {
    const ul = column.querySelector('.todo-list');

    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      column.classList.add('drag-over');

      const afterElement = getDragAfterElement(ul, e.clientY);
      const draggable = document.querySelector('.dragging');
      if (draggable) {
        if (afterElement == null) {
          ul.appendChild(draggable);
        } else {
          ul.insertBefore(draggable, afterElement);
        }
      }
    });

    column.addEventListener('dragleave', () => {
      column.classList.remove('drag-over');
    });

    column.addEventListener('drop', (e) => {
      e.preventDefault();
      column.classList.remove('drag-over');
      
      const newQuadrant = column.dataset.quadrant;
      
      if (newQuadrant) {
        // Collect the ordered IDs from the DOM after insertion
        const orderedIds = [...ul.querySelectorAll('.todo-item')].map(li => li.dataset.id);
        if (orderedIds.length > 0) {
          store.reorderTodos(newQuadrant, orderedIds);
        }
        
        // Also ensure we handle cases where dropping across columns updates quadrant
        // for an item that we just moved, `reorderTodos` takes care of both quadrant update 
        // and ordering.
        render();
      }
    });
  });

  // Setup Scroll-Wheel Opacity Adjustment for Blinds
  const shutters = document.querySelectorAll('.blind-shutter');
  shutters.forEach(shutter => {
    let opacity = 1.0;
    let scrollTimeout;
    const badge = shutter.querySelector('.shutter-badge');
    
    if (badge) {
      badge.style.opacity = '0'; // default hidden
    }

    shutter.addEventListener('wheel', (e) => {
      // Only adjust if the column has blind-active
      const col = shutter.closest('.quadrant-column');
      if (!col || !col.classList.contains('blind-active')) return;
      
      e.preventDefault(); // Prevent default scroll
      
      if (e.deltaY < 0) {
        // Scroll up - increase opacity
        opacity = Math.min(1.0, opacity + 0.05);
      } else {
        // Scroll down - decrease opacity
        opacity = Math.max(0.3, opacity - 0.05);
      }
      
      shutter.style.opacity = opacity.toFixed(2);
      
      if (badge) {
        badge.textContent = Math.round(opacity * 100) + '%';
        badge.classList.add('scrolling');
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          badge.classList.remove('scrolling');
          badge.style.opacity = '0'; // ensure it fades out if class is removed
        }, 1000); // fade out after 1 second of no scrolling
      }
    });
  });

  // Setup Blind Toggle for Quadrants
  const blindBtns = document.querySelectorAll('.btn-blind');
  blindBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const col = btn.closest('.quadrant-column');
      if (col) {
        col.classList.toggle('blind-active');
      }
    });
  });
  const resizers = document.querySelectorAll('.column-resizer');
  resizers.forEach(resizer => {
    let isResizing = false;
    let startX = 0;
    let leftColWidth = 0;
    let rightColWidth = 0;
    let leftCol = null;
    let rightCol = null;

    resizer.addEventListener('mousedown', (e) => {
      isResizing = true;
      resizer.classList.add('resizing');
      startX = e.clientX;

      leftCol = resizer.previousElementSibling;
      rightCol = resizer.nextElementSibling;

      if (leftCol && rightCol) {
        leftColWidth = leftCol.getBoundingClientRect().width;
        rightColWidth = rightCol.getBoundingClientRect().width;
      }

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing || !leftCol || !rightCol) return;

      const dx = e.clientX - startX;
      const newLeftWidth = Math.max(140, leftColWidth + dx);
      const newRightWidth = Math.max(140, rightColWidth - dx);

      leftCol.style.flex = `0 0 ${newLeftWidth}px`;
      rightCol.style.flex = `0 0 ${newRightWidth}px`;
    });

    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        resizer.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });
  });

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
    const quadrant = quadrantInput ? quadrantInput.value : 'do_first';
    const dueDate = dateInput && dateInput.value ? dateInput.value : null;

    if (text) {
      store.addTodo(text, priority, dueDate, quadrant);
      input.value = '';
      if (priorityInput) priorityInput.value = 'medium';
      if (dateInput) dateInput.value = '';
      if (quadrantInput) quadrantInput.value = 'do_first';
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

  function openNegativeSheetModal(todo) {
    currentSheetTodoId = todo.id;
    sheetTaskName.textContent = `タスク: ${todo.text}`;
    
    const sheetData = todo.negativeSheet || Array.from({ length: 10 }, (_, i) => ({
      no: i + 1,
      description: '',
      expectedDifficulty: '',
      expectedSatisfaction: '',
      actualDifficulty: '',
      actualSatisfaction: ''
    }));

    sheetRowsContainer.innerHTML = '';
    sheetData.forEach((row, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.no}</td>
        <td><input type="text" class="sheet-desc" value="${escapeHtml(row.description || '')}" placeholder="内容を明示化..."></td>
        <td><input type="number" class="sheet-ed" min="1" max="10" value="${escapeHtml(row.expectedDifficulty || '')}" placeholder="1-10"></td>
        <td><input type="number" class="sheet-es" min="1" max="10" value="${escapeHtml(row.expectedSatisfaction || '')}" placeholder="1-10"></td>
        <td><input type="number" class="sheet-ad" min="1" max="10" value="${escapeHtml(row.actualDifficulty || '')}" placeholder="1-10"></td>
        <td><input type="number" class="sheet-as" min="1" max="10" value="${escapeHtml(row.actualSatisfaction || '')}" placeholder="1-10"></td>
      `;
      sheetRowsContainer.appendChild(tr);
    });

    // Reset action timer state
    if (timerInterval) clearInterval(timerInterval);
    btnTimer.disabled = false;
    btnTimer.textContent = '⚡ 5秒後に行動';

    modalNegativeSheet.style.display = 'flex';
  }

  function saveNegativeSheet() {
    if (!currentSheetTodoId) return;

    const rows = sheetRowsContainer.querySelectorAll('tr');
    const newSheetData = Array.from(rows).map((tr, idx) => ({
      no: idx + 1,
      description: tr.querySelector('.sheet-desc').value,
      expectedDifficulty: tr.querySelector('.sheet-ed').value,
      expectedSatisfaction: tr.querySelector('.sheet-es').value,
      actualDifficulty: tr.querySelector('.sheet-ad').value,
      actualSatisfaction: tr.querySelector('.sheet-as').value
    }));

    store.updateNegativeSheet(currentSheetTodoId, newSheetData);
  }

  btnSaveClose.addEventListener('click', () => {
    saveNegativeSheet();
    modalNegativeSheet.style.display = 'none';
    currentSheetTodoId = null;
  });

  btnPrint.addEventListener('click', () => {
    window.print();
  });

  btnTimer.addEventListener('click', () => {
    if (btnTimer.disabled) return;
    
    btnTimer.disabled = true;
    let timeLeft = 5;
    btnTimer.textContent = `${timeLeft}s...`;
    
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        btnTimer.textContent = `${timeLeft}s...`;
      } else {
        clearInterval(timerInterval);
        btnTimer.textContent = '⚡ Action!';
        setTimeout(() => {
          btnTimer.textContent = '⚡ 5秒後に行動';
          btnTimer.disabled = false;
        }, 2000);
      }
    }, 1000);
  });


  // Automated AM 6:00 check for Chatwork reminder
  function checkAndSendAutoReminder() {
    const now = new Date();
    const lastSentDateStr = localStorage.getItem('chatwork_last_sent_date');
    const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // Check if it's after 6:00 AM today and we haven't sent it yet today
    if (now.getHours() >= 6 && lastSentDateStr !== todayStr) {
      store.sendChatworkReminder().then(success => {
        if (success) {
          localStorage.setItem('chatwork_last_sent_date', todayStr);
          console.log('Automated Chatwork reminder sent successfully.');
        }
      });
    }
  }

  // Handle manual Chatwork reminder button
  if (btnSendReminder) {
    btnSendReminder.addEventListener('click', async () => {
      btnSendReminder.disabled = true;
      const originalText = btnSendReminder.textContent;
      btnSendReminder.textContent = '⏳ 送信中...';
      
      const success = await store.sendChatworkReminder();
      
      if (success) {
        btnSendReminder.textContent = '✅ 送信完了';
        // Optional: show a clean toast
        // alert('Chatworkにリマインドを送信しました。');
      } else {
        btnSendReminder.textContent = '❌ 送信失敗';
      }
      
      setTimeout(() => {
        btnSendReminder.disabled = false;
        btnSendReminder.textContent = originalText;
      }, 3000);
    });
  }

  // Initial check for auto reminder
  checkAndSendAutoReminder();

  // Initial Render
  render();
});
