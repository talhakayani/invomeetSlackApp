//const { App } = require('@slack/bolt');
require('dotenv').config({
  path: '../.env',
});
console.log(process.env.SLACK_SIGNIN_SECRET);
