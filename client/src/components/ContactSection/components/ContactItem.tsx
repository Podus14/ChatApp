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
        'pl-4 flex gap-4 items-center py-1 cursor-pointer',
        selectedContact?.id === contact.id ? 'bg-selected' : 'hover:bg-selected'
      )}
      onClick={() => onSelectChat(contact)}
    >
      <div className="relative w-fit">
        <img
          src={avatar}
          alt="contact avatar"
          className="min-w-[60px] min-h-[60px] relative"
        />
        <StatusDot online={online} />
      </div>
      <div className="flex flex-col text-left">
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
