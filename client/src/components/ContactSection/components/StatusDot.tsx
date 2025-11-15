import { cn } from '../../../utils/cn';

type StatusDotProps = {
  online: boolean;
};

export const StatusDot = ({ online }: StatusDotProps) => (
  <div
    className={cn(
      'h-4 w-4 rounded-full absolute -bottom-1 -right-1',
      online ? 'bg-status-online' : 'bg-status-offline'
    )}
  ></div>
);
