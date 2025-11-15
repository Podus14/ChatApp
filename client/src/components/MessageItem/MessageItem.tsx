import { MESSAGE_TYPE, type MessageType } from '../../const/message';
import { cn } from '../../utils/cn';
import { formatTime } from '../../utils/formatTime';

type MessageItemProps = {
  text: string;
  timestamp: number;
  userName?: string;
  variant: MessageType;
  seen?: boolean;
};

export const MessageItem = ({
  text,
  timestamp,
  userName,
  variant,
  seen = false,
}: MessageItemProps) => {
  const isSent = variant === MESSAGE_TYPE.sent;

  return (
    <div className={cn('flex flex-col', isSent ? 'items-end' : 'items-start')}>
      <div className={cn('relative w-[630px] flex', !isSent && 'justify-end')}>
        <div
          className={cn(
            'w-[618px] rounded-lg overflow-hidden shadow-xl relative',
            isSent
              ? 'bg-message-sent text-message-sent-text'
              : 'bg-message-received text-message-received-text self-right'
          )}
        >
          {userName && (
            <div className="text-sm flex justify-between px-4 py-3">
              <span>{userName}</span>
              <span
                className={cn(isSent ? 'text-time-sent' : 'text-time-received')}
              >
                {formatTime(timestamp)}
              </span>
            </div>
          )}

          <p className="text-sm bg-white px-4 py-3">{text}</p>
        </div>

        <div
          className={cn(
            'absolute bottom-3 w-0 h-0 border-solid',
            isSent
              ? 'right-1.5 border-l-16 border-l-transparent border-t-16 border-t-white rotate-45'
              : 'left-1.5 border-r-16 border-r-transparent border-t-16 border-t-white -rotate-45'
          )}
        />
      </div>

      {/* Seen status for sent messages */}
      {isSent && (
        <div className="text-xs text-gray-400 mt-1 px-1">
          {seen ? `Seen ${formatTime(timestamp)}` : 'Sent'}
        </div>
      )}
    </div>
  );
};

MessageItem.displayName = 'MessageItem';
