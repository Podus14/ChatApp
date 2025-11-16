import type { Server } from 'socket.io';
import type { Message } from '../types/message';
import type { User } from '../types/user';
import type { UserSocketMap } from '../types/appState';
import type { BotMessage } from '../types/bots';

export const createBotHandlers = ({
  io,
  messages,
  users,
  userSocketMap,
  spamMessages,
}: {
  io: Server;
  messages: Message[];
  users: User[];
  userSocketMap: UserSocketMap;
  spamMessages: string[];
}) => {
  const sendBotMessage = ({ botId, toUserId, text }: BotMessage) => {
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

  const handleBotMessage = ({ botId, toUserId, text }: BotMessage) => {
    switch (botId) {
      case 'bot-echo':
        sendBotMessage({ botId, toUserId, text });
        break;

      case 'bot-reverse':
        setTimeout(() => {
          sendBotMessage({
            botId,
            toUserId,
            text: text.split('').reverse().join(''),
          });
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
        const onlineUsers = users.filter((u) => u.online && !isUserBot(u.id));
        if (onlineUsers.length > 0) {
          const user =
            onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
          const msg =
            spamMessages[Math.floor(Math.random() * spamMessages.length)];
          if (user && msg)
            sendBotMessage({ botId: 'bot-spam', toUserId: user.id, text: msg });
        }
        run();
      }, delay);
    };
    run();
  };

  return { handleBotMessage, sendBotMessage, startSpamBot };
};

export const isUserBot = (id: string) => id.startsWith('bot-');
