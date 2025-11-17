import { useState } from 'react';
import type { Message } from '../../types/message';
import type { User } from '../../types/user';
import { Input } from '../Input/Input';
import { socket } from '../../socket';
import { SendButton } from './components/SendButton';
import { Messages } from './components/Messages';
import { SOCKET_EVENTS } from '../../const/socket';

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

    socket.emit(SOCKET_EVENTS.sendMessage, {
      to: selectedContact.id,
      text: messageText,
    });
    onSetMessages([...messages, message]);
    setMessageText('');
  };

  return (
    <section className="flex-1 flex flex-col bg-chat-body min-h-0">
      {selectedContact ? (
        <>
          <Messages
            user={user}
            messages={messages}
            selectedContact={selectedContact}
          />
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
            <SendButton
              onSendMessage={handleSendMessage}
              messageText={messageText}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <p>Select a user to start chatting!</p>
          </div>
        </div>
      )}
    </section>
  );
};
