const helperFunction = require('../../services/utils/helperFunctions');
const messages = require('../../services/messages/messageServices');
const { app } = require('../../connection/slackConnection');
const {
  updateMessage,
  sendPrivateMessage,
  getUsersInformation,
} = require('../../services/commands/commandServices');
const { reserveTheRoom } = require('../../services/api/apiServices');
require('dotenv').config('../../.env');
const fs = require('fs');
const { authorize } = require('../../services/google_calander/auth');
const { addEvent } = require('../../services/google_calander/utils/operations');

exports.interactions = async (req, res, _next) => {
  try {
    res.status(200).send();
    const payload = JSON.parse(req.body.payload);
    const { user, actions, container, channel } = payload;
    const credentials = JSON.parse(process.env.CREDENTIALS);
    const oAuth2Client = authorize(credentials, channel.id, user.id, true);
    // console.log(oAuth2Client);
    //console.log(user, actions, container, channel);
    // const actions = payload.actions;
    if (!actions.length)
      return res.status(400).send('Please interact with elements');
    const [data] = actions;

    const { type, action_id } = data;
    //console.log(action_id);
    let information,
      btnClicked = false;
    // console.log(action_id);

    if (action_id == 'room-selection') {
      information =
        data.selected_option != null
          ? data.selected_option.text.text.split(' ')[0]
          : '';
    }
    if (action_id == 'meeting-with') {
      information = data.selected_users != null ? data.selected_users : [];
    }
    if (action_id == 'meeting-date') {
      information = data.selected_date != null ? data.selected_date : '';
    }
    if (action_id == 'meeting-time') {
      information = data.selected_time != null ? data.selected_time : '';
    }
    if (action_id == 'reserve-room-btn') {
      btnClicked = true;
      const selectedInformation = helperFunction.getInformationFromTheFile();
      if (selectedInformation.error) {
        sendPrivateMessage(
          channel.id,
          user.id,
          helperFunction.sendErrorMessage(selectedInformation.message)
        );
        return res.status(300).send();
      }
      const { blockJson, roomInfo } = await messages.generateMessageForUpdate(
        selectedInformation
      );
      const { selected_room, selected_date, selected_time } =
        selectedInformation;
      let selected_users = null,
        emails = [];
      if (
        selectedInformation.hasOwnProperty('selected_users') &&
        selectedInformation.selected_users.length
      ) {
        selected_users = selectedInformation.selected_users;
        console.log(selectedInformation.selected_users);
        selected_users = await getUsersInformation(selected_users);
        // console.log(selected_users[0].user.profile.email);
        for (let i = 0; i < selected_users.length; i++) {
          emails.push({ email: selected_users[i].user.profile.email });
        }
      }
      let information = {
        dateTime: selected_date + '=' + selected_time,
        message: blockJson[1].text.text,
        attendees: emails != null ? emails : [],
        location: roomInfo.location + ', at InvoZone office',
      };

      //console.log(result);
      //TODO:  Adding google calendar event
      const event = helperFunction.eventForGoogleCalendar(information);
      addEvent(event, oAuth2Client);
      const result = reserveTheRoom(
        selected_room,
        'busy',
        user.id,
        '' + selectedInformation.selected_users,
        `${selected_date}=${selected_time}`
      );

      updateMessage(container.channel_id, container.message_ts, blockJson);
      if (fs.existsSync('tempData.json')) fs.unlinkSync('tempData.json');
      return res.status(200).send();
    }

    if (action_id == 'token-input') {
      const { value } = actions[0];
      oAuth2Client.getToken(value, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        fs.writeFile('token.json', JSON.stringify(token), err => {
          if (err) return console.error('Unable to create the token file', err);
          updateMessage(
            container.channel_id,
            container.message_ts,
            helperFunction.sendErrorMessage(
              'Token Saved! now you can run the application without /connect-google-calendar command'
            )
          );
        });
      });
    }
    /*switch (action_id) {
      case 'room-selection':
        console.log('room selection event performed');
        console.log(btnClicked, data.selected_option.text.text);
        information = data.selected_option.text.text;
        // data.selected_option != null ? data.selected_option.text.text : '';
        console.log(information);
        break;
      case 'meeting-with':
        console.log('meeting with event performed');
        information = data.selected_users != null ? data.selected_users : [];
        break;
      case 'meeting-date':
        console.log('meeting date event performed');
        information = data.selected_date != null ? data.selected_date : '';
        break;
      case 'meeting-time':
        console.log('meeting time event performed');
        information = data.selected_time != null ? data.selected_time : '';
        break;
      case 'reserve-room-btn':
        //TODO implementaion here for all room reserve
        const selectedInformation = helperFunction.getInformationFromTheFile();
        if (selectedInformation.error) {
          sendPrivateMessage(
            channel.id,
            user.id,
            helperFunction.sendErrorMessage(selectedInformation.message)
          );
          return res.status(300).send();
        }
        const { blockJson, roomInfo } = await messages.generateMessageForUpdate(
          selectedInformation
        );
        const { selected_room, selected_date, selected_time } =
          selectedInformation;
        let selected_users = null;
        if (
          selectedInformation.hasOwnProperty('selected_users') &&
          selectedInformation.selected_users.length
        )
          selected_users = selectedInformation.selected_users;

        //TODO:  Database changes
        const result = reserveTheRoom(
          selected_room,
          'busy',
          user.id,
          '' + selected_users,
          `${selected_date}=${selected_time}`
        );
        //console.log(result);
        //TODO:  Adding google calendar event
        let information = {
          dateTime: selected_date + '=' + selected_time,
          message: blockJson[1].text.text,
          attendees: selected_users != null ? selected_users : [],
          location: roomInfo.location + ', at InvoZone office',
        };
        const event = helperFunction.eventForGoogleCalendar(information);
        addEvent(oAuth2Client, event);

        updateMessage(container.channel_id, container.message_ts, blockJson);
        if (fs.existsSync('tempData.json')) fs.unlinkSync('tempData.json');
        btnClicked = true;
        break;
      case 'token-input':
        //btnClicked = true;
        const { value } = actions[0];
        oAuth2Client.getToken(value, (err, token) => {
          if (err) return console.error('Error retrieving access token', err);
          oAuth2Client.setCredentials(token);
          fs.writeFile('token.json', JSON.stringify(token), err => {
            if (err)
              return console.error('Unable to create the token file', err);
            updateMessage(
              container.channel_id,
              container.message_ts,
              helperFunction.sendErrorMessage(
                'Token Saved! now you can run the application without /connect-google-calendar command'
              )
            );
          });
        });
        break;
    }*/
    if (!btnClicked) {
      //  console.log('it is running...');
      helperFunction.insertInformation(information, action_id);
    }
    return res.status(200).send();
  } catch (err) {
    return res.status(400).send();
  }
};
