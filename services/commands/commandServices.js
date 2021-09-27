const { app, client } = require('../../connection/slackConnection');
require('dotenv').config('../../.env');

exports.sendPrivateMessage = async (channel_id, userid, text, message) => {
  try {
    const result = await app.client.chat.postEphemeral({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channel_id,
      user: userid,
      text: text,
      blocks: message,
    });
  } catch (err) {
    return err.message;
  }
};

exports.sendMessageToSlackUrl = async (channel_id, text, message) => {
  try {
    const result = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channel_id,
      text: text,
      blocks: message,
    });
    return result;
  } catch (err) {
    return err.message;
  }
};

exports.updateMessage = async (channel_id, message_ts, text, message) => {
  const result = await app.client.chat.update({
    token: process.env.SLACK_BOT_TOKEN,
    channel: channel_id,
    ts: message_ts,
    text: text,
    blocks: message,
  });
};

exports.getUsersInformation = async mentions => {
  if (!mentions.length) return [];

  let details = [];
  for (let i = 0; i < mentions.length; i++) {
    const result = await client.users.info({
      user: mentions[i],
    });
    details.push(result);
  }
  return details;
};
