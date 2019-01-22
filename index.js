const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const koa = require('koa');
const route = require('koa-route');
require('dotenv').config();

const botToken = process.env.BOT_TOKEN;
console.log('Setting up telegram bot...');
if (!botToken) {
  console.warn('Telegram bot token was missing... failed to start.');
  return -1;
}

const tryHard = (fn, ...params) => {
  try {
    fn(...params);
  } catch (e) {
    console.error('Failed to execute', fn, e);
  }
};

const bot = new Telegraf(botToken);

bot.use((ctx, next) => {
  const start = new Date();
  return next(ctx).then(() => {
    const ms = new Date() - start;
    console.log('Response time %sms', ms);
  });
});

bot.start(ctx =>
  tryHard(
    ctx.reply,
    'Terve. Olen Yleishyödyllinen botti. Lähetä komento /help nähdäksesi mitä kaikkea osaan tehdä.',
    Extra.markdown()
  )
);

bot.command('help', ctx => {
  tryHard(
    ctx.reply,
    `Tässäpä mitä osaan:
    - /help -> Kerron mitä osaan
    - muuta en vielä osaa 😢
    `,
    Extra.markdown()
  );
});

const keyboard2 = Markup.inlineKeyboard([
  Markup.callbackButton('👍🏻', 'good'),
  Markup.callbackButton('👎🏻', 'bad')
]);

bot.hears(/moi/gi, ctx => {
  tryHard(
    ctx.reply,
    `No moi, ${ctx.from.first_name}! Mitäs sulle kuuluu?`,
    Extra.markup(keyboard2)
  );
});

bot.action('good', ({ reply, deleteMessage }) => {
  tryHard(reply, 'Jes! Hyvä!');
  tryHard(deleteMessage);
});
bot.action('bad', ({ reply, deleteMessage }) => {
  tryHard(reply, 'No, voi harmi!');
  tryHard(deleteMessage);
});

const keyboard = Markup.inlineKeyboard([
  Markup.urlButton('👍🏻', 'https://olpe.fi'),
  Markup.callbackButton('Delete', 'delete')
]);

bot.action('delete', ({ deleteMessage }) => tryHard(deleteMessage));

bot.on('message', ctx =>
  tryHard(
    ctx.telegram.sendCopy,
    ctx.from.id,
    ctx.message,
    Extra.markup(keyboard)
  )
);

bot.launch();
console.log('Bot listening to messages and commands...');

// Binding the port so that Heroku will not kill the process
console.log('Starting a dummy server');
const port = process.env.PORT || 4000;
const app = new koa();
app.use(
  route.get('/healthcheck', async ctx => {
    ctx.response.statusCode = 200;
    ctx.response.body = 'OK';
  })
);
app.listen(port);
