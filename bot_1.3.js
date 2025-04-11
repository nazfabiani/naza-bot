const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const pvp = require('mineflayer-pvp').plugin;

let salidaPorDormir = false;
let guardPos = null;

function startBot() {
  const bot = mineflayer.createBot({
    host: 'elintendente.aternos.me',
    port: 25565,
    username: 'NazaBot',
    version: '1.16'
  });

  bot.loadPlugin(pathfinder);
  bot.loadPlugin(pvp);

  bot.on('spawn', () => {
    console.log('✅ NazaBot conectado');
    bot.chat('Estoy vivo... creo 🐾');

    // Movimiento aleatorio cada 5 segundos
    setInterval(() => {
      const directions = ['forward', 'back', 'left', 'right'];
      const dir = directions[Math.floor(Math.random() * directions.length)];
      bot.setControlState(dir, true);
      setTimeout(() => bot.setControlState(dir, false), 1000);
    }, 5000);
  });

  // Pathfinder a guardPos
  function moveToGuardPos() {
    bot.pathfinder.setMovements(new Movements(bot));
    bot.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z));
  }

  // Parar guardia
  function stopGuarding() {
    guardPos = null;
    bot.pvp.stop();
    bot.pathfinder.setGoal(null);
  }

  // Si deja de atacar, vuelve a la posición
  bot.on('stoppedAttacking', () => {
    if (guardPos) moveToGuardPos();
  });

  // Buscar mobs cercanos
  bot.on('physicsTick', () => {
    if (!guardPos) return;
    const filter = e =>
      e.type === 'mob' &&
      e.position.distanceTo(bot.entity.position) < 16 &&
      e.displayName !== 'Armor Stand';

    const entity = bot.nearestEntity(filter);
    if (entity) bot.pvp.attack(entity);
  });

  // Respuestas y comandos
  bot.on('chat', (username, message) => {
    const msg = message.toLowerCase();

    // Comandos de guardia
    if (msg === 'guard') {
      const player = bot.players[username];
      if (player && player.entity) {
        bot.chat('Guardando esta posición 🛡️');
        guardPos = player.entity.position;
        moveToGuardPos();
      } else {
        bot.chat("No te veo, pa");
      }
    }

    if (msg === 'stop') {
      bot.chat('Ya fue, dejo de vigilar 🚫');
      stopGuarding();
    }

    // Respuestas simples
    if (msg.includes('hola')) bot.chat('Tu nariz contra mis bolas');
    if (msg.includes('bot')) bot.chat('¿Me llamaste?');
    if (msg.includes('tp')) bot.chat('Como rompes los huevos pibe');
    if (msg.includes('ayudame')) bot.chat('Soy un bot... ¿Qué esperás que haga?');
    if (msg.includes('murió') || msg.includes('fue asesinado') || msg.includes('cayó') || msg.includes('se ahogó'))
      bot.chat(`😵 Uh, no te gorrean al pedo... fuerza ${username}`);

    // Detecta que alguien duerme
    if (msg.includes('se fue a dormir')) {
      salidaPorDormir = true;
      bot.chat('Bueno... alguien duerme, yo me voy...');
      bot.quit();
    }
  });

  bot.on('error', err => {
    console.log('❌ Error:', err);
  });

  bot.on('end', () => {
    console.log('📴 Bot desconectado');
    if (salidaPorDormir) {
      salidaPorDormir = false;
      console.log('Reiniciando en 60 segundos...');
      setTimeout(startBot, 60000);
    }
  });
}

startBot();
