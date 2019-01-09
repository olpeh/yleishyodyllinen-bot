const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
require('dotenv').config();

const gameShortName = 'testipeli';
const gameUrl = 'https://olpe.fi/koodikerho/day-09/';

const markup = Extra.markup(
  Markup.inlineKeyboard([
    Markup.gameButton('🎮 Play now!'),
    Markup.urlButton('Made by', 'https://olpe.fi')
  ])
);

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(({ replyWithGame }) => replyWithGame(gameShortName));
bot.command('foo', ({ replyWithGame }) => replyWithGame(gameShortName, markup));
bot.gameQuery(({ answerGameQuery }) => answerGameQuery(gameUrl));
bot.startPolling();
