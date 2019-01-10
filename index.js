const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
require('dotenv').config();

const setup = () => {
  const botToken = process.env.BOT_TOKEN;
  console.log('Setting up telegram bot...');
  if (botToken) {
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

    bot.startPolling();
    console.log('Bot listening to messages and commands...');
  } else {
    console.warn('Telegram bot token was missing... failed to start.');
  }
};

setup();
