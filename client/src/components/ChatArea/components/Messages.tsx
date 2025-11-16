import { MESSAGE_TYPE } from '../../../const/message';
import type { Message } from '../../../types/message';
import type { User } from '../../../types/user';
import { getFilteredMessages } from '../../../utils/message';
import { MessageItem } from './MessageItem';

type MessagesProps = {
  user: User | null;
  messages: Message[];
  selectedContact: User | null;
};

export const Messages = ({
  user,
  messages,
  selectedContact,
}: MessagesProps) => (
  <div className="my-5 min-h-0 overflow-y-auto flex-1 mr-3">
    <div className="flex-1 p-4 space-y-4 min-h-0">
      {getFilteredMessages({ user, messages, selectedContact }).length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        getFilteredMessages({ user, messages, selectedContact }).map(
          (msg, index) => {
            const isMyMessage = msg.from === user?.id;
            return (
              <MessageItem
                key={index}
                text={msg.text}
                timestamp={msg.timestamp}
                userName={isMyMessage ? user.name : selectedContact?.name}
                variant={
                  isMyMessage ? MESSAGE_TYPE.sent : MESSAGE_TYPE.received
                }
              />
            );
          }
        )
      )}
    </div>
  </div>
);
