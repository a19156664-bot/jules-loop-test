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

  // Test 7: Update Priority
  store.clearTodos();
  const priorityTodo = store.addTodo('Priority Task');
  assert.strictEqual(priorityTodo.priority, 'medium', 'Default priority should be medium');
  const isPriorityUpdated = store.updatePriority(priorityTodo.id, 'high');
  assert.strictEqual(isPriorityUpdated, true, 'updatePriority should return true');
  const updatedPriorityTodo = store.getTodos().find(item => item.id === priorityTodo.id);
  assert.strictEqual(updatedPriorityTodo.priority, 'high', 'Priority should be updated to high');
  console.log('✅ Test 7 Passed: updatePriority()');

  // Test 8: isOverdue() helper
  const currentDate = new Date('2024-05-15');
  
  // Future date (not overdue)
  const futureTodo = store.addTodo('Future', 'medium', '2024-05-20');
  assert.strictEqual(store.isOverdue(futureTodo, currentDate), false);
  
  // Past date (overdue)
  const pastTodo = store.addTodo('Past', 'medium', '2024-05-10');
  assert.strictEqual(store.isOverdue(pastTodo, currentDate), true);
  
  // Same date (not overdue)
  const sameTodo = store.addTodo('Same', 'medium', '2024-05-15');
  assert.strictEqual(store.isOverdue(sameTodo, currentDate), false);
  
  // Completed past date (not overdue)
  const completedPastTodo = store.addTodo('Completed Past', 'medium', '2024-05-10');
  store.toggleTodo(completedPastTodo.id);
  const updatedCompletedPastTodo = store.getTodos().find(t => t.id === completedPastTodo.id);
  assert.strictEqual(store.isOverdue(updatedCompletedPastTodo, currentDate), false);

  console.log('✅ Test 8 Passed: isOverdue() helper');

  // Test 9: 削除処理の不変検証単体テスト (Delete operation invariance test)
  // Ensure the state remains unchanged if clear methods are not called (simulating user canceling dialog)
  store.clearTodos();
  const keepTodo = store.addTodo('Keep Me');
  store.toggleTodo(keepTodo.id);
  const keepActiveTodo = store.addTodo('Keep Me Active');
  
  // Simulate cancel by NOT calling clearTodos() or clearCompletedTodos()
  let currentTodos = store.getTodos();
  assert.strictEqual(currentTodos.length, 2, 'Todos should remain when not deleted');
  
  const foundKeepTodo = currentTodos.find(t => t.id === keepTodo.id);
  assert.strictEqual(foundKeepTodo.completed, true, 'State of kept todo should not be altered');
  
  const foundKeepActiveTodo = currentTodos.find(t => t.id === keepActiveTodo.id);
  assert.strictEqual(foundKeepActiveTodo.completed, false, 'State of kept active todo should not be altered');
  console.log('✅ Test 9 Passed: Delete operation invariance verification (simulate cancel)');

  // Test 10: Save and Get Theme
  store.saveTheme('pastel-green');
  const savedTheme = store.getTheme();
  assert.strictEqual(savedTheme, 'pastel-green', 'Saved theme should be pastel-green');
  
  store.saveTheme('light');
  const savedTheme2 = store.getTheme();
  assert.strictEqual(savedTheme2, 'light', 'Saved theme should be light');
  console.log('✅ Test 10 Passed: saveTheme() and getTheme() return correctly updated theme');

  // Test 11: Save and Get Font
  store.saveFont('noto-sans-jp');
  const savedFont = store.getFont();
  assert.strictEqual(savedFont, 'noto-sans-jp', 'Saved font should be noto-sans-jp');
  
  store.saveFont('meiryo');
  const savedFont2 = store.getFont();
  assert.strictEqual(savedFont2, 'meiryo', 'Saved font should be meiryo');
  console.log('✅ Test 11 Passed: saveFont() and getFont() return correctly updated font');

  console.log('🎉 All tests passed successfully!');
}

runTests();
