const { google } = require('googleapis');
require('dotenv').config('../../.env');
const fs = require('fs');
const { sendMessageToSlackUrl } = require('../commands/commandServices');
const { generateMessageForToken } = require('../messages/messageServices');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

exports.authorize = (credentials, channel_id, user_id, forResponse) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  // Check if we have previously stored a token.
  // fs.readFile(TOKEN_PATH, (err, token) => {
  //   if (err) return getAccessToken(oAuth2Client, channel_id, user_id);
  //   oAuth2Client.setCredentials(JSON.parse(token));
  //   callback(oAuth2Client);
  // });
  if (!forResponse) return getAccessToken(oAuth2Client, channel_id, user_id);
  return oAuth2Client;
};

function getAccessToken(oAuth2Client, channel_id, user_id) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  //   console.log('Authorize this app by visiting this url:', authUrl);
  const message = generateMessageForToken(authUrl);
  //console.log(message);
  sendMessageToSlackUrl(channel_id, message);

  return oAuth2Client;
  //   const rl = readline.createInterface({
  //     input: process.stdin,
  //     output: process.stdout,
  //   });
  //   rl.question('Enter the code from that page here: ', code => {
  //     rl.close();
  //     oAuth2Client.getToken(code, (err, token) => {
  //       if (err) return console.error('Error retrieving access token', err);
  //       oAuth2Client.setCredentials(token);
  //       // Store the token to disk for later program executions
  //       fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
  //         if (err) return console.error(err);
  //         console.log('Token stored to', TOKEN_PATH);
  //       });
  //       callback(oAuth2Client);
  //     });
  //   });
}
