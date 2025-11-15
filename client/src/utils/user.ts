import { USER_AVATARS } from '../const/avatars';
import { v4 as uuidv4 } from 'uuid';

const getRandomUser = () => {
  const name = 'User' + Math.floor(Math.random() * 1000);

  const randomAvatarName =
    USER_AVATARS[Math.floor(Math.random() * USER_AVATARS.length)];

  const avatar = `/user-avatars/${randomAvatarName}.jpg`;

  return { id: uuidv4(), name, avatar };
};

export const getUser = () => {
  const storedUser = localStorage.getItem('chatUser');

  if (!storedUser) {
    const newUser = getRandomUser();

    localStorage.setItem('chatUser', JSON.stringify(newUser));
    return newUser;
  }

  const user = JSON.parse(storedUser);

  return user;
};
