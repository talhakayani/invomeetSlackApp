const express = require('express');
const routes = require('./routes');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/slack', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Running Successfully at ${PORT}`));

// const sendMessageToChannel = async (channelId, message) => {
//   const result = await client.chat.postMessage({
//     token: process.env.SLACK_BOT_TOKEN,
//     channel: channelId,
//     text: message,
//     blocks: [
//       {
//         type: 'section',
//         text: {
//           type: 'mrkdwn',
//           text: 'This is a section block with a button.',
//         },
//         accessory: {
//           type: 'button',
//           text: {
//             type: 'plain_text',
//             text: 'asd Me',
//             emoji: true,
//           },
//           value: 'click_me_123',
//           action_id: 'button-action-reserve',
//         },
//       },
//       {
//         type: 'section',
//         text: {
//           type: 'mrkdwn',
//           text: 'This is a section block with a button.',
//         },
//         accessory: {
//           type: 'button',
//           text: {
//             type: 'plain_text',
//             text: 'Click Me',
//             emoji: true,
//           },
//           value: 'click_me_123',
//           action_id: 'button-action',
//         },
//       },
//     ],
//   });
//   console.log(result);
// };

// app.use('/intraction', (req, res) => {
//   // console.log('printing req and res ', req.body, res);
//   // const result = client.chat.postMessage({
//   //   channel: 'C02DP9LAZ4L',
//   //   text: 'wow, user clicked the button ',
//   // });
//   res.status(200).end(); // best practice to respond with 200 status
//   var actionJSONPayload = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string
//   var message = {
//     text:
//       actionJSONPayload.user.name +
//       ' clicked: ' +
//       actionJSONPayload.actions[0].name,
//     replace_original: false,
//   };
//   sendMessageToSlackUrl(actionJSONPayload.response_url, message);
// });

// // sendMessageToChannel(
// //   'C02DP9LAZ4L',
// //   'This message is sent through newly created bot'
// // );

// // https://622e-39-45-45-120.ngrok.io/slack/slash-command/rooms-available

// app.post('/slack/slash-command/rooms-available', (req, res) => {
//   res.status(200).send();
//   console.log('running...');
//   const reqbody = req.body;
//   const resUrl = reqbody.response_url;
//   // if (reqbody.token !== process.env.SLACK_BOT_TOKEN) {
//   //   console.log('access forbidden');
//   //   res.status(403).end('Access forbidden');
//   // } else {
//   var message = {
//     text: 'This is your first interactive message',
//     attachments: [
//       {
//         text: 'Building buttons is easy right?',
//         fallback: "Shame... buttons aren't supported in this land",
//         callback_id: 'button_tutorial',
//         color: '#3AA3E3',
//         attachment_type: 'default',
//         actions: [
//           {
//             name: 'yes',
//             text: 'yes',
//             type: 'button',
//             value: 'yes',
//           },
//           {
//             name: 'no',
//             text: 'no',
//             type: 'button',
//             value: 'no',
//           },
//           {
//             name: 'maybe',
//             text: 'maybe',
//             type: 'button',
//             value: 'maybe',
//             style: 'danger',
//           },
//         ],
//       },
//     ],
//   };
//   sendMessageToSlackUrl(resUrl, message);
//   //}
// });

// const sendMessageToSlackUrl = (resUrl, message) => {
//   const options = {
//     url: resUrl,
//     method: 'post',
//     data: message,
//     headers: { 'Content-Type': 'multipart/form-data' },
//   };
//   axios(options)
//     .then(res => {
//       // console.log(res);
//     })
//     .catch(err => {
//       //  console.log(err);
//     });
// };
