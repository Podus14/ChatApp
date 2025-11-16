import { BOTS } from '../const/bots.js';
import type { UserSocketMap } from '../types/appState.js';
import type { Message } from '../types/message.js';
import type { User } from '../types/user.js';

export const users: User[] = [...BOTS];

export const messages: Message[] = [];

export const userSocketMap: UserSocketMap = new Map<string, Set<string>>();

export const appState = { users, messages, userSocketMap };
