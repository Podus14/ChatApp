import { createServer } from 'http';
import { Server } from 'socket.io';
import { SPAM_MESSAGES } from './const/message.js';

import { createBotHandlers } from './utils/bots.js';

import { registerSocketHandlers } from './utils/socketHandlers.js';
import { appState } from './utils/state.js';

const httpServer = createServer((req, res) => {
  res.writeHead(404);
  res.end();
});

const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' },
});

const { users, messages, userSocketMap } = appState;

const { startSpamBot, handleBotMessage } = createBotHandlers({
  io,
  messages,
  users,
  userSocketMap: userSocketMap,
  spamMessages: SPAM_MESSAGES,
});

startSpamBot();

registerSocketHandlers({ io, state: appState, handleBotMessage });

httpServer.listen(3000, () => {
  console.log('Server running on port 3000');
});
