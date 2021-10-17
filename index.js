const GD = require("gd.js") // Import GD.js

// If not in Node.js, set the corsURL to some CORS proxy
// You can set up your own with Heroku from https://github.com/Rob--W/cors-anywhere
const gd = new GD();

// Wait for "time" milliseconds
const wait = time => new Promise(resolve => setTimeout(resolve, time));

// Get all the new messages since "messageId"
async function messagesUpTo(user, messageId) {
  if (messageId == null) return user.getMessages(10);
  for (let i = 10;; i *= 2) {
    // Get the 10 most recent messages
    let fetchedMessages = await user.getMessages(i);
    const index = fetchedMessages.findIndex(msg => msg.id == messageId);
    if (index != -1) return fetchedMessages.slice(0, index);
  }
}

async function sevenBot() {
  const me = await gd.users.login({ username: process.env.username, password: process.env.password });
  // The most recent message ID that was received
  let lastMessageId = null;
  // Constantly check messages
  while (true) {
    const messages = await messagesUpTo(me, lastMessageId);
    lastMessageId = messages[0].id;
    for (const message of messages) {
      if (message.subject == 'YOUR_SUBJECT') {
        // If you need the body of the message:
        // const messageBody = (await message.resolve()).body;
        await user.sendMessage(message.from.accountID, 'your_outgoing_subject', 'your_outgoing_body');
      }
    }
    // Wait 15 seconds before checking again
    await wait(15 * 1000); 
  }
}

sevenBot();
