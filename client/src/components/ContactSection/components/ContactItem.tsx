import type { User } from '../../../types/user';
import { cn } from '../../../utils/cn';
import { StatusDot } from './StatusDot';

type ContactItemProps = {
  contact: User;
  selectedContact: User | null;
  onSelectChat: (contact: User) => void;
};

export const ContactItem = ({
  contact,
  selectedContact,
  onSelectChat,
}: ContactItemProps) => {
  const { id, name, avatar, online } = contact;

  return (
    <button
      key={id}
      className={cn(
        ' flex gap-4 items-center py-1 cursor-pointer max-md:justify-center px-4',
        selectedContact?.id === contact.id ? 'bg-selected' : 'hover:bg-selected'
      )}
      onClick={() => onSelectChat(contact)}
    >
      <div className="relative md:w-full">
        <img
          src={avatar}
          alt="contact avatar"
          className="w-20 h-20 md:w-[60px] md:min-w-[60px] md:h-[60px] relative"
        />
        <StatusDot online={online} />
      </div>
      <div className="flex-col text-left hidden md:flex">
        <p className="font-semibold">{name}</p>
        <p className="text-sm line-clamp-2">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit
          aperiam unde quibusdam eveniet nisi! At inventore voluptate dicta
          velit excepturi quia aspernatur, modi et! Tempore deleniti minima
          numquam aspernatur consequatur!
        </p>
      </div>
    </button>
  );
};
