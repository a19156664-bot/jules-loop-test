/**
 * TodoStore - Handles local storage persistence for TODO items.
 */
class TodoStore {
  constructor(storageKey = 'focus_todo_items') {
    this.storageKey = storageKey;
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
   * @returns {Object} The created todo item
   */
  addTodo(text) {
    const todos = this.getTodos();
    const newTodo = {
      id: 'todo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      text: text.trim(),
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
   * @returns {boolean} New status
   */
  toggleTodo(id) {
    const todos = this.getTodos();
    const todo = todos.find(item => item.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos(todos);
      return todo.completed;
    }
    return false;
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
}

// Export for Node/Jest environment testing & browser global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TodoStore;
} else {
  window.TodoStore = TodoStore;
}
