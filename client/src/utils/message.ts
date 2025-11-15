import type { Message } from '../types/message';
import type { User } from '../types/user';

export const getFilteredMessages = ({
  user,
  selectedContact,
  messages,
}: {
  user: User | null;
  selectedContact: User | null;
  messages: Message[];
}) => {
  if (!selectedContact || !user) return [];
  return messages.filter(
    (msg) =>
      (msg.from === user.id && msg.to === selectedContact.id) ||
      (msg.from === selectedContact.id && msg.to === user.id)
  );
};
