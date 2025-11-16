import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { BOTS } from './const/bots.js';
import { SPAM_MESSAGES } from './const/message.js';
import type { User } from './types/user.js';
import type { Message } from './types/message.js';
import { createBotHandlers } from './utils/bots.js';

const httpServer = createServer((req, res) => {
  res.writeHead(404);
  res.end();
});

const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' },
});

const users: User[] = [];
const messages: Message[] = [];
const userSocketMap = new Map<string, Set<string>>();

users.push(...BOTS);

const { handleBotMessage, startSpamBot } = createBotHandlers(
  io,
  messages,
  users,
  userSocketMap,
  SPAM_MESSAGES
);

startSpamBot();

io.on('connection', (socket: Socket) => {
  socket.on('init', (data: { id: string; name: string; avatar: string }) => {
    const { id: userId, name, avatar } = data;

    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    const userIdMap = userSocketMap.get(userId);

    if (userIdMap) {
      userIdMap.add(socket.id);
    }

    const existingUser = users.find((u) => u.id === userId);

    if (!existingUser) {
      users.push({
        id: userId,
        name: name,
        avatar: avatar,
        online: true,
      });

      socket.broadcast.emit('user-online', {
        id: userId,
        name: name,
        avatar: avatar,
        online: true,
      });
    } else {
      if (!existingUser.online) {
        existingUser.online = true;

        socket.broadcast.emit('user-online', {
          id: userId,
          name: name,
          avatar: avatar,
          online: true,
        });
      }
    }

    const otherUsers = users.filter((u) => u.id !== userId);
    socket.emit('contacts', otherUsers);
  });

  socket.on('send-message', (msg: { to: string; text: string }) => {
    const fromUserId = [...userSocketMap.entries()].find(([_, socketIds]) =>
      socketIds.has(socket.id)
    )?.[0];

    if (!fromUserId) return;

    const message: Message = {
      from: fromUserId,
      to: msg.to,
      text: msg.text,
      timestamp: Date.now(),
    };

    messages.push(message);

    if (msg.to.startsWith('bot-')) {
      handleBotMessage(msg.to, fromUserId, msg.text);
    } else {
      const recipientSocketIds = userSocketMap.get(msg.to);

      if (recipientSocketIds && recipientSocketIds.size > 0) {
        for (const socketId of recipientSocketIds) {
          io.to(socketId).emit('receive-message', message);
        }
      }
    }

    const senderSocketIds = userSocketMap.get(fromUserId);

    if (senderSocketIds) {
      for (const socketId of senderSocketIds) {
        if (socketId !== socket.id) {
          io.to(socketId).emit('receive-message', message);
        }
      }
    }
  });

  socket.on('disconnect', () => {
    const entry = [...userSocketMap.entries()].find(([_, socketIds]) =>
      socketIds.has(socket.id)
    );

    if (!entry) return;

    const [disconnectedUserId, socketIds] = entry;
    socketIds.delete(socket.id);

    if (socketIds.size === 0) {
      userSocketMap.delete(disconnectedUserId);
      const user = users.find((u) => u.id === disconnectedUserId);
      if (user && !user.id.startsWith('bot-')) {
        user.online = false;
        io.emit('user-offline', { id: disconnectedUserId });
      }
    }
  });
});

httpServer.listen(3000, () => {
  console.log('Server running on port 3000');
});
