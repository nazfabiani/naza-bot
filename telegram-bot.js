const TelegramBot = require('node-telegram-bot-api');
const startBot = require('./bot'); // importás tu bot.js

const TELEGRAM_TOKEN = '7559148001:AAFFitznpgvtqWW1y0hBQM0hqaaj67nfSjs';
const botTelegram = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

let botMinecraft = null;

botTelegram.onText(/\/startbot/, (msg) => {
  const chatId = msg.chat.id;

  if (botMinecraft) {
    botTelegram.sendMessage(chatId, 'El bot ya está conectado.');
    return;
  }

  botTelegram.sendMessage(chatId, 'Iniciando el bot de Minecraft...');

  botMinecraft = startBot(); // Acá se ejecuta el bot original

  botMinecraft.on('login', () => {
    botTelegram.sendMessage(chatId, 'Bot conectado exitosamente.');
  });

  botMinecraft.on('end', () => {
    botTelegram.sendMessage(chatId, 'El bot se desconectó.');
    botMinecraft = null;
  });

  botMinecraft.on('error', (err) => {
    botTelegram.sendMessage(chatId, `Error al conectar: ${err.message}`);
    botMinecraft = null;
  });
});

botTelegram.onText(/\/say (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];

  if (botMinecraft) {
    botMinecraft.chat(text);
    botTelegram.sendMessage(chatId, `Bot dijo: ${text}`);
  } else {
    botTelegram.sendMessage(chatId, 'El bot no está conectado.');
  }
});
