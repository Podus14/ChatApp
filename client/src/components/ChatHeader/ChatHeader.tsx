import type { User } from '../../types/user';
import { AvatarLoader } from './components/AvatarLoader';

type ChatHeaderProps = {
  selectedContact: User | null;
  user: User | null;
};

export const ChatHeader = ({ selectedContact, user }: ChatHeaderProps) => (
  <div className="flex gap-5 bg-chat-header">
    {!selectedContact && !user ? (
      <AvatarLoader />
    ) : (
      <img
        className="md:w-[173px] md:h-[173px] w-20 h-20"
        src={selectedContact?.avatar ?? user?.avatar}
        alt="User Image"
        width={173}
        height={173}
      />
    )}

    <div className="flex flex-col md:mt-5 min-w-0">
      <p className="md:text-xl font-semibold">{selectedContact?.name}</p>
      <p className="text-sm max-md:truncate ">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae,
        possimus suscipit rerum quis vel harum distinctio optio adipisci
        perspiciatis doloribus assumenda. Aut nihil dignissimos debitis quod ut
        blanditiis deserunt ab!
      </p>
    </div>
  </div>
);
