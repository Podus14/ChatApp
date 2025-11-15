import { useEffect, useState } from 'react';
import { USER_AVATARS } from './const/avatars';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import type { User } from './types/user';
import type { Message } from './types/message';
import { ContactSection } from './components/ContactSection/ContactSection';

const getRandomUser = () => {
  const name = 'User' + Math.floor(Math.random() * 1000);

  const randomAvatarName =
    USER_AVATARS[Math.floor(Math.random() * USER_AVATARS.length)];

  const avatar = `/user-avatars/${randomAvatarName}.jpg`;

  return { id: uuidv4(), name, avatar };
};

const getUser = () => {
  const storedUser = localStorage.getItem('chatUser');

  if (!storedUser) {
    const newUser = getRandomUser();

    localStorage.setItem('chatUser', JSON.stringify(newUser));
    return newUser;
  }

  const user = JSON.parse(storedUser);

  return user;
};

const socket: Socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling'],
});

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const user = getUser();

    Promise.resolve().then(() => setUser(user));

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('init', user);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
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

  const sendMessage = () => {
    if (!messageText.trim() || !selectedContact || !user) return;

    const message: Message = {
      from: user.id,
      to: selectedContact.id,
      text: messageText,
      timestamp: Date.now(),
    };

    socket.emit('send-message', { to: selectedContact.id, text: messageText });
    setMessages((prev) => [...prev, message]);
    setMessageText('');
  };

  const getFilteredMessages = () => {
    if (!selectedContact || !user) return [];
    return messages.filter(
      (msg) =>
        (msg.from === user.id && msg.to === selectedContact.id) ||
        (msg.from === selectedContact.id && msg.to === user.id)
    );
  };

  const handleFormatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSelectChat = (contact: User) => {
    setSelectedContact(contact);
  };

  return (
    <>
      <div className=" h-screen bg-primary w-screen">
        <header className="text-2xl pt-9 pb-5 bg-white w-full">
          <span className="container block font-semibold">Chat Bots 2.0</span>
        </header>
        <main className="container w-full mt-5">
          <div className="flex rounded-lg overflow-hidden bg-white">
            <div className="flex-col flex">
              <div className="flex gap-5 bg-chat-header">
                <img
                  className="max-w-[173px] max-h-[173px]"
                  src={user?.avatar}
                  alt="userImage"
                  width={173}
                  height={173}
                />
                <div className="flex flex-col mt-5">
                  <p className="text-xl font-semibold">{user?.name}</p>
                  <p className="text-sm">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Beatae, possimus suscipit rerum quis vel harum distinctio
                    optio adipisci perspiciatis doloribus assumenda. Aut nihil
                    dignissimos debitis quod ut blanditiis deserunt ab!
                  </p>
                </div>
              </div>
              <div>chat</div>
            </div>
            <ContactSection
              onSelectChat={handleSelectChat}
              contacts={contacts}
              selectedContact={selectedContact}
            />
          </div>
        </main>
      </div>
    </>
  );
}
