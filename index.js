const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const koa = require('koa');
require('dotenv').config();

const botToken = process.env.BOT_TOKEN;
console.log('Setting up telegram bot...');
if (!botToken) {
  console.warn('Telegram bot token was missing... failed to start.');
  return -1;
}

const bot = new Telegraf(botToken);

bot.use((ctx, next) => {
  const start = new Date();
  return next(ctx).then(() => {
    const ms = new Date() - start;
    console.log('Response time %sms', ms);
  });
});

bot.start(ctx =>
  ctx.reply(
    'Terve. Olen Yleishyödyllinen botti. Lähetä komento */help* nähdäksesi mitä kaikkea osaan tehdä.',
    Extra.markdown()
  )
);

bot.command('help', ctx => {
  console.log({ ctx });
  ctx.reply(
    `Tässäpä mitä osaan:
    - /help -> Kerron mitä osaan
    - muuta en vielä osaa 😢
    `,
    Extra.markdown()
  );
});

bot.launch();
console.log('Bot listening to messages and commands...');

// Binding the port so that Heroku will not kill the process
console.log('Starting a dummy server');
const port = process.env.PORT || 4000;
const app = new koa();
app.listen(port);
