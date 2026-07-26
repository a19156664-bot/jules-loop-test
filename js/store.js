/**
 * TodoStore - Handles local storage persistence for TODO items.
 */
class TodoStore {
  constructor(storageKey = 'focus_todo_items') {
    this.storageKey = storageKey;
    this.themeStorageKey = 'focus_todo_theme';
    this.fontStorageKey = 'focus_todo_font';
  }

  /**
   * Fetch saved font from LocalStorage
   * @returns {string} The saved font
   */
  getFont() {
    try {
      const font = localStorage.getItem(this.fontStorageKey);
      return font || 'meiryo';
    } catch (e) {
      console.error('Failed to load font from localStorage:', e);
      return 'meiryo';
    }
  }

  /**
   * Save font to LocalStorage
   * @param {string} font ('meiryo', 'yu-gothic', 'biz-ud-gothic')
   */
  saveFont(font) {
    try {
      localStorage.setItem(this.fontStorageKey, font);
    } catch (e) {
      console.error('Failed to save font to localStorage:', e);
    }
  }

  /**
   * Fetch saved theme from LocalStorage
   * @returns {string} The saved theme ('dark', 'light', 'pastel-green') or 'dark' default
   */
  getTheme() {
    try {
      const theme = localStorage.getItem(this.themeStorageKey);
      return theme || 'dark';
    } catch (e) {
      console.error('Failed to load theme from localStorage:', e);
      return 'dark';
    }
  }

