const fs = require('fs');
const content = fs.readFileSync('js/app.js', 'utf8');

// 1. Add #btn-send-reminder selector
const selectorAdd = `
  const btnSettings = document.getElementById('btn-settings');
  const btnSendReminder = document.getElementById('btn-send-reminder');
  const modalSettings = document.getElementById('modal-settings');
`;
let newContent = content.replace(
  "  const btnSettings = document.getElementById('btn-settings');\n  const modalSettings = document.getElementById('modal-settings');",
  selectorAdd
);

// 2. Add Chatwork reminder listener and auto-check logic
const reminderLogic = `
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
`;

newContent = newContent.replace("  // Initial Render\n", reminderLogic);
fs.writeFileSync('js/app.js', newContent);
