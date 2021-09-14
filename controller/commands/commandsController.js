const commandServices = require('../../services/commands/commandServices');
const messages = require('../../services/messages/messages');
const api = require('../../services/api/apiServices');
exports.roomsAvailable = async (req, res, _next) => {
  try {
    res.status(200).send();
    const body = req.body;
    const resUrl = body.response_url;

    //get all the information of rooms
    const rooms = await api.getAvailableRooms();

    // // create interactive message
    const message = messages.generateMessageForRooms(rooms, true);
    console.log(message);
    // // send message to the slack
    commandServices.sendMessageToSlackUrl(resUrl, message);
    console.log('everything is running');
  } catch (err) {
    return res.status(400).send(err.message);
  }
};
