const commandServices = require('../../services/commands/commandServices');
const messages = require('../../services/messages/messageServices');
const api = require('../../services/api/apiServices');
require('dotenv').config('../../.env');
const fs = require('fs');
const { sendErrorMessage } = require('../../services/utils/helperFunctions');
const { authorize } = require('../../services/google_calander/auth');

exports.roomsAvailable = async (req, res, _next) => {
  try {
    res.status(200).send();

    //if (fs.existsSync('tempData.json')) fs.unlinkSync('tempData.json');
    const { token, channel_id, user_id, command, text, response_url } =
      req.body;
    if (fs.existsSync(`tempData${user_id}.json`))
      fs.unlinkSync(`tempData${user_id}.json`);

    //get all the information of rooms
    const rooms = await api.getAvailableRooms();
    if (rooms.length) {
      // create interactive message
      const message = messages.generateMessageForRooms(rooms);
      // // // send message to the slack
      commandServices.sendMessageToSlackUrl(
        channel_id,
        'Room Information',
        message
      );

      return res.status(200).send();
    }
    commandServices.sendPrivateMessage(
      channel_id,
      user_id,
      'Confirmation Message',
      sendErrorMessage(
        "We're really sorry, currently no rooms are available. Please try again later"
      )
    );
    console.log('everything is running');
  } catch (err) {
    return res.status(400).end('Something went wrong');
  }
};

exports.connectToGoogleCalendar = async (req, res, _next) => {
  try {
    res.status(200).send();
    const { token, channel_id, user_id, command, text, response_url } =
      req.body;
    //console.log(token, channel_id, user_id, command, text, response_url);
    const credentials = JSON.parse(process.env.CREDENTIALS);
    //console.log(credentials);

    const data = await api.getTokenData(user_id);
    if (!data.token) {
      authorize(credentials, channel_id, user_id, false);
      return res.status(200).send();
    }

    commandServices.sendPrivateMessage(
      channel_id,
      user_id,
      'Google Calendar Already Configured',
      sendErrorMessage('Google Calendar Already Configured')
    );
    // fs.readFile('token.json', (err, token) => {
    //   if (err) {
    //     authorize('token.json', credentials, channel_id, user_id, false);
    //   } else {
    //     commandServices.sendPrivateMessage(
    //       channel_id,
    //       user_id,
    //       sendErrorMessage('Google Calendar already configured')
    //     );
    //   }
    // });

    // TODO connection google calander api
  } catch (err) {
    console.log(err);
    return res.status(400).send();
  }
};

exports.my_meetings = async (req, res, _next) => {
  try {
    res.status(200).send();
    const { body } = req;
    const { user_id, channel_id } = body;
    const meetings = await api.getMeetings(user_id);
    if (!meetings.length) {
      commandServices.sendPrivateMessage(
        channel_id,
        user_id,
        'Your meeting details',
        sendErrorMessage("You don't have any meeting for now")
      );
      return res.status(200).send();
    }
    const message = await messages.generateMeetingsMessage(meetings);
    //TODO with my meetings
    const result = await commandServices.sendPrivateMessage(
      channel_id,
      user_id,
      'Your Meetings',
      message
    );
    console.log(result);
  } catch (err) {
    return res.status(200).send();
  }
};

exports.getInfoReservedRooms = async (req, res, _next) => {
  try {
    res.status(200).send();
    console.log('this command is running');
    const rooms = await api.getBusyRooms();
    const { user_id, channel_id } = req.body;
    console.log(user_id, channel_id);
    const message = await messages.generateMessageForReservedRooms(rooms);
    console.log(message);
    commandServices.sendPrivateMessage(
      channel_id,
      user_id,
      'Reserved Rooms Information',
      message
    );
    return res.status(200).send();
  } catch (err) {
    console.log(err);
    return res.status(400).send();
  }
};
