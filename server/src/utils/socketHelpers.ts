import type { Server } from 'socket.io';
import type { User } from '../types/user.js';
import type { Message } from '../types/message.js';
import type { UserSocketMap } from '../types/appState.js';
import { isUserBot } from './bots.js';

export const addUserSocket = ({
  userSocketMap,
  userId,
  socketId,
}: {
  userSocketMap: UserSocketMap;
  userId: string;
  socketId: string;
}) => {
  if (!userSocketMap.has(userId)) {
    userSocketMap.set(userId, new Set());
  }
  userSocketMap.get(userId)?.add(socketId);
};

export const handleUserLogin = ({
  users,
  data,
}: {
  users: User[];
  data: Omit<User, 'online'>;
}) => {
  const { id: userId, name, avatar } = data;
  const existingUser = users.find((u) => u.id === userId);

  if (!existingUser) {
    const newUser: User = { id: userId, name, avatar, online: true };
    users.push(newUser);
    return { user: newUser, shouldBroadcast: true };
  }

  if (!existingUser.online) {
    existingUser.online = true;
    return { user: existingUser, shouldBroadcast: true };
  }

  return { user: existingUser, shouldBroadcast: false };
};

export const findUserIdBySocketId = ({
  userSocketMap,
  socketId,
}: {
  userSocketMap: UserSocketMap;
  socketId: string;
}) => {
  return [...userSocketMap.entries()].find(([_, socketIds]) =>
    socketIds.has(socketId)
  )?.[0];
};

export const sendMessageToRecipient = (
  io: Server,
  userSocketMap: UserSocketMap,
  toUserId: string,
  message: Message
) => {
  const recipientSocketIds = userSocketMap.get(toUserId);
  if (recipientSocketIds && recipientSocketIds.size > 0) {
    for (const socketId of recipientSocketIds) {
      io.to(socketId).emit('receive-message', message);
    }
  }
};

export const syncSenderDevices = ({
  io,
  userSocketMap,
  toUserId,
  message,
  currentSocketId,
}: {
  io: Server;
  userSocketMap: UserSocketMap;
  toUserId: string;
  message: Message;
  currentSocketId: string;
}) => {
  const senderSocketIds = userSocketMap.get(toUserId);
  if (senderSocketIds) {
    for (const socketId of senderSocketIds) {
      if (socketId !== currentSocketId) {
        io.to(socketId).emit('receive-message', message);
      }
    }
  }
};

export const handleUserDisconnect = ({
  socketId,
  userSocketMap,
  users,
}: {
  socketId: string;
  userSocketMap: UserSocketMap;
  users: User[];
}) => {
  const entry = [...userSocketMap.entries()].find(([_, socketIds]) =>
    socketIds.has(socketId)
  );

  if (!entry) return null;

  const [disconnectedUserId, socketIds] = entry;
  socketIds.delete(socketId);

  if (socketIds.size === 0) {
    userSocketMap.delete(disconnectedUserId);
    const user = users.find((u) => u.id === disconnectedUserId);

    if (user) {
      const isBot = isUserBot(user.id);
      if (!isBot) {
        user.online = false;
      }
      return { disconnectedUserId, isBot };
    }
  }

  return null;
};