  /**
   * Save theme to LocalStorage
   * @param {string} theme ('dark', 'light', 'pastel-green')
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(this.themeStorageKey, theme);
    } catch (e) {
      console.error('Failed to save theme to localStorage:', e);
    }
  }

  /**
   * Fetch all todos from LocalStorage
   * @returns {Array<{id: string, text: string, completed: boolean, createdAt: number}>}
   */
  getTodos() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load todos from localStorage:', e);
      return [];
    }
  }

  /**
   * Save todos array to LocalStorage
   * @param {Array} todos 
   */
  saveTodos(todos) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(todos));
    } catch (e) {
      console.error('Failed to save todos to localStorage:', e);
    }
  }

  /**
   * Add a new todo item
   * @param {string} text 
   * @param {string} priority - Priority of the task (high, medium, low)
   * @param {string|null} dueDate - Due date in YYYY-MM-DD format
   * @param {string} quadrant - Quadrant of the task (do_first, schedule, delegate, memo)
   * @returns {Object} The created todo item
   */
  addTodo(text, priority = 'medium', dueDate = null, quadrant = 'do_first') {
    const todos = this.getTodos();

    // Initialize empty negative sheet with 10 rows
    const emptySheet = Array.from({ length: 10 }, (_, i) => ({
      no: i + 1,
      description: '',
      expectedDifficulty: '',
      expectedSatisfaction: '',
      actualDifficulty: '',
      actualSatisfaction: ''
    }));

    const newTodo = {
      id: 'todo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      text: text.trim(),
      priority: priority,
      dueDate: dueDate,
      quadrant: quadrant,
      completed: false,
      createdAt: Date.now(),
      negativeSheet: emptySheet
    };
    todos.push(newTodo);
    this.saveTodos(todos);
    return newTodo;
  }

  /**
   * Update the negative sheet data of a todo item
   * @param {string} id 
   * @param {Array} sheetData 
   * @returns {boolean} True if updated, false if not found
   */
  updateNegativeSheet(id, sheetData) {
    const todos = this.getTodos();
    const todo = todos.find(item => item.id === id);
    if (todo) {
      todo.negativeSheet = sheetData;
      this.saveTodos(todos);
      return true;
    }
    return false;
  }

  /**
   * Toggle completed status of a todo item
   * @param {string} id 
   * @returns {boolean} True if found and toggled, false otherwise
   */
  toggleTodo(id) {
    const todos = this.getTodos();
    const todo = todos.find(item => item.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos(todos);
      return true;
    }
    return false;
  }

  /**
   * Update the text of a todo item
   * @param {string} id 
   * @param {string} newText 
   * @param {string} [newPriority] - Optional new priority
   * @param {string|null} [newDueDate] - Optional new due date
   * @param {string} [newQuadrant] - Optional new quadrant
   * @returns {boolean} True if updated, false if not found
   */
  updateTodo(id, newText, newPriority, newDueDate, newQuadrant) {
    const todos = this.getTodos();
    const todo = todos.find(item => item.id === id);
    if (todo) {
      if (newText !== undefined && newText !== null) todo.text = newText.trim();
      if (newPriority) todo.priority = newPriority;
      if (newDueDate !== undefined) todo.dueDate = newDueDate;
      if (newQuadrant) todo.quadrant = newQuadrant;
      this.saveTodos(todos);
      return true;
    }
    return false;
  }

  /**
   * Update the quadrant of a todo item
   * @param {string} id 
   * @param {string} quadrant - Quadrant of the task (do_first, schedule, delegate, memo)
   * @returns {boolean} True if updated, false if not found
   */
  updateQuadrant(id, quadrant) {
    const todos = this.getTodos();
    const todo = todos.find(item => item.id === id);
    if (todo) {
      todo.quadrant = quadrant;
      this.saveTodos(todos);
      return true;
    }
    return false;
  }

  /**
   * Update the priority of a todo item
   * @param {string} id 
   * @param {string} priority - Priority of the task (high, medium, low)
   * @returns {boolean} True if updated, false if not found
   */
  updatePriority(id, priority) {
    const todos = this.getTodos();
    const todo = todos.find(item => item.id === id);
    if (todo) {
      todo.priority = priority;
      this.saveTodos(todos);
      return true;
    }
    return false;
  }

  /**
   * Update the quadrant of a todo item
   * @param {string} id 
   * @param {string} quadrant - Quadrant of the task (do_first, schedule, delegate, memo)
   * @returns {boolean} True if updated, false if not found
   */
  updateQuadrant(id, quadrant) {
    const todos = this.getTodos();
    const todo = todos.find(item => item.id === id);
    if (todo) {
      todo.quadrant = quadrant;
      this.saveTodos(todos);
      return true;
    }
    return false;
  }

  /**
   * Reorder todos within a specific quadrant
   * @param {string} quadrant - Quadrant of the tasks
   * @param {Array<string>} orderedIds - Array of todo IDs in the new order
   */
  reorderTodos(quadrant, orderedIds) {
    const todos = this.getTodos();
    const indices = [];
    const orderedItems = [];

    // Collect the current indices of the items that are being reordered
    todos.forEach((t, index) => {
      if (orderedIds.includes(t.id)) {
        indices.push(index);
      }
    });

    // Map orderedIds to actual todo objects in the new order
    orderedIds.forEach(id => {
      const todo = todos.find(t => t.id === id);
      if (todo) {
        todo.quadrant = quadrant; // Ensure quadrant is updated
        orderedItems.push(todo);
      }
    });

    // Place them back in the collected indices
    orderedItems.forEach((item, i) => {
      if (indices[i] !== undefined) {
        todos[indices[i]] = item;
      }
    });

    this.saveTodos(todos);
  }

  /**
   * Helper to check if a todo item is overdue
   * @param {Object} todo 
   * @param {Date|string} currentDate 
   * @returns {boolean} True if overdue and not completed
   */
  isOverdue(todo, currentDate = new Date()) {
    if (!todo || !todo.dueDate || todo.completed) return false;
    const due = new Date(todo.dueDate);
    due.setHours(0, 0, 0, 0);
    const current = new Date(currentDate);
    current.setHours(0, 0, 0, 0);
    return due.getTime() < current.getTime();
  }

  /**
   * Delete a todo item by id
   * @param {string} id 
   */
  deleteTodo(id) {
    let todos = this.getTodos();
    todos = todos.filter(item => item.id !== id);
    this.saveTodos(todos);
  }

  /**
   * Clear all todo items
   */
  clearTodos() {
    this.saveTodos([]);
  }

  /**
   * Clear all completed todo items
   */
  clearCompletedTodos() {
    let todos = this.getTodos();
    todos = todos.filter(item => !item.completed);
    this.saveTodos(todos);
  }

  /**
   * Get all active (uncompleted) todos that are due today or overdue
   * @param {Date|string} currentDate 
   * @returns {Array} Array of due/overdue todos
   */
  getDueOrOverdueTodos(currentDate = new Date()) {
    const todos = this.getTodos();
    const current = new Date(currentDate);
    current.setHours(0, 0, 0, 0);

    return todos.filter(todo => {
      if (todo.completed || !todo.dueDate) return false;
      const due = new Date(todo.dueDate);
      due.setHours(0, 0, 0, 0);
      return due.getTime() <= current.getTime();
    });
  }

  /**
   * Send a Chatwork reminder for due or overdue tasks
   * @param {Date|string} currentDate
   * @returns {Promise<Object>} Status object { success: boolean, count: number, reason?: string, details?: string }
   */
  async sendChatworkReminder(currentDate = new Date()) {
    try {
      const dueTodos = this.getDueOrOverdueTodos(currentDate);
      if (dueTodos.length === 0) {
        return { success: true, count: 0, reason: 'no_tasks' }; // Nothing to send
      }

      const taskList = dueTodos.map(t => `・${t.text} (期限: ${t.dueDate})`).join('\n');
      const message = `[info][title]⏰ Focus TODO リマインダー[/title]以下のタスクが期限当日または超過しています:\n${taskList}[/info]`;

      const token = 'e8e8e25a481d270457a2fd7adb4e0af9';
      const roomId = '385392979';
      const targetUrl = `https://api.chatwork.com/v2/rooms/${roomId}/messages`;
      const bodyParams = new URLSearchParams({ body: message });

      // Check if user has configured a custom webhook / proxy endpoint in localStorage
      if (typeof localStorage !== 'undefined') {
        const customEndpoint = localStorage.getItem('chatwork_custom_endpoint');
        if (customEndpoint) {
          try {
            const res = await fetch(customEndpoint, {
              method: 'POST',
              headers: { 
                'X-ChatWorkToken': token,
                'Content-Type': 'application/x-www-form-urlencoded' 
              },
              body: bodyParams
            });
            if (res.ok) {
              return { success: true, count: dueTodos.length };
            } else {
              return { success: false, reason: 'custom_endpoint_error', details: `HTTP Status: ${res.status}` };
            }
          } catch (err) {
            console.warn('Custom endpoint failed:', err);
            return { success: false, count: dueTodos.length, reason: 'custom_endpoint_failed', details: err.message };
          }
        }
      }

      // 1. First priority: Direct fetch (Fastest & 100% stable when Allow CORS extension is ON or on same domain)
      try {
        const directRes = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'X-ChatWorkToken': token,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: bodyParams
        });
        if (directRes && directRes.ok) {
          return { success: true, count: dueTodos.length };
        } else if (directRes) {
          // If response is not ok (e.g. 401 Unauthorized), we might still want to try proxies? 
          // Usually if it's 401, proxies will also get 401. So returning error might be better.
          if (directRes.status !== 0 && directRes.status !== 401) {
             // Let it fallback to proxy if it's CORS? Actually CORS error throws exception. 
             // If it's a real HTTP error, returning false is right.
             return { success: false, count: dueTodos.length, reason: 'api_error', details: `HTTP Status: ${directRes.status}` };
          } else if (directRes.status === 401) {
             return { success: false, count: dueTodos.length, reason: 'api_error', details: `HTTP Status: ${directRes.status}` };
          }
        }
      } catch (directErr) {
        console.warn('Direct fetch blocked by browser CORS, trying proxy services:', directErr);
      }

      // 2. Second priority: Try CORS proxy services sequentially as backup
      const proxyList = [
        `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
        `https://thingproxy.freeboard.io/fetch/${targetUrl}`
      ];

      for (const proxy of proxyList) {
        try {
          const response = await fetch(proxy, {
            method: 'POST',
            headers: {
              'X-ChatWorkToken': token,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: bodyParams
          });
          if (response && response.ok) {
            return { success: true, count: dueTodos.length };
          } else if (response) {
            // Not throwing, so we got a response but not ok.
            console.warn(`Proxy ${proxy} returned status ${response.status}`);
          }
        } catch (pErr) {
          console.warn('Proxy attempt failed:', pErr);
        }
      }

      return {
        success: false,
        count: dueTodos.length,
        reason: 'cors_blocked',
        details: 'ブラウザセキュリティ(CORS)によりChatwork APIへの直通信が制限されています。またはAPIキーが無効です。'
      };
    } catch (e) {
      console.warn('Failed to send Chatwork reminder:', e);
      return { success: false, count: 0, reason: 'network_error', details: e.message };
    }
  }
}

// Export for Node/Jest environment testing & browser global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TodoStore;
} else {
  window.TodoStore = TodoStore;
}
