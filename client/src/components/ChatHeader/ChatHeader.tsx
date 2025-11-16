import type { User } from '../../types/user';

type ChatHeaderProps = {
  selectedContact: User | null;
};

export const ChatHeader = ({ selectedContact }: ChatHeaderProps) => (
  <div className="flex gap-5 bg-chat-header">
    {selectedContact ? (
      <img
        className="w-[173px] h-[173px]"
        src={selectedContact?.avatar}
        alt="User Image"
        width={173}
        height={173}
      />
    ) : (
      <div className="min-w-[173px] h-[173px]  flex items-center justify-center">
        User Image
      </div>
    )}

    <div className="flex flex-col mt-5">
      <p className="text-xl font-semibold">{selectedContact?.name}</p>
      <p className="text-sm">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae,
        possimus suscipit rerum quis vel harum distinctio optio adipisci
        perspiciatis doloribus assumenda. Aut nihil dignissimos debitis quod ut
        blanditiis deserunt ab!
      </p>
    </div>
  </div>
);
