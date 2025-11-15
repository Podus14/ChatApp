import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' },
});

type User = {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
};

type Message = {
  from: string;
  to: string;
  text: string;
  timestamp: number;
};

const users: User[] = [];
const messages: Message[] = [];
const userSocketMap = new Map<string, Set<string>>();

io.on('connection', (socket: Socket) => {
  socket.on('init', (data: { id: string; name: string; avatar: string }) => {
    const { id: userId, name, avatar } = data;

    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId)!.add(socket.id);

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
    let fromUserId = '';
    for (const [userId, socketIds] of userSocketMap.entries()) {
      if (socketIds.has(socket.id)) {
        fromUserId = userId;
        break;
      }
    }

    const message: Message = {
      from: fromUserId,
      to: msg.to,
      text: msg.text,
      timestamp: Date.now(),
    };

    messages.push(message);

    const recipientSocketIds = userSocketMap.get(msg.to);

    if (recipientSocketIds && recipientSocketIds.size > 0) {
      recipientSocketIds.forEach((socketId) => {
        io.to(socketId).emit('receive-message', message);
      });
    }

    const senderSocketIds = userSocketMap.get(fromUserId);
    if (senderSocketIds) {
      senderSocketIds.forEach((socketId) => {
        if (socketId !== socket.id) {
          io.to(socketId).emit('receive-message', message);
        }
      });
    }
  });

  socket.on('disconnect', () => {
    let disconnectedUserId = '';
    for (const [userId, socketIds] of userSocketMap.entries()) {
      if (socketIds.has(socket.id)) {
        disconnectedUserId = userId;
        socketIds.delete(socket.id);

        if (socketIds.size === 0) {
          userSocketMap.delete(userId);
          const user = users.find((u) => u.id === userId);
          if (user) {
            user.online = false;
            io.emit('user-offline', { id: disconnectedUserId });
          }
        }
        break;
      }
    }
  });
});

httpServer.listen(3000, () => {
  console.log('Server running on port 3000');
});
