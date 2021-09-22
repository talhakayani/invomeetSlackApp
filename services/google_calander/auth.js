const { google } = require('googleapis');
require('dotenv').config('../../.env');
const fs = require('fs');
const { addEvent } = require('../../services/google_calander/utils/operations');
const { sendMessageToSlackUrl } = require('../commands/commandServices');
const { generateMessageForToken } = require('../messages/messageServices');
const { getTokenData } = require('../api/apiServices');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

exports.authorize = async (credentials, channel_id, user_id, forResponse) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  if (!forResponse) getAccessToken(oAuth2Client, channel_id, user_id);
  else {
    const data = await getTokenData(user_id);
    console.log(data);
    console.log(data.token);
    if (data.token) oAuth2Client.setCredentials(JSON.parse(data.token.token));
  } // else {
  //   fs.readFile(tokenFileName, (err, token) => {
  //     if (err) console.log('Unable to read the token.json');
  //     else {
  //       oAuth2Client.setCredentials(JSON.parse(token));
  //     }
  //   });
  return oAuth2Client;
  //}
};

function getAccessToken(oAuth2Client, channel_id, user_id) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  //   console.log('Authorize this app by visiting this url:', authUrl);
  const message = generateMessageForToken(authUrl);
  sendMessageToSlackUrl(channel_id, 'Google Calendar Authentication', message);
}
