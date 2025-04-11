const mineflayer = require('mineflayer');

function startBot() {
  const bot = mineflayer.createBot({
    host: 'elintendente.aternos.me',  // Asegurate de que el servidor esté encendido y que este hostname sea correcto.
    port: 25565,
    username: 'NazaBot',
    version: '1.16' // O bien, si querés que se autodetecte, podés usar false.
  });

  bot.on('spawn', () => {
    console.log('✅ NazaBot conectado al servidor');
    bot.chat('¡Estoy vivo y listo para romper bloques mentales! 😎');

    // Movimiento aleatorio simple cada 5 segundos
    setInterval(() => {
      const directions = ['forward', 'back', 'left', 'right'];
      const dir = directions[Math.floor(Math.random() * directions.length)];
      bot.setControlState(dir, true);
      setTimeout(() => bot.setControlState(dir, false), 1000);
    }, 5000);
  });

  // Escucha del chat y respuestas automáticas
  bot.on('chat', (username, message) => {
    if (username === bot.username) return; // Ignora los mensajes propios

    const msg = message.toLowerCase();

    if (msg.includes('hola')) bot.chat(`¡Hola ${username}! ¿Todo piola? 🤖`);
    if (msg.includes('bot')) bot.chat('¿Sí? ¿Me llamaste, humano?');
    if (msg.includes('tp')) bot.chat('No soy remisero, eh.');
    if (msg.includes('ayudame')) bot.chat('Acordate que soy un bot, no un psicólogo.');
    if (msg.match(/murió|asesinado|cayó|ahogó/)) {
      bot.chat(`F por ${username} 🪦`);
    }

    // Si detecta que alguien "se fue a dormir", se despide y se desconecta.
    if (msg.includes('se fue a dormir')) {
      bot.chat('Bueno... alguien duerme, yo me voy...');
      bot.quit();
    }
  });

  bot.on('error', err => {
    console.log('❌ Error:', err);
  });

  bot.on('end', () => {
    console.log('📴 Bot desconectado del servidor');
  });
}

startBot();
