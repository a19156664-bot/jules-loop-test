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

  // Test 12: Eisenhower Matrix quadrant assignment and completed drawer filter
  store.clearTodos();
  const qTodo1 = store.addTodo('Q Task 1', 'high', null, 'schedule');
  assert.strictEqual(qTodo1.quadrant, 'schedule', 'Quadrant should be schedule on creation');

  const isQuadUpdated = store.updateQuadrant(qTodo1.id, 'delegate');
  assert.strictEqual(isQuadUpdated, true, 'updateQuadrant should return true');
  const updatedQTodo = store.getTodos().find(item => item.id === qTodo1.id);
  assert.strictEqual(updatedQTodo.quadrant, 'delegate', 'Quadrant should be updated to delegate');
  
  // Create a completed task to test separation logic equivalent
  const qTodoCompleted = store.addTodo('Completed Q Task', 'low', null, 'do_first');
  store.toggleTodo(qTodoCompleted.id);
  
  const allTodos = store.getTodos();
  const activeTodos = allTodos.filter(t => !t.completed);
  const completedTodos = allTodos.filter(t => t.completed);

  assert.strictEqual(activeTodos.length, 1, 'Should have 1 active task');
  assert.strictEqual(activeTodos[0].quadrant, 'delegate', 'Active task should be in delegate quadrant');
  assert.strictEqual(completedTodos.length, 1, 'Should have 1 completed task');
  assert.strictEqual(completedTodos[0].id, qTodoCompleted.id, 'Completed task should match');
  console.log('✅ Test 12 Passed: Eisenhower Matrix quadrant assignment and completed drawer filter');

  // Test 13: Negative sheet data persistence
  store.clearTodos();
  const sheetTodo = store.addTodo('Sheet Task');
  assert.strictEqual(Array.isArray(sheetTodo.negativeSheet), true, 'negativeSheet should be an array');
  assert.strictEqual(sheetTodo.negativeSheet.length, 10, 'negativeSheet should have 10 rows');

  const newSheetData = Array.from({ length: 10 }, (_, i) => ({
    no: i + 1,
    description: `Test Description ${i + 1}`,
    expectedDifficulty: '5',
    expectedSatisfaction: '8',
    actualDifficulty: '3',
    actualSatisfaction: '9'
  }));
  const isSheetUpdated = store.updateNegativeSheet(sheetTodo.id, newSheetData);
  assert.strictEqual(isSheetUpdated, true, 'updateNegativeSheet should return true');
  
  const updatedSheetTodo = store.getTodos().find(item => item.id === sheetTodo.id);
  assert.deepStrictEqual(updatedSheetTodo.negativeSheet, newSheetData, 'Saved negativeSheet should match new data');
  console.log('✅ Test 13 Passed: Negative sheet data persistence');

  // Test 14: reorderTodos()
  store.clearTodos();
  const t1 = store.addTodo('Task 1', 'medium', null, 'schedule');
  const t2 = store.addTodo('Task 2', 'medium', null, 'schedule');
  const t3 = store.addTodo('Task 3', 'medium', null, 'schedule');
  
  // Also add a task in a different quadrant to ensure it is not affected
  const t4 = store.addTodo('Task 4', 'medium', null, 'do_first');
  
  // Reorder t1, t2, t3 -> t3, t1, t2
  store.reorderTodos('schedule', [t3.id, t1.id, t2.id]);
  
  const reorderedTodos = store.getTodos();
  
  // t4 should be first since it wasn't reordered and is untouched
  // the rest should be t3, t1, t2 as they were collected and put back in the same indices
  // Original array: [t1, t2, t3, t4]
  // Indices to reorder: 0, 1, 2
  // New order at those indices: [t3, t1, t2] -> final array: [t3, t1, t2, t4]
  
  assert.strictEqual(reorderedTodos[0].id, t3.id);
  assert.strictEqual(reorderedTodos[1].id, t1.id);
  assert.strictEqual(reorderedTodos[2].id, t2.id);
  assert.strictEqual(reorderedTodos[3].id, t4.id);
  console.log('✅ Test 14 Passed: reorderTodos() correctly reorders items within quadrant');

  // Test 15: getDueOrOverdueTodos()
  store.clearTodos();
  const today = new Date();
  
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yyyy2 = yesterday.getFullYear();
  const mm2 = String(yesterday.getMonth() + 1).padStart(2, '0');
  const dd2 = String(yesterday.getDate()).padStart(2, '0');
  const yesterdayStr = `${yyyy2}-${mm2}-${dd2}`;
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yyyy3 = tomorrow.getFullYear();
  const mm3 = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd3 = String(tomorrow.getDate()).padStart(2, '0');
  const tomorrowStr = `${yyyy3}-${mm3}-${dd3}`;

  const dueTodayTask = store.addTodo('Due Today', 'medium', todayStr);
  const dueYesterdayTask = store.addTodo('Due Yesterday', 'medium', yesterdayStr);
  const dueTomorrowTask = store.addTodo('Due Tomorrow', 'medium', tomorrowStr);
  const noDueDateTask = store.addTodo('No Due Date', 'medium', null);
  
  const completedDueYesterday = store.addTodo('Completed Due Yesterday', 'medium', yesterdayStr);
  store.toggleTodo(completedDueYesterday.id);

  const dueTodos = store.getDueOrOverdueTodos(today);
  
  assert.strictEqual(dueTodos.length, 2, 'Should only return due or overdue active tasks');
  const dueIds = dueTodos.map(t => t.id);
  assert.strictEqual(dueIds.includes(dueTodayTask.id), true, 'Due today task should be included');
  assert.strictEqual(dueIds.includes(dueYesterdayTask.id), true, 'Due yesterday task should be included');
  assert.strictEqual(dueIds.includes(dueTomorrowTask.id), false, 'Due tomorrow task should NOT be included');
  assert.strictEqual(dueIds.includes(noDueDateTask.id), false, 'No due date task should NOT be included');
  assert.strictEqual(dueIds.includes(completedDueYesterday.id), false, 'Completed task should NOT be included');

  console.log('✅ Test 15 Passed: getDueOrOverdueTodos() filters logic correctly');

  console.log('🎉 All tests passed successfully!');
}

runTests();
