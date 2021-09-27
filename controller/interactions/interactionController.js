const {
  getInformationFromTheFile,
  sendErrorMessage,
  getDateAndTime,
  insertInformation,
  eventForGoogleCalendar,
} = require('../../services/utils/helperFunctions');
const {
  generateMessageForUpdate,
} = require('../../services/messages/messageServices');
const { scheduleJob } = require('node-schedule');
const {
  updateMessage,
  sendPrivateMessage,
  getUsersInformation,
} = require('../../services/commands/commandServices');
const {
  addTokenForGoogleCalendar,
  updateMeetingStatus,
  addInvoMeeting,
  getRoomIdByRoomName,
  addGoogleAuthToken,
  getGoogleAuthToken,
} = require('../../services/api/apiServices');
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
    // const oAuth2Client = authorize(credentials, channel.id, user.id, true);
    // console.log(oAuth2Client);
    //console.log(user, actions, container, channel);
    // const actions = payload.actions;
    if (!actions.length)
      return res.status(400).send('Please interact with elements');
    const [data] = actions;

    const { action_id } = data;
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
      const selectedInformation = getInformationFromTheFile(
        `tempData${user.id}.json`
      );
      if (selectedInformation.error) {
        sendPrivateMessage(
          channel.id,
          user.id,
          'Something missing in given information, for correction please select different option first and then select back the orignial option that you want, Thank you',
          sendErrorMessage(selectedInformation.message)
        );
        return res.status(300).send();
      }

      /**
       * here is the implementation of check
       */

      // const data = await isRoomAvailable(selectedInformation.selected_room);
      // console.log(data);
      // if (!data.isAvailable) {
      //   updateMessage(
      //     container.channel_id,
      //     container.message_ts,
      //     'Room already reserved',
      //     sendErrorMessage(
      //       'Ops! it seems that room is already reserved, please wait confirmation message will be sent in a moment'
      //     )
      //   );
      //   const reservedBy = await getUsersInformation([data.reservedBy]);
      //   const username = reservedBy[0].user.real_name;
      //   const dateTime = helperFunction.getDateAndTime(data.reservedFrom);

      //   sendPrivateMessage(
      //     container.channel_id,
      //     user.id,
      //     helperFunction.sendErrorMessage(
      //       `We're really sorry, It is confirmed that *${data.message}* at the moment and reserved by *${username}*. Room will be avaiable at *${dateTime.end}*`
      //     )
      //   );
      //   return res.status(200).send();
      // }

      const { blockJson, roomInfo } = await generateMessageForUpdate(
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
        selected_users = await getUsersInformation(selected_users);
        for (let i = 0; i < selected_users.length; i++) {
          emails.push({ email: selected_users[i].user.profile.email });
        }
      }
      let information = {
        dateTime: selected_date + ':' + selected_time,
        message: blockJson[1].text.text,
        attendees: emails != null ? emails : [],
        location: roomInfo.location + ', at InvoZone office',
      };
      const meetingTime = getDateAndTime(information.dateTime, 1);
      const roomId = await getRoomIdByRoomName(
        selectedInformation.selected_room
      );
      //  console.log(roomId);
      const meeting = await addInvoMeeting(
        user.id,
        selectedInformation.selected_users + '',
        meetingTime.start,
        meetingTime.end,
        'InProgress',
        roomId
      );
      console.log(meeting);
      if (!meeting.data) {
        updateMessage(
          container.channel_id,
          container.message_ts,
          'Unable to create meeting',
          sendErrorMessage(
            meeting.hasOwnProperty('message')
              ? meeting.message
              : 'Something went wrong, please try agian later'
          )
        );
        return res.status(200).send();
      }

      const meeting_id = meeting.meeting.meeting.id;
      console.log(meeting_id);
      // await reserveTheRoom(
      //   selected_room,
      //   'busy',
      //   user.id,
      //   '' + selectedInformation.selected_users,
      //   `${selected_date}=${selected_time}`
      // );

      scheduleJob(meetingTime.end, () => {
        updateMeetingStatus(meeting_id);
        console.log('Meeting end');
      });
      console.log('Meeting will end on: ' + meetingTime.end);
      //console.log(result);
      //TODO:  Adding google calendar event

      const event = eventForGoogleCalendar(information);

      const oAuth2Client = await authorize(
        credentials,
        channel.id,
        user.id,
        true
      );

      /**
       * the below line will be removed later
       */
      // return res.status(200).send();
      addEvent(event, oAuth2Client);

      blockJson.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Meeting will be end on: ${meetingTime.end}`,
        },
      });

      updateMessage(
        container.channel_id,
        container.message_ts,
        'Meeting Reserved',
        blockJson
      );

      // const job = schedule.scheduleJob('randomMessage', '* * * * *', () => {
      //   console.log('Some');
      // });
      // console.log('Temp');
      // if (fs.existsSync('tempData.json')) fs.unlinkSync('tempData.json');
      if (fs.existsSync(`tempData${user.id}.json`))
        fs.unlinkSync(`tempData${user.id}.json`);
      return res.status(200).send();
    }

    if (action_id == 'token-input') {
      const { value } = actions[0];
      const oAuth2Client = await authorize(
        credentials,
        channel.id,
        user.id,
        true
      );
      oAuth2Client.getToken(value, async (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        //TODO Insert Token to Database here
        // Route will use  /token/add
        // const body = {
        //   user_id: user.id,
        //   token: JSON.stringify(token),
        //   calendarId: 'Primary',
        // };
        const result = await addGoogleAuthToken(
          user.id,
          JSON.stringify(token),
          'Primary'
        );
        if (!result) {
          updateMessage(
            container.channel_id,
            container.message_ts,
            'Unable to create Google Calendar Auth Token',
            sendErrorMessage('Unable to register the token')
          );
          return res.status(200).send();
        }
        updateMessage(
          container.channel_id,
          container.message_ts,
          'Google Calendar Auth token added',
          sendErrorMessage(
            'Token Saved! now you can run the application without /connect-google-calendar command'
          )
        );
        return res.status(200).send();
      });
      return res.status(200).send();
    }
    if (!btnClicked) {
      //  console.log('it is running...');
      insertInformation(`tempData${user.id}.json`, information, action_id);
    }
    return res.status(200).send();
  } catch (err) {
    console.log(err);
    return res.status(400).send();
  }
};
