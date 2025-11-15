export const MESSAGE_TYPE = {
  sent: 'sent',
  received: 'received',
} as const;

export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];
