export const BOT_IDS = {
  echo: 'bot-echo',
  reverse: 'bot-reverse',
  spam: 'bot-spam',
  ignore: 'bot-ignore',
} as const;

export const BOTS = [
  {
    id: BOT_IDS.echo,
    name: 'Echo Bot',
    avatar: '/bots/echo-bot.jpg',
    online: true,
  },
  {
    id: BOT_IDS.reverse,
    name: 'Reverse Bot',
    avatar: '/bots/reverse-bot.jpg',
    online: true,
  },
  {
    id: BOT_IDS.spam,
    name: 'Spam Bot',
    avatar: '/bots/spam-bot.jpg',
    online: true,
  },
  {
    id: BOT_IDS.ignore,
    name: 'Ignore Bot',
    avatar: '/bots/ignore-bot.jpg',
    online: true,
  },
];
