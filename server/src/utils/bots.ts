import type { Server } from 'socket.io';
import type { Message } from '../types/message';
import type { User } from '../types/user';

export const createBotHandlers = (
  io: Server,
  messages: Message[],
  users: User[],
  userSocketMap: Map<string, Set<string>>,
  spamMessages: string[]
) => {
  const sendBotMessage = (botId: string, toUserId: string, text: string) => {
    const message: Message = {
      from: botId,
      to: toUserId,
      text,
      timestamp: Date.now(),
    };

    messages.push(message);

    const recipientSocketIds = userSocketMap.get(toUserId);
    if (recipientSocketIds) {
      recipientSocketIds.forEach((socketId) => {
        io.to(socketId).emit('receive-message', message);
      });
    }
  };

  const handleBotMessage = (
    botId: string,
    fromUserId: string,
    text: string
  ) => {
    switch (botId) {
      case 'bot-echo':
        sendBotMessage(botId, fromUserId, text);
        break;

      case 'bot-reverse':
        setTimeout(() => {
          sendBotMessage(botId, fromUserId, text.split('').reverse().join(''));
        }, 3000);
        break;

      case 'bot-spam':
      case 'bot-ignore':
        break;
    }
  };

  const startSpamBot = () => {
    const run = () => {
      const delay = 10_000 + Math.random() * (120_000 - 10_000);

      setTimeout(() => {
        const onlineUsers = users.filter(
          (u) => u.online && !u.id.startsWith('bot-')
        );
        if (onlineUsers.length > 0) {
          const user =
            onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
          const msg =
            spamMessages[Math.floor(Math.random() * spamMessages.length)];
          if (user && msg) sendBotMessage('bot-spam', user.id, msg);
        }
        run();
      }, delay);
    };
    run();
  };

  return { handleBotMessage, sendBotMessage, startSpamBot };
};
