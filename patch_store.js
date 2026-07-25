const fs = require('fs');
const content = fs.readFileSync('js/store.js', 'utf8');

const getDueMethod = `
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
   * @returns {Promise<boolean>} True if successful or safely caught
   */
  async sendChatworkReminder(currentDate = new Date()) {
    try {
      const dueTodos = this.getDueOrOverdueTodos(currentDate);
      if (dueTodos.length === 0) {
        return true; // Nothing to send
      }

      const taskList = dueTodos.map(t => \`- \${t.text} (期限: \${t.dueDate})\`).join('\\n');
      const message = \`[info][title]🔔 リマインド: 本日・期限切れのタスクがあります[/title]\${taskList}[/info]\`;

      const response = await fetch('https://api.chatwork.com/v2/rooms/385392979/messages', {
        method: 'POST',
        headers: {
          'X-ChatWorkToken': 'e8e8e25a481d270457a2fd7adb4e0af9',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ body: message })
      });
      
      if (!response.ok) {
        console.warn('Chatwork API request failed:', response.status);
      }
      return true;
    } catch (e) {
      console.warn('Failed to send Chatwork reminder:', e);
      return false;
    }
  }
`;

const insertIndex = content.lastIndexOf('}');
const newContent = content.substring(0, insertIndex) + getDueMethod + content.substring(insertIndex);
fs.writeFileSync('js/store.js', newContent);
