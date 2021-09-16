const commandServices = require('../../services/commands/commandServices');
const messages = require('../../services/messages/messageServices');
const api = require('../../services/api/apiServices');
const fs = require('fs');

exports.roomsAvailable = async (req, res, _next) => {
  try {
    res.status(200).send();

    if (fs.existsSync('tempData.json')) fs.unlinkSync('tempData.json');

    const { token, channel_id, user_id, command, text, response_url } =
      req.body;

    //get all the information of rooms
    const rooms = await api.getAvailableRooms();

    // create interactive message
    const message = messages.generateMessageForRooms(rooms);

    // // send message to the slack
    commandServices.sendMessageToSlackUrl(channel_id, message);
    console.log('everything is running');
  } catch (err) {
    return res.status(400).send(err.message);
  }
};
