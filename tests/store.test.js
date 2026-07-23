/**
 * Unit Test for TodoStore (Node.js test runner)
 */
const assert = require('assert');

// Mock localStorage for Node environment
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  clear() {
    this.store = {};
  }
}
global.localStorage = new MockLocalStorage();

const TodoStore = require('../js/store.js');

function runTests() {
  console.log('🧪 Running TodoStore Unit Tests...');

  const store = new TodoStore('test_todo_store');

  // Test 1: Add Todo
  const todo1 = store.addTodo('Test Task 1');
  assert.strictEqual(todo1.text, 'Test Task 1');
  assert.strictEqual(todo1.completed, false);
  assert.strictEqual(store.getTodos().length, 1);
  console.log('✅ Test 1 Passed: addTodo()');

  // Test 2: Toggle Todo
  const isCompleted = store.toggleTodo(todo1.id);
  assert.strictEqual(isCompleted, true);
  assert.strictEqual(store.getTodos()[0].completed, true);
  console.log('✅ Test 2 Passed: toggleTodo()');

  // Test 3: Delete Todo
  store.deleteTodo(todo1.id);
  assert.strictEqual(store.getTodos().length, 0);
  console.log('✅ Test 3 Passed: deleteTodo()');

  // Test 4: Clear Todos
  store.addTodo('Test Task A');
  store.addTodo('Test Task B');
  assert.strictEqual(store.getTodos().length, 2);
  store.clearTodos();
  assert.strictEqual(store.getTodos().length, 0);
  console.log('✅ Test 4 Passed: clearTodos()');

  // Test 5: Clear Completed Todos
  store.clearTodos();
  const item1 = store.addTodo('Active Task');
  const item2 = store.addTodo('Completed Task');
  store.toggleTodo(item2.id);
  assert.strictEqual(store.getTodos().length, 2);
  store.clearCompletedTodos();
  const remaining = store.getTodos();
  assert.strictEqual(remaining.length, 1);
  assert.strictEqual(remaining[0].id, item1.id);
  assert.strictEqual(remaining[0].text, 'Active Task');
  console.log('✅ Test 5 Passed: clearCompletedTodos()');

  // Test 6: Update Todo
  store.clearTodos();
  const itemToUpdate = store.addTodo('Old Text');
  const isUpdated = store.updateTodo(itemToUpdate.id, 'New Text');
  assert.strictEqual(isUpdated, true);
  const updatedItem = store.getTodos().find(item => item.id === itemToUpdate.id);
  assert.strictEqual(updatedItem.text, 'New Text');
  console.log('✅ Test 6 Passed: updateTodo()');

  console.log('🎉 All tests passed successfully!');
}

runTests();
