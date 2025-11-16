type SendButtonProps = {
  messageText: string;
  onSendMessage: () => void;
};

export const SendButton = ({ onSendMessage, messageText }: SendButtonProps) => (
  <button
    onClick={onSendMessage}
    disabled={!messageText.trim()}
    className="text-sm bg-button text-white font-semibold text-nowrap px-2 md:px-[53px] rounded-lg hover:opacity-80 disabled:bg-primary disabled:cursor-not-allowed cursor-pointer"
  >
    <span className="hidden md:block">Send message</span>
    <img src="/send.png" alt="" className="w-4 h-4 md:hidden" />
  </button>
);
