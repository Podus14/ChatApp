import { useState } from 'react';
import type { Message } from '../../types/message';
import type { User } from '../../types/user';
import { MessageItem } from '../MessageItem/MessageItem';
import { Input } from '../Input/Input';
import { socket } from '../../socket';
import { getFilteredMessages } from '../../utils/message';

type ChatAreaProps = {
  selectedContact: User | null;
  user: User | null;
  messages: Message[];
  onSetMessages: (messages: Message[]) => void;
};

export const ChatArea = ({
  selectedContact,
  user,
  messages,
  onSetMessages,
}: ChatAreaProps) => {
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedContact || !user) return;

    const message: Message = {
      from: user.id,
      to: selectedContact.id,
      text: messageText,
      timestamp: Date.now(),
    };

    socket.emit('send-message', { to: selectedContact.id, text: messageText });
    onSetMessages([...messages, message]);
    setMessageText('');
  };

  return (
    <div className="flex-1 flex flex-col bg-chat-body min-h-0">
      {selectedContact ? (
        <>
          <div className="my-5 min-h-0 overflow-y-auto flex-1 px-5">
            <div className="flex-1 p-4 space-y-4 min-h-0">
              {getFilteredMessages({ user, messages, selectedContact })
                .length === 0 ? (
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
                        userName={
                          isMyMessage ? user.name : selectedContact?.name
                        }
                        variant={isMyMessage ? 'sent' : 'received'}
                        seen={false}
                      />
                    );
                  }
                )
              )}
            </div>
          </div>

          {/* Message input - фиксированный внизу */}
          <div className="flex gap-2 p-4">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              className="bg-input-primary"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="text-sm bg-button text-white font-semibold text-nowrap px-[53px] rounded-lg hover:opacity-80 disabled:bg-primary disabled:cursor-not-allowed cursor-pointer"
            >
              Send message
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <p className="text-xl mb-2">👋</p>
            <p>Select a user to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
};
