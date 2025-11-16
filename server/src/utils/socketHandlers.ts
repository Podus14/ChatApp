import type { Server, Socket } from 'socket.io';
import {
  addUserSocket,
  findUserIdBySocketId,
  handleUserDisconnect,
  handleUserLogin,
  sendMessageToRecipient,
  syncSenderDevices,
} from './socketHelpers.js';
import type { AppState } from '../types/appState.js';

import type { Message } from '../types/message.js';
import type { User } from '../types/user.js';
import type { BotMessage } from '../types/bots.js';
import { isUserBot } from './bots.js';

const handleInit = ({ socket, state }: { socket: Socket; state: AppState }) => {
  const { users, userSocketMap } = state;

  socket.on('init', (data: Omit<User, 'online'>) => {
    addUserSocket({ userSocketMap, userId: data.id, socketId: socket.id });

    const { user, shouldBroadcast } = handleUserLogin({ users, data });

    if (shouldBroadcast) {
      socket.broadcast.emit('user-online', user);
    }

    const otherUsers = users.filter((u) => u.id !== data.id);
    socket.emit('contacts', otherUsers);
  });
};

const handleSendMessage = ({
  socket,
  io,
  state,
  handleBotMessage,
}: {
  socket: Socket;
  io: Server;
  state: AppState;
  handleBotMessage: ({ botId, toUserId, text }: BotMessage) => void;
}) => {
  const { messages, userSocketMap } = state;

  socket.on('send-message', (msg: { to: string; text: string }) => {
    const toUserId = findUserIdBySocketId({
      userSocketMap,
      socketId: socket.id,
    });
    if (!toUserId) return;

    const message: Message = {
      from: toUserId,
      to: msg.to,
      text: msg.text,
      timestamp: Date.now(),
    };
    messages.push(message);

    if (isUserBot(msg.to)) {
      handleBotMessage({ botId: msg.to, toUserId, text: msg.text });
    } else {
      sendMessageToRecipient(io, userSocketMap, msg.to, message);
    }

    syncSenderDevices({
      io,
      userSocketMap,
      toUserId,
      message,
      currentSocketId: socket.id,
    });
  });
};

const handleDisconnect = ({
  socket,
  io,
  state,
}: {
  socket: Socket;
  io: Server;
  state: AppState;
}) => {
  const { users, userSocketMap } = state;

  socket.on('disconnect', () => {
    const disconnectResult = handleUserDisconnect({
      socketId: socket.id,
      userSocketMap,
      users,
    });

    if (disconnectResult && !disconnectResult.isBot) {
      io.emit('user-offline', { id: disconnectResult.disconnectedUserId });
    }
  });
};

export const registerSocketHandlers = ({
  io,
  state,
  handleBotMessage,
}: {
  io: Server;
  state: AppState;
  handleBotMessage: ({ botId, toUserId, text }: BotMessage) => void;
}) => {
  io.on('connection', (socket: Socket) => {
    handleInit({ socket, state });
    handleSendMessage({ socket, io, state, handleBotMessage });
    handleDisconnect({ socket, io, state });
  });
};
