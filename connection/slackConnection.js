require('dotenv').config('../.env');
const { App } = require('@slack/bolt');
const { WebClient, ErrorCode } = require('@slack/web-api');

const client = new WebClient(process.env.SLACK_BOT_TOKEN);

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNIN_SECRET,
});

module.exports = { app, client };
