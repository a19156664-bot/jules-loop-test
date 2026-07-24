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
   * @param {string} font ('meiryo', 'noto-sans-jp', 'source-han-sans')
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
   * @returns {Object} The created todo item
   */
  addTodo(text, priority = 'medium', dueDate = null) {
    const todos = this.getTodos();
    const newTodo = {
      id: 'todo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      text: text.trim(),
      priority: priority,
      dueDate: dueDate,
      completed: false,
      createdAt: Date.now()
    };
    todos.unshift(newTodo);
    this.saveTodos(todos);
    return newTodo;
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
   * @returns {boolean} True if updated, false if not found
   */
  updateTodo(id, newText, newPriority, newDueDate) {
    const todos = this.getTodos();
    const todo = todos.find(item => item.id === id);
    if (todo) {
      if (newText !== undefined && newText !== null) todo.text = newText.trim();
      if (newPriority) todo.priority = newPriority;
      if (newDueDate !== undefined) todo.dueDate = newDueDate;
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
}

// Export for Node/Jest environment testing & browser global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TodoStore;
} else {
  window.TodoStore = TodoStore;
}
