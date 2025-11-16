import { useEffect, useState } from 'react';
import type { User } from '../../types/user';
import type { Message } from '../../types/message';
import { getUser } from '../../utils/user';
import { ChatHeader } from '../ChatHeader/ChatHeader';
import { ChatArea } from '../ChatArea/ChatArea';
import { ContactSection } from '../ContactSection/ContactSection';
import { socket } from '../../socket';

export const Chat = () => {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);

  useEffect(() => {
    const user = getUser();

    Promise.resolve().then(() => setUser(user));

    socket.on('connect', () => {
      socket.emit('init', user);
    });

    socket.on('contacts', (users: User[]) => {
      setContacts(users);
    });

    socket.on('user-online', (newUser: User) => {
      setContacts((prev) => {
        if (newUser.id === user?.id) return prev;

        const existingIndex = prev.findIndex((u) => u.id === newUser.id);

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], online: true };
          return updated;
        } else {
          return [...prev, newUser];
        }
      });
    });

    socket.on('user-offline', (userData: { id: string }) => {
      setContacts((prev) =>
        prev.map((u) => (u.id === userData.id ? { ...u, online: false } : u))
      );

      setSelectedContact((current) =>
        current?.id === userData.id ? { ...current, online: false } : current
      );
    });

    socket.on('receive-message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('contacts');
      socket.off('user-online');
      socket.off('user-offline');
      socket.off('receive-message');
    };
  }, []);

  const handleSelectChat = (contact: User) => {
    setSelectedContact(contact);
  };

  return (
    <div className="h-screen bg-primary w-screen flex flex-col">
      <header className="text-2xl pt-9 pb-5 bg-white w-full">
        <span className="container block font-semibold">Chat Bots 2.0</span>
      </header>
      <main className="container w-full mt-5 flex-1 min-h-0">
        <div className="flex rounded-lg overflow-hidden bg-white h-[95%]">
          <div className="flex-col flex flex-1 min-w-0">
            <ChatHeader selectedContact={selectedContact} />
            <ChatArea
              user={user}
              selectedContact={selectedContact}
              onSetMessages={setMessages}
              messages={messages}
            />
          </div>
          <ContactSection
            onSelectChat={handleSelectChat}
            contacts={contacts}
            selectedContact={selectedContact}
          />
        </div>
      </main>
    </div>
  );
};
