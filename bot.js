const mineflayer = require('mineflayer');

function startBot() {
  const bot = mineflayer.createBot({
    host: 'elintendente.aternos.me',
    port: 25565,
    username: 'NazaBot',
    version: '1.16'
  });

  bot.on('spawn', () => {
    console.log('✅ NazaBot conectado');
    bot.chat('Estoy vivo... creo 🐾');

    // Movimiento aleatorio
    setInterval(() => {
      const directions = ['forward', 'back', 'left', 'right'];
      const dir = directions[Math.floor(Math.random() * directions.length)];

      bot.setControlState(dir, true);
      setTimeout(() => bot.setControlState(dir, false), 1000);
    }, 5000);
  });

  bot.on('error', err => {
    console.log('❌ Error:', err);
  });

  bot.on('end', () => {
    console.log('📴 Bot desconectado.');
    // Lo dejamos sin reinicio automático si lo controlás desde Telegram
  });

  return bot;
}

module.exports = startBot;
