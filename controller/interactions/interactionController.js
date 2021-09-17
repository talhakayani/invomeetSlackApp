const helperFunction = require('../../services/utils/helperFunctions');
const messages = require('../../services/messages/messageServices');
const { app } = require('../../connection/slackConnection');
const {
  updateMessage,
  sendPrivateMessage,
} = require('../../services/commands/commandServices');
const { reserveTheRoom } = require('../../services/api/apiServices');
require('dotenv').config('../../.env');
const fs = require('fs');

exports.interactions = async (req, res, _next) => {
  try {
    res.status(200).send();
    const payload = JSON.parse(req.body.payload);
    const { user, actions, container, channel } = payload;

    //console.log(user, actions, container, channel);
    // const actions = payload.actions;
    if (!actions.length)
      return res.status(400).send('Please interact with elements');
    const [data] = actions;

    const { type, action_id } = data;
    let information,
      btnClicked = false;

    switch (action_id) {
      case 'room-selection':
        information =
          data.selected_option != null ? data.selected_option.text.text : '';
        break;
      case 'meeting-with':
        information = data.selected_users != null ? data.selected_users : [];
        break;
      case 'meeting-date':
        information = data.selected_date != null ? data.selected_date : '';
        break;
      case 'meeting-time':
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
        const message = await messages.generateMessageForUpdate(
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

        updateMessage(container.channel_id, container.message_ts, message);
        if (fs.existsSync('tempData.json')) fs.unlinkSync('tempData.json');
        btnClicked = true;
        break;
    }
    //console.log(data);
    if (!btnClicked) helperFunction.insertInformation(information, action_id);
    return res.status(200).send();
  } catch (err) {
    return res.status(400).send('something went wrong');
  }
};
