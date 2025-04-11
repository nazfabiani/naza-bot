const TelegramBot = require('node-telegram-bot-api');
const { spawn } = require('child_process');

const token = '7522313652:AAEKCZRgbsxmHqedWuFakWjMVxv3q9SKBZQ'; // Tu token real
const bot = new TelegramBot(token, { polling: true });

// Solo permitir ciertos usuarios y solo en chats privados.
const allowedUsers = [1827509476]; // REEMPLAZA con tu ID (o IDs permitidos)
const allowedChatTypes = ['private'];

let procesoBot = null;
let salidaManual = false;

// Filtrar todos los mensajes para que solo respondan en chats privados de usuarios permitidos
bot.on('message', msg => {
  if (!allowedChatTypes.includes(msg.chat.type) || !allowedUsers.includes(msg.chat.id)) {
    bot.sendMessage(msg.chat.id, 'No tienes permiso para usar este bot.');
  }
});

// Comando para iniciar el bot
bot.onText(/\/startbot/, msg => {
  const chatId = msg.chat.id;
  if (!allowedUsers.includes(chatId)) {
    bot.sendMessage(chatId, 'No tienes permiso para usar este bot.');
    return;
  }
  if (procesoBot) {
    bot.sendMessage(chatId, 'El bot ya está corriendo.');
    return;
  }

  salidaManual = false;
  procesoBot = spawn('node', ['bot.js'], {
    cwd: __dirname,
    detached: true
  });

  bot.sendMessage(chatId, 'Bot de Minecraft iniciado!');

  procesoBot.stdout.on('data', data => {
    console.log(`[Bot] ${data}`);
  });

  procesoBot.stderr.on('data', data => {
    console.error(`[Error Bot] ${data}`);
  });

  procesoBot.on('exit', code => {
    console.log(`Bot salió con código ${code}`);
    if (!salidaManual) {
      procesoBot = null;
    }
  });
});

// Comando para detener el bot
bot.onText(/\/stopbot/, msg => {
  const chatId = msg.chat.id;
  if (!allowedUsers.includes(chatId)) {
    bot.sendMessage(chatId, 'No tienes permiso para usar este bot.');
    return;
  }
  if (!procesoBot) {
    bot.sendMessage(chatId, 'El bot no está corriendo.');
    return;
  }

  salidaManual = true;
  process.kill(-procesoBot.pid); // Mata el proceso hijo y sus subprocesos
  bot.sendMessage(chatId, 'Bot de Minecraft detenido manualmente.');
  procesoBot = null;
});
