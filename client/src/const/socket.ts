export const SOCKET_EVENTS = {
  connect: 'connect',
  disconnect: 'disconnect',
  init: 'init',
  contacts: 'contacts',
  userOnline: 'user-online',
  userOfline: 'user-offline',
  receiveMessage: 'receive-message',
  sendMessage: 'send-message',
} as const;
