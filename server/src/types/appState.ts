import type { Message } from './message';
import type { User } from './user';

export type UserSocketMap = Map<string, Set<string>>;

export type AppState = {
  users: User[];
  messages: Message[];
  userSocketMap: UserSocketMap;
};
