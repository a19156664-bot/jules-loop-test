const fs = require('fs');
const content = fs.readFileSync('tests/store.test.js', 'utf8');

const test15 = `
  // Test 15: getDueOrOverdueTodos()
  store.clearTodos();
  const today = new Date();
  
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = \`\${yyyy}-\${mm}-\${dd}\`;
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yyyy2 = yesterday.getFullYear();
  const mm2 = String(yesterday.getMonth() + 1).padStart(2, '0');
  const dd2 = String(yesterday.getDate()).padStart(2, '0');
  const yesterdayStr = \`\${yyyy2}-\${mm2}-\${dd2}\`;
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yyyy3 = tomorrow.getFullYear();
  const mm3 = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd3 = String(tomorrow.getDate()).padStart(2, '0');
  const tomorrowStr = \`\${yyyy3}-\${mm3}-\${dd3}\`;

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
`;

const insertIndex = content.lastIndexOf("  console.log('🎉 All tests passed successfully!');");
const newContent = content.substring(0, insertIndex) + test15 + content.substring(insertIndex + 54); // +54 to remove the old line

fs.writeFileSync('tests/store.test.js', newContent);
